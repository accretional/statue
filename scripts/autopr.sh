#!/bin/bash
## autopr.sh - Automate PR submissions to Statue repo
#
# Usage:
#   ./autopr.sh component <Name> [subdir]   # Submit a Svelte component
#   ./autopr.sh theme <name>                # Submit a CSS theme
#   ./autopr.sh template <name>             # Submit a template
#   ./autopr.sh all <name>                  # Template + components + themes
#

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
    echo "  $0 all portfolio                      # Template + all custom components & themes"
    echo ""
    echo "Notes:"
    echo "  - For components: Looks for ComponentName.svelte (extension optional)"
    echo "    Searches current directory first, then subdirectories"
    echo "  - For themes: Looks for theme-name.css (extension optional)"
    echo "    Searches current directory first, then subdirectories"
    echo "  - For templates: Copies src/routes/, content/, site.config.js from current directory"
    echo "  - For all: Template + bundles all custom components and themes into the template"
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
            # Template: current dir (src/routes/, content/, site.config.js) -> templates/template-name/
            if [ ! -d "src/routes" ]; then
                log_error "src/routes/ directory not found in current directory"
                log_error "Make sure you're in the root of a Statue site"
                exit 1
            fi

            # Required files/directories
            SOURCE_PATHS+=("src/routes")
            DEST_PATHS+=("templates/$name/src/routes")

            if [ -d "content" ]; then
                SOURCE_PATHS+=("content")
                DEST_PATHS+=("templates/$name/content")
            else
                log_warn "content/ directory not found, skipping"
            fi

            if [ -f "site.config.js" ]; then
                SOURCE_PATHS+=("site.config.js")
                DEST_PATHS+=("templates/$name/site.config.js")
            else
                log_warn "site.config.js not found, skipping"
            fi

            # Optional: static directory
            if [ -d "static" ]; then
                log_info "Found static/ directory, including in template"
                SOURCE_PATHS+=("static")
                DEST_PATHS+=("templates/$name/static")
            fi

            BRANCH_NAME="$(generate_random_prefix)-template-${name}"
            COMMIT_MSG="Add $name template"
            PR_TITLE="Add $name template"
            PR_BODY="This PR adds the $name template to the library."
            ;;

        all)
            # All: Template + custom components + custom themes -> templates/template-name/
            if [ ! -d "src/routes" ]; then
                log_error "src/routes/ directory not found in current directory"
                log_error "Make sure you're in the root of a Statue site"
                exit 1
            fi

            log_info "Bundling complete template with custom components and themes..."

            # Required: routes
            SOURCE_PATHS+=("src/routes")
            DEST_PATHS+=("templates/$name/src/routes")

            # Optional: content
            if [ -d "content" ]; then
                SOURCE_PATHS+=("content")
                DEST_PATHS+=("templates/$name/content")
            else
                log_warn "content/ directory not found, skipping"
            fi

            # Optional: site.config.js
            if [ -f "site.config.js" ]; then
                SOURCE_PATHS+=("site.config.js")
                DEST_PATHS+=("templates/$name/site.config.js")
            else
                log_warn "site.config.js not found, skipping"
            fi

            # Optional: static
            if [ -d "static" ]; then
                log_info "Found static/ directory, including in template"
                SOURCE_PATHS+=("static")
                DEST_PATHS+=("templates/$name/static")
            fi

            # Optional: src/lib/index.ts (component exports)
            if [ -f "src/lib/index.ts" ]; then
                log_info "Found src/lib/index.ts, including in template"
                SOURCE_PATHS+=("src/lib/index.ts")
                DEST_PATHS+=("templates/$name/src/lib/index.ts")
            fi

            # Optional: src/lib/index.css (styles and theme imports)
            if [ -f "src/lib/index.css" ]; then
                log_info "Found src/lib/index.css, including in template"
                SOURCE_PATHS+=("src/lib/index.css")
                DEST_PATHS+=("templates/$name/src/lib/index.css")
            fi

            # Bundle custom components (if they exist)
            if [ -d "src/lib/components" ]; then
                log_info "Found custom components, bundling into template..."
                local component_count=0
                while IFS= read -r -d '' component_file; do
                    # Get relative path from src/lib/components/
                    local rel_path="${component_file#src/lib/components/}"
                    SOURCE_PATHS+=("$component_file")
                    DEST_PATHS+=("templates/$name/src/lib/components/$rel_path")
                    component_count=$((component_count + 1))
                done < <(find src/lib/components -type f -name "*.svelte" -print0)
                log_info "Bundled $component_count custom component(s)"
            else
                log_info "No custom components directory found (src/lib/components/)"
            fi

            # Bundle custom themes (if they exist)
            if [ -d "src/lib/themes" ]; then
                log_info "Found custom themes, bundling into template..."
                local theme_count=0
                while IFS= read -r -d '' theme_file; do
                    # Get relative path from src/lib/themes/
                    local rel_path="${theme_file#src/lib/themes/}"
                    SOURCE_PATHS+=("$theme_file")
                    DEST_PATHS+=("templates/$name/src/lib/themes/$rel_path")
                    theme_count=$((theme_count + 1))
                done < <(find src/lib/themes -type f -name "*.css" -print0)
                log_info "Bundled $theme_count custom theme(s)"
            else
                log_info "No custom themes directory found (src/lib/themes/)"
            fi

            BRANCH_NAME="$(generate_random_prefix)-all-${name}"
            COMMIT_MSG="Add $name template with custom components and themes"
            PR_TITLE="Add $name template (complete)"
            PR_BODY="This PR adds the $name template to the library, including custom components and themes."
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

    # Show what will be copied
    echo ""
    log_info "Files to copy:"
    for i in "${!SOURCE_PATHS[@]}"; do
        echo "  ${SOURCE_PATHS[$i]} -> ${DEST_PATHS[$i]}"
    done
    echo ""

    # Check gh CLI
    check_gh_cli

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

    # Copy all source -> dest pairs
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
