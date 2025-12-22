#!/bin/bash

# =============================================================================
# Preview PR Script for Statue Templates
# =============================================================================
#
# This script allows Statue maintainers to preview template PRs submitted by
# contributors before merging them.
#
# Usage:
#   ./scripts/preview-pr.sh <pr-url>
#   ./scripts/preview-pr.sh <fork-repo-url> <branch-name>
#
# Examples:
#   ./scripts/preview-pr.sh https://github.com/accretional/statue/pull/49
#   ./scripts/preview-pr.sh https://github.com/username/statue.git branch-name
#
# What it does:
#   1. Creates a 'preview-template' directory in the current folder
#   2. Sets up a fresh Statue project
#   3. Clones the PR's fork and copies template files
#   4. Runs 'npm run dev' to preview the template
#
# Requirements: git, curl, node, npm
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Preview directory name
PREVIEW_DIR="preview-template"

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

# Show usage
show_usage() {
    echo "Usage:"
    echo "  $0 <pr-url>"
    echo "  $0 <fork-repo-url> <branch-name>"
    echo ""
    echo "Examples:"
    echo "  $0 https://github.com/accretional/statue/pull/49"
    echo "  $0 https://github.com/accretional/statue/pull/49/files"
    echo "  $0 https://github.com/semihpolat/statue.git lj40h-all-componet-semih-2"
    echo ""
    echo "This script will:"
    echo "  1. Create a '$PREVIEW_DIR' directory in the current folder"
    echo "  2. Set up a fresh Statue project"
    echo "  3. Copy the template files from the PR"
    echo "  4. Run npm run dev to preview"
}

# Parse PR URL and get fork info using GitHub API
get_pr_info() {
    local pr_url="$1"

    # Extract owner/repo and PR number from URL
    # Handles: https://github.com/accretional/statue/pull/49
    # Or: https://github.com/accretional/statue/pull/49/files
    local pr_pattern="github\.com/([^/]+)/([^/]+)/pull/([0-9]+)"

    if [[ $pr_url =~ $pr_pattern ]]; then
        local owner="${BASH_REMATCH[1]}"
        local repo="${BASH_REMATCH[2]}"
        local pr_number="${BASH_REMATCH[3]}"

        log_info "Fetching PR #$pr_number info from $owner/$repo..."

        # Get PR info from GitHub API (no auth required for public repos)
        local api_url="https://api.github.com/repos/$owner/$repo/pulls/$pr_number"
        local pr_data=$(curl -s "$api_url")

        # Check if we got valid data
        if echo "$pr_data" | grep -q '"message": "Not Found"'; then
            log_error "PR not found. Make sure the PR exists and the repository is public."
            exit 1
        fi

        # Extract fork clone URL and branch name using grep/sed (no jq needed)
        FORK_CLONE_URL=$(echo "$pr_data" | grep -o '"clone_url": "[^"]*"' | head -1 | sed 's/"clone_url": "//;s/"//')
        FORK_BRANCH=$(echo "$pr_data" | grep -o '"ref": "[^"]*"' | head -1 | sed 's/"ref": "//;s/"//')

        # The first clone_url is from "head" which is the fork
        # We need to be more specific - look for head.repo.clone_url
        # Using a different approach: get the head label which contains user:branch
        local head_label=$(echo "$pr_data" | grep -o '"label": "[^:]*:[^"]*"' | head -1 | sed 's/"label": "//;s/"//')
        local fork_user=$(echo "$head_label" | cut -d':' -f1)
        FORK_BRANCH=$(echo "$head_label" | cut -d':' -f2)

        # Construct the fork URL
        FORK_CLONE_URL="https://github.com/$fork_user/$repo.git"

        # Get the template name from PR files (look at which templates/ folder was modified)
        log_info "Detecting template name from PR files..."
        local files_url="https://api.github.com/repos/$owner/$repo/pulls/$pr_number/files"
        local files_data=$(curl -s "$files_url")

        # Extract template name from file paths like "templates/componet-semih-2/..."
        PR_TEMPLATE_NAME=$(echo "$files_data" | grep -o '"filename": "templates/[^/]*/' | head -1 | sed 's/"filename": "templates\///;s/\///')

        if [ -n "$PR_TEMPLATE_NAME" ]; then
            log_info "Detected template from PR: $PR_TEMPLATE_NAME"
        else
            log_warn "Could not detect template name from PR files, will use first found"
        fi

        if [ -z "$FORK_CLONE_URL" ] || [ -z "$FORK_BRANCH" ]; then
            log_error "Could not parse PR information from GitHub API"
            log_error "Fork URL: $FORK_CLONE_URL"
            log_error "Branch: $FORK_BRANCH"
            exit 1
        fi

        log_info "Fork repository: $FORK_CLONE_URL"
        log_info "Branch: $FORK_BRANCH"
    else
        log_error "Invalid PR URL format"
        show_usage
        exit 1
    fi
}

# Clean up preview directory if it exists
cleanup_preview_dir() {
    if [ -d "$PREVIEW_DIR" ]; then
        log_warn "Preview directory already exists: $PREVIEW_DIR"
        read -p "Do you want to delete it and start fresh? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_info "Removing existing preview directory..."
            rm -rf "$PREVIEW_DIR"
        else
            log_error "Cannot continue with existing directory. Exiting."
            exit 1
        fi
    fi
}

# Set up fresh Statue project
setup_statue_project() {
    log_info "Creating preview directory: $PREVIEW_DIR"
    mkdir -p "$PREVIEW_DIR"
    cd "$PREVIEW_DIR"

    log_info "Setting up fresh Statue project..."
    log_info "Running: yes | npx sv create . --template minimal --types ts --no-add-ons --install npm"

    yes | npx sv create . --template minimal --types ts --no-add-ons --install npm

    log_info "Installing statue-ssg..."
    npm install statue-ssg

    log_info "Initializing Statue..."
    npx statue init

    log_info "Installing dependencies..."
    npm install

    log_info "Statue project setup complete!"
}

# Clone fork and copy template files
copy_template_files() {
    local fork_url="$1"
    local branch="$2"

    log_info "Cloning fork repository to get template files..."

    # Create temp directory for cloning
    local temp_dir=$(mktemp -d)

    # Clone only the specific branch (shallow clone for speed)
    git clone --depth 1 --branch "$branch" "$fork_url" "$temp_dir/fork-repo"

    # Find the template directory in the fork
    # Templates are in templates/<template-name>/
    local templates_dir="$temp_dir/fork-repo/templates"

    if [ ! -d "$templates_dir" ]; then
        log_error "No templates directory found in the PR"
        rm -rf "$temp_dir"
        exit 1
    fi

    # Use template name from PR if detected, otherwise fall back to first directory
    local template_name=""
    if [ -n "$PR_TEMPLATE_NAME" ] && [ -d "$templates_dir/$PR_TEMPLATE_NAME" ]; then
        template_name="$PR_TEMPLATE_NAME"
    else
        # Fallback: get the first directory in templates/
        template_name=$(ls "$templates_dir" | head -1)
    fi

    if [ -z "$template_name" ]; then
        log_error "No template found in templates/ directory"
        rm -rf "$temp_dir"
        exit 1
    fi

    local template_path="$templates_dir/$template_name"
    log_info "Found template: $template_name"

    # Copy template files to preview directory (force overwrite)
    log_info "Copying template files..."

    # Copy src/routes if exists
    if [ -d "$template_path/src/routes" ]; then
        log_info "  Copying src/routes/..."
        rm -rf src/routes
        cp -r "$template_path/src/routes" src/routes
    fi

    # Copy content if exists
    if [ -d "$template_path/content" ]; then
        log_info "  Copying content/..."
        rm -rf content
        cp -r "$template_path/content" content
    fi

    # Copy site.config.js if exists
    if [ -f "$template_path/site.config.js" ]; then
        log_info "  Copying site.config.js..."
        cp -f "$template_path/site.config.js" site.config.js
    fi

    # Copy static if exists
    if [ -d "$template_path/static" ]; then
        log_info "  Copying static/..."
        cp -rf "$template_path/static"/* static/ 2>/dev/null || true
    fi

    # Copy src/lib/components if exists (custom components)
    if [ -d "$template_path/src/lib/components" ]; then
        log_info "  Copying custom components from: $template_path/src/lib/components"
        ls -la "$template_path/src/lib/components"
        mkdir -p src/lib
        rm -rf src/lib/components
        cp -r "$template_path/src/lib/components" src/lib/components
        log_info "  Components copied. Verifying:"
        ls -la src/lib/components
    else
        log_warn "  No components directory found at: $template_path/src/lib/components"
    fi

    # Copy src/lib/themes if exists (custom themes)
    if [ -d "$template_path/src/lib/themes" ]; then
        log_info "  Copying custom themes from: $template_path/src/lib/themes"
        mkdir -p src/lib
        rm -rf src/lib/themes
        cp -r "$template_path/src/lib/themes" src/lib/themes
        log_info "  Themes copied."
    else
        log_info "  No custom themes directory found (this is normal)"
    fi

    # Copy src/lib/index.ts if exists
    if [ -f "$template_path/src/lib/index.ts" ]; then
        log_info "  Copying src/lib/index.ts..."
        cp -f "$template_path/src/lib/index.ts" src/lib/index.ts
    fi

    # Copy src/lib/index.css if exists
    if [ -f "$template_path/src/lib/index.css" ]; then
        log_info "  Copying src/lib/index.css..."
        cp -f "$template_path/src/lib/index.css" src/lib/index.css
    fi

    # Cleanup temp directory
    rm -rf "$temp_dir"

    log_info "Template files copied successfully!"
}

# Run dev server
run_dev_server() {
    log_info "Installing any new dependencies..."
    npm install

    echo ""
    log_info "=========================================="
    log_info "  Preview is ready!"
    log_info "  Starting development server..."
    log_info "=========================================="
    echo ""

    npm run dev
}

# Main function
main() {
    if [ $# -lt 1 ]; then
        show_usage
        exit 1
    fi

    local first_arg="$1"

    # Check if it's a PR URL or direct fork/branch
    if [[ "$first_arg" == *"/pull/"* ]]; then
        # PR URL provided
        get_pr_info "$first_arg"
    elif [ $# -ge 2 ]; then
        # Fork URL and branch provided directly
        FORK_CLONE_URL="$1"
        FORK_BRANCH="$2"
        log_info "Using provided fork: $FORK_CLONE_URL"
        log_info "Branch: $FORK_BRANCH"
    else
        log_error "Invalid arguments"
        show_usage
        exit 1
    fi

    # Get the script's directory to return to it
    local start_dir=$(pwd)

    # Clean up existing preview directory
    cleanup_preview_dir

    # Set up Statue project
    setup_statue_project

    # Copy template files from fork
    copy_template_files "$FORK_CLONE_URL" "$FORK_BRANCH"

    # Run dev server
    run_dev_server
}

main "$@"