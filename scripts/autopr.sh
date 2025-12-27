#!/bin/bash
## autopr.sh - Automate PR submissions to Statue repo
#
# Usage:
#   ./autopr.sh component <Name> [subdir]   # Submit a Svelte component
#   ./autopr.sh theme <name>                # Submit a CSS theme
#   ./autopr.sh template <name>             # Submit a template
#   ./autopr.sh all <name>                  # Tem\\\\\

set -e  # Exit on error

# Constants
UPSTREAM_REPO="https://github.com/accretional/statue.git"
REPO_NAME="statue"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Open URL in browser
open_browser() {
    local url="$1"
    if command -v xdg-open &> /dev/null; then
        xdg-open "$url" &> /dev/null
    elif command -v open &> /dev/null; then
        open "$url"
    else
        log_warn "Could not open browser automatically. Please visit: $url"
    fi
}

# Install gh CLI
install_gh_cli() {
    log_info "Attempting to install GitHub CLI (gh)..."

    # Check for Homebrew (macOS/Linux)
    if command -v brew &> /dev/null; then
        log_info "Homebrew detected. Installing gh via brew..."
        brew install gh
        return 0
    fi

    # Check for apt (Debian/Ubuntu Linux)
    if command -v apt &> /dev/null; then
        log_info "APT detected. Installing gh via apt..."
        (type -p wget >/dev/null || (sudo apt update && sudo apt install wget -y)) \
            && sudo mkdir -p -m 755 /etc/apt/keyrings \
            && out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
            && cat $out | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
            && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
            && sudo mkdir -p -m 755 /etc/apt/sources.list.d \
            && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
            && sudo apt update \
            && sudo apt install gh -y
        return 0
    fi

    # Fallback: open browser and prompt user
    log_error "Could not automatically install gh CLI (no brew or apt found)."
    log_info "Opening browser to GitHub CLI releases page..."
    open_browser "https://github.com/cli/cli/releases/"
    echo ""
    echo "Please install the GitHub CLI from the releases page and run this script again."
    echo "Installation instructions: https://github.com/cli/cli#installation"
    exit 1
}

# Check if gh CLI is installed and authenticated
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        log_warn "GitHub CLI (gh) is not installed."
        read -p "Would you like to install it now? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_gh_cli
            # Verify installation
            if ! command -v gh &> /dev/null; then
                log_error "Installation failed or gh is not in PATH. Please install manually."
                exit 1
            fi
            log_info "GitHub CLI installed successfully!"
        else
            log_error "GitHub CLI is required. Exiting."
            exit 1
        fi
    fi

    if ! gh auth status &> /dev/null; then
        log_warn "You are not authenticated with GitHub CLI."
        echo "Please authenticate now..."
        gh auth login
        if ! gh auth status &> /dev/null; then
            log_error "Authentication failed. Exiting."
            exit 1
        fi
    fi
    log_info "GitHub CLI authenticated successfully."
}

# Generate random prefix (5 alphanumeric characters)
generate_random_prefix() {
    cat /dev/urandom | LC_ALL=C tr -dc 'a-z0-9' | fold -w 5 | head -n 1
}

# Show usage
show_usage() {
    echo "Usage:"
    echo "  $0 component <ComponentName> [subdir]"
    echo "  $0 theme <theme-name>"
    echo "  $0 template <template-name>"
    echo "  $0 all <template-name>"
    echo ""
    echo "Examples:"
    echo "  $0 component MyButton"
    echo "  $0 component MyButton.svelte          # Extension optional"
    echo "  $0 component MyButton forms           # With subdirectory"
    echo "  $0 theme sunset-orange"
    echo "  $0 theme sunset-orange.css            # Extension optional"
    echo "  $0 template portfolio"
    echo "  $0 all portfolio                      # Same as template (legacy alias)"
    echo ""
    echo "Notes:"
    echo "  - For components: Looks for ComponentName.svelte (extension optional)"
    echo "    Searches current directory first, then subdirectories"
    echo "  - For themes: Looks for theme-name.css (extension optional)"
    echo "    Searches current directory first, then subdirectories"
    echo "  - For templates: DIFF-BASED - only saves files different from default:"
    echo "      * src/ (only new/modified files)"
    echo "      * static/ (only new/modified files)"
    echo "      * content/ (only new/modified files)"
    echo "      * site.config.js (only if modified)"
    echo "      * package.json (template-specific dependencies only)"
    echo "  - For all: Same as template (legacy command, kept for compatibility)"
}

# ============================================================
# DIFF HELPERS - Compare files against default (cloned repo)
# ============================================================

# Compare two files and return 0 if they are identical
files_are_equal() {
    local file1="$1"
    local file2="$2"

    if [ ! -f "$file1" ] || [ ! -f "$file2" ]; then
        return 1
    fi

    # Compare using diff
    diff -q "$file1" "$file2" > /dev/null 2>&1
}

# Get files that are different or new compared to default
# Usage: get_diff_files <source_dir> <default_dir>
# Outputs: List of relative paths that should be copied
get_diff_files() {
    local source_dir="$1"
    local default_dir="$2"

    if [ ! -d "$source_dir" ]; then
        return
    fi

    # Find all files in source
    while IFS= read -r -d '' file; do
        local rel_path="${file#$source_dir/}"
        local default_file="$default_dir/$rel_path"

        if [ ! -f "$default_file" ]; then
            # New file - not in default
            echo "$rel_path"
        elif ! files_are_equal "$file" "$default_file"; then
            # Modified file - different from default
            echo "$rel_path"
        fi
        # If files are equal, skip (don't output)
    done < <(find "$source_dir" -type f -print0)
}

# Copy only diff files from source to destination
# Usage: copy_diff_files <source_dir> <dest_dir> <default_dir>
copy_diff_files() {
    local source_dir="$1"
    local dest_dir="$2"
    local default_dir="$3"
    local count=0

    local diff_files=$(get_diff_files "$source_dir" "$default_dir")

    if [ -z "$diff_files" ]; then
        return 0
    fi

    while IFS= read -r rel_path; do
        if [ -n "$rel_path" ]; then
            local src_file="$source_dir/$rel_path"
            local dst_file="$dest_dir/$rel_path"

            mkdir -p "$(dirname "$dst_file")"
            cp "$src_file" "$dst_file"
            count=$((count + 1))
        fi
    done <<< "$diff_files"

    echo $count
}

# Parse arguments and set up source/dest pairs
# Returns: Sets global arrays SOURCE_PATHS and DEST_PATHS, and variables BRANCH_NAME, COMMIT_MSG, PR_TITLE, PR_BODY
parse_args() {
    if [ $# -lt 2 ]; then
        show_usage
        exit 1
    fi

    local contrib_type="$1"
    local name="$2"
    local subdir="${3:-}"  # Optional third argument

    # Initialize arrays
    SOURCE_PATHS=()
    DEST_PATHS=()

    case "$contrib_type" in
        component)
            # Component: ComponentName.svelte -> src/lib/components/[subdir/]ComponentName.svelte
            # Strip .svelte extension if user provided it
            local clean_name="${name%.svelte}"
            local component_file="${clean_name}.svelte"

            # Try to find the file
            local found_file=""
            if [ -f "$component_file" ]; then
                found_file="$component_file"
            else
                # Search in subdirectories
                log_info "File not found in current directory, searching subdirectories..."
                found_file=$(find . -name "$component_file" -type f | head -n 1)
                if [ -z "$found_file" ]; then
                    log_error "Component file not found: $component_file"
                    log_error "Searched current directory and subdirectories"
                    exit 1
                fi
                log_info "Found: $found_file"
            fi

            local dest_path="src/lib/components"
            if [ -n "$subdir" ]; then
                dest_path="$dest_path/$subdir"
            fi
            dest_path="$dest_path/$component_file"

            SOURCE_PATHS+=("$found_file")
            DEST_PATHS+=("$dest_path")

            BRANCH_NAME="$(generate_random_prefix)-${clean_name}"
            COMMIT_MSG="Add $clean_name component"
            PR_TITLE="Add $clean_name component"
            PR_BODY="This PR adds the $clean_name component to the library."
            if [ -n "$subdir" ]; then
                PR_BODY="$PR_BODY (in $subdir subdirectory)"
            fi
            ;;

        theme)
            # Theme: theme-name.css -> src/lib/themes/theme-name.css
            # Strip .css extension if user provided it
            local clean_name="${name%.css}"
            local theme_file="${clean_name}.css"

            # Try to find the file
            local found_file=""
            if [ -f "$theme_file" ]; then
                found_file="$theme_file"
            else
                # Search in subdirectories
                log_info "File not found in current directory, searching subdirectories..."
                found_file=$(find . -name "$theme_file" -type f | head -n 1)
                if [ -z "$found_file" ]; then
                    log_error "Theme file not found: $theme_file"
                    log_error "Searched current directory and subdirectories"
                    exit 1
                fi
                log_info "Found: $found_file"
            fi

            SOURCE_PATHS+=("$found_file")
            DEST_PATHS+=("src/lib/themes/$theme_file")

            BRANCH_NAME="$(generate_random_prefix)-theme-${clean_name}"
            COMMIT_MSG="Add $clean_name theme"
            PR_TITLE="Add $clean_name theme"
            PR_BODY="This PR adds the $clean_name theme to the library."
            ;;

        template)
            # Template: DIFF-BASED - only files different from default
            if [ ! -d "src" ]; then
                log_error "src/ directory not found in current directory"
                log_error "Make sure you're in the root of a Statue site"
                exit 1
            fi

            # Mark this as a diff-based template submission
            USE_DIFF_MODE="true"
            TEMPLATE_NAME="$name"

            # Store workspace paths for diff comparison (will be processed in create_pr)
            WORKSPACE_SRC="$(realpath src)"
            WORKSPACE_STATIC="$(realpath static 2>/dev/null || echo "")"
            WORKSPACE_CONTENT="$(realpath content 2>/dev/null || echo "")"
            WORKSPACE_CONFIG="$(realpath site.config.js 2>/dev/null || echo "")"

            log_info "Template will be saved using DIFF-BASED mode"
            log_info "Only files different from default will be included"

            # Optional: package.json (for template-specific dependencies)
            if [ -f "package.json" ]; then
                log_info "Processing package.json for template-specific dependencies..."

                TEMP_PKG=$(mktemp)
                node -e "
                    const fs = require('fs');
                    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

                    const coreDeps = new Set(['statue-ssg', 'marked', 'gray-matter', 'chalk', 'commander', 'fs-extra']);
                    const coreDevDeps = new Set([
                        '@sveltejs/adapter-static', '@sveltejs/kit', '@sveltejs/vite-plugin-svelte',
                        '@tailwindcss/postcss', 'autoprefixer', 'postcss', 'tailwindcss',
                        '@types/node', 'typescript', 'vite', 'svelte', 'pagefind'
                    ]);

                    const result = {};

                    if (pkg.dependencies) {
                        const deps = {};
                        for (const [k, v] of Object.entries(pkg.dependencies)) {
                            if (!coreDeps.has(k)) deps[k] = v;
                        }
                        if (Object.keys(deps).length) result.dependencies = deps;
                    }

                    if (pkg.devDependencies) {
                        const deps = {};
                        for (const [k, v] of Object.entries(pkg.devDependencies)) {
                            if (!coreDevDeps.has(k)) deps[k] = v;
                        }
                        if (Object.keys(deps).length) result.devDependencies = deps;
                    }

                    if (Object.keys(result).length) {
                        fs.writeFileSync('$TEMP_PKG', JSON.stringify(result, null, 2));
                        console.log('HAS_DEPS');
                    } else {
                        console.log('NO_DEPS');
                    }
                " 2>/dev/null

                if [ -s "$TEMP_PKG" ]; then
                    TEMPLATE_PKG_PATH="$TEMP_PKG"
                    log_info "Including template-specific dependencies from package.json"
                fi
            fi

            BRANCH_NAME="$(generate_random_prefix)-template-${name}"
            COMMIT_MSG="Add $name template (diff-based)"
            PR_TITLE="Add $name template"
            PR_BODY="This PR adds the $name template to the library.

**DIFF-BASED**: Only includes files that are different from the default template.
When loaded, this template will be overlaid on top of the default template.

May include:
- src/ (only new/modified routes, components, themes)
- content/ (only new/modified content files)
- static/ (only new/modified assets)
- site.config.js (only if modified)
- Template-specific dependencies (if any)"
            ;;

        all)
            # All: Same as template (legacy alias) - DIFF-BASED
            if [ ! -d "src" ]; then
                log_error "src/ directory not found in current directory"
                log_error "Make sure you're in the root of a Statue site"
                exit 1
            fi

            # Mark this as a diff-based template submission (same as template)
            USE_DIFF_MODE="true"
            TEMPLATE_NAME="$name"

            WORKSPACE_SRC="$(realpath src)"
            WORKSPACE_STATIC="$(realpath static 2>/dev/null || echo "")"
            WORKSPACE_CONTENT="$(realpath content 2>/dev/null || echo "")"
            WORKSPACE_CONFIG="$(realpath site.config.js 2>/dev/null || echo "")"

            log_info "Template will be saved using DIFF-BASED mode (same as 'template' command)"
            log_info "Only files different from default will be included"

            # Optional: package.json
            if [ -f "package.json" ]; then
                log_info "Processing package.json for template-specific dependencies..."

                TEMP_PKG=$(mktemp)
                node -e "
                    const fs = require('fs');
                    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

                    const coreDeps = new Set(['statue-ssg', 'marked', 'gray-matter', 'chalk', 'commander', 'fs-extra']);
                    const coreDevDeps = new Set([
                        '@sveltejs/adapter-static', '@sveltejs/kit', '@sveltejs/vite-plugin-svelte',
                        '@tailwindcss/postcss', 'autoprefixer', 'postcss', 'tailwindcss',
                        '@types/node', 'typescript', 'vite', 'svelte', 'pagefind'
                    ]);

                    const result = {};

                    if (pkg.dependencies) {
                        const deps = {};
                        for (const [k, v] of Object.entries(pkg.dependencies)) {
                            if (!coreDeps.has(k)) deps[k] = v;
                        }
                        if (Object.keys(deps).length) result.dependencies = deps;
                    }

                    if (pkg.devDependencies) {
                        const deps = {};
                        for (const [k, v] of Object.entries(pkg.devDependencies)) {
                            if (!coreDevDeps.has(k)) deps[k] = v;
                        }
                        if (Object.keys(deps).length) result.devDependencies = deps;
                    }

                    if (Object.keys(result).length) {
                        fs.writeFileSync('$TEMP_PKG', JSON.stringify(result, null, 2));
                        console.log('HAS_DEPS');
                    } else {
                        console.log('NO_DEPS');
                    }
                " 2>/dev/null

                if [ -s "$TEMP_PKG" ]; then
                    TEMPLATE_PKG_PATH="$TEMP_PKG"
                    log_info "Including template-specific dependencies from package.json"
                fi
            fi

            BRANCH_NAME="$(generate_random_prefix)-all-${name}"
            COMMIT_MSG="Add $name template (diff-based)"
            PR_TITLE="Add $name template"
            PR_BODY="This PR adds the $name template to the library.

**DIFF-BASED**: Only includes files that are different from the default template.
When loaded, this template will be overlaid on top of the default template.

May include:
- src/ (only new/modified routes, components, themes)
- content/ (only new/modified content files)
- static/ (only new/modified assets)
- site.config.js (only if modified)
- Template-specific dependencies (if any)"
            ;;

        *)
            log_error "Unknown contribution type: $contrib_type"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

# Generic function to create PR with source/dest pairs
create_pr() {
    log_info "Creating PR for: $PR_TITLE"
    log_info "Branch name: $BRANCH_NAME"

    # Check gh CLI
    check_gh_cli

    # For non-diff mode, show what will be copied
    if [ "$USE_DIFF_MODE" != "true" ]; then
        echo ""
        log_info "Files to copy:"
        for i in "${!SOURCE_PATHS[@]}"; do
            echo "  ${SOURCE_PATHS[$i]} -> ${DEST_PATHS[$i]}"
        done
        echo ""

        # Get absolute paths for all sources
        local abs_sources=()
        for source in "${SOURCE_PATHS[@]}"; do
            if [ -e "$source" ]; then
                abs_sources+=("$(realpath "$source")")
            else
                log_error "Source path does not exist: $source"
                exit 1
            fi
        done
    fi

    # Create temporary directory for git operations
    local temp_dir=$(mktemp -d)
    log_info "Working in temporary directory: $temp_dir"

    # Cleanup function
    cleanup() {
        log_info "Cleaning up temporary directory..."
        rm -rf "$temp_dir"
    }
    trap cleanup EXIT

    cd "$temp_dir"

    # Fork the repository
    log_info "Forking repository $UPSTREAM_REPO..."
    gh repo fork "$UPSTREAM_REPO" --clone=false || {
        log_warn "Fork might already exist, continuing..."
    }

    # Get the fork URL
    local username=$(gh api user --jq .login)
    local fork_url="https://github.com/${username}/${REPO_NAME}.git"

    log_info "Cloning fork from $fork_url..."
    gh repo clone "$fork_url" "$REPO_NAME"

    cd "$REPO_NAME"

    # Create and checkout new branch
    log_info "Creating branch: $BRANCH_NAME"
    git checkout -b "$BRANCH_NAME"

    # ================================================================
    # DIFF MODE: For templates - only copy files different from default
    # ================================================================
    if [ "$USE_DIFF_MODE" = "true" ]; then
        log_info "Using DIFF-BASED mode for template '$TEMPLATE_NAME'"
        log_info "Comparing workspace files against cloned repo (default)..."

        local template_dest="templates/$TEMPLATE_NAME"
        local total_files=0

        # Default paths in cloned repo
        local default_src="src"
        local default_static="static"
        local default_content="content"
        local default_config="site.config.js"

        # 1. Handle src folder (diff-based)
        if [ -n "$WORKSPACE_SRC" ] && [ -d "$WORKSPACE_SRC" ]; then
            log_info "Comparing src/ ..."
            local src_count=$(copy_diff_files "$WORKSPACE_SRC" "$template_dest/src" "$default_src")
            if [ "$src_count" -gt 0 ] 2>/dev/null; then
                log_info "  Copied $src_count different/new files from src/"
                total_files=$((total_files + src_count))
            else
                log_info "  No changes in src/ (all files match default)"
            fi
        fi

        # 2. Handle static folder (diff-based)
        if [ -n "$WORKSPACE_STATIC" ] && [ -d "$WORKSPACE_STATIC" ]; then
            log_info "Comparing static/ ..."
            local static_count=$(copy_diff_files "$WORKSPACE_STATIC" "$template_dest/static" "$default_static")
            if [ "$static_count" -gt 0 ] 2>/dev/null; then
                log_info "  Copied $static_count different/new files from static/"
                total_files=$((total_files + static_count))
            else
                log_info "  No changes in static/ (all files match default)"
            fi
        fi

        # 3. Handle content folder (diff-based)
        if [ -n "$WORKSPACE_CONTENT" ] && [ -d "$WORKSPACE_CONTENT" ]; then
            log_info "Comparing content/ ..."
            local content_count=$(copy_diff_files "$WORKSPACE_CONTENT" "$template_dest/content" "$default_content")
            if [ "$content_count" -gt 0 ] 2>/dev/null; then
                log_info "  Copied $content_count different/new files from content/"
                total_files=$((total_files + content_count))
            else
                log_info "  No changes in content/ (all files match default)"
            fi
        fi

        # 4. Handle site.config.js (diff-based)
        if [ -n "$WORKSPACE_CONFIG" ] && [ -f "$WORKSPACE_CONFIG" ]; then
            if ! files_are_equal "$WORKSPACE_CONFIG" "$default_config"; then
                mkdir -p "$template_dest"
                cp "$WORKSPACE_CONFIG" "$template_dest/site.config.js"
                log_info "  Copied site.config.js (modified)"
                total_files=$((total_files + 1))
            else
                log_info "  site.config.js unchanged (matches default)"
            fi
        fi

        # 5. Handle package.json (template-specific deps)
        if [ -n "$TEMPLATE_PKG_PATH" ] && [ -f "$TEMPLATE_PKG_PATH" ]; then
            mkdir -p "$template_dest"
            cp "$TEMPLATE_PKG_PATH" "$template_dest/package.json"
            log_info "  Copied package.json (template dependencies)"
            total_files=$((total_files + 1))
        fi

        # Check if any files were copied
        if [ "$total_files" -eq 0 ]; then
            log_warn "No differences found! Template would be empty."
            log_warn "Your workspace files are identical to the default template."
            log_error "Aborting PR creation - nothing to submit."
            exit 1
        fi

        log_info "Total: $total_files files will be included in template"

        # Git add all template files
        git add "$template_dest"

    # ================================================================
    # NORMAL MODE: For components/themes - copy files directly
    # ================================================================
    else
        for i in "${!abs_sources[@]}"; do
            local src="${abs_sources[$i]}"
            local dest="${DEST_PATHS[$i]}"

            log_info "Copying: $(basename "$src") -> $dest"

            # Create destination directory
            mkdir -p "$(dirname "$dest")"

            # Copy file or directory
            if [ -d "$src" ]; then
                cp -r "$src" "$dest"
            else
                cp "$src" "$dest"
            fi

            # Git add
            git add "$dest"
        done
    fi

    # Commit
    git commit -m "$COMMIT_MSG"

    log_info "Pushing branch to fork..."
    git push -u origin "$BRANCH_NAME"

    # Create pull request
    log_info "Creating pull request..."
    gh pr create \
        --repo "accretional/statue" \
        --title "$PR_TITLE" \
        --body "$PR_BODY" \
        --head "${username}:${BRANCH_NAME}" \
        --base main || \
    gh pr create \
        --repo "accretional/statue" \
        --title "$PR_TITLE" \
        --body "$PR_BODY" \
        --head "${username}:${BRANCH_NAME}" \
        --base master

    log_info "✅ Done! Pull request created successfully."
}

# Validate contribution before creating PR
validate_contribution() {
    log_info "Running validation checks..."

    # Find validation script
    local validation_script="$(dirname "$0")/validate-contribution.sh"
    if [[ ! -x "$validation_script" ]]; then
        log_error "Validation script not found or not executable: $validation_script"
        exit 1
    fi

    # Determine validation command based on contribution type
    case "$1" in
        component)
            local clean_name="${2%.svelte}"
            local component_file="${clean_name}.svelte"

            # Find the file
            local found_file=""
            if [ -f "$component_file" ]; then
                found_file="$component_file"
            else
                found_file=$(find . -name "$component_file" -type f | head -n 1)
            fi

            if [[ -n "$found_file" ]]; then
                $validation_script component "$found_file" "${3:-}"
            else
                log_error "Component file not found for validation"
                exit 1
            fi
            ;;

        theme)
            local clean_name="${2%.css}"
            local theme_file="${clean_name}.css"

            # Find the file
            local found_file=""
            if [ -f "$theme_file" ]; then
                found_file="$theme_file"
            else
                found_file=$(find . -name "$theme_file" -type f | head -n 1)
            fi

            if [[ -n "$found_file" ]]; then
                $validation_script theme "$found_file"
            else
                log_error "Theme file not found for validation"
                exit 1
            fi
            ;;

        template|all)
            $validation_script template "."
            ;;

        *)
            log_warn "Skipping validation for unknown type: $1"
            ;;
    esac

    log_info "✅ Validation passed!"
}

# Main script
main() {
    # Parse arguments and set up source/dest pairs
    parse_args "$@"

    # Validate contribution before creating PR
    validate_contribution "$1" "${2:-}" "${3:-}"

    # Create PR with the configured pairs
    create_pr
}

main "$@"
