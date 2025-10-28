#!/bin/bash

set -e  # Exit on error

# Constants
UPSTREAM_REPO="https://github.com/accretional/statue.git"
REPO_NAME="statue"
TARGET_DIR="src/lib/components"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Get filename without extension
get_filename_without_ext() {
    local filepath="$1"
    local basename=$(basename "$filepath")
    echo "${basename%.*}"
}

# Main script
main() {
    if [ $# -ne 1 ]; then
        log_error "Usage: $0 <filepath>"
        exit 1
    fi

    local input_path="$1"
    local file_to_upload=""

    # Check if input path exists
    if [ ! -e "$input_path" ]; then
        log_error "Path does not exist: $input_path"
        exit 1
    fi

    # If it's a directory, find the first file in it
    if [ -d "$input_path" ]; then
        log_info "Input is a directory, finding a file within it..."
        file_to_upload=$(find "$input_path" -type f | head -n 1)
        if [ -z "$file_to_upload" ]; then
            log_error "No files found in directory: $input_path"
            exit 1
        fi
        log_info "Using file: $file_to_upload"
    else
        file_to_upload="$input_path"
    fi

    # Check gh CLI
    check_gh_cli

    # Get absolute path of the file
    file_to_upload=$(realpath "$file_to_upload")
    local filename=$(basename "$file_to_upload")
    local name_without_ext=$(get_filename_without_ext "$file_to_upload")
    
    # Generate branch name
    local random_prefix=$(generate_random_prefix)
    local branch_name="${random_prefix}-${name_without_ext}"
    
    log_info "Branch name will be: $branch_name"
    log_info "File to upload: $filename"

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
    log_info "Creating branch: $branch_name"
    git checkout -b "$branch_name"

    # Create target directory if it doesn't exist
    mkdir -p "$TARGET_DIR"

    # Copy file to target directory
    log_info "Copying $filename to $TARGET_DIR/"
    cp "$file_to_upload" "$TARGET_DIR/"

    # Git add, commit, and push
    git add "$TARGET_DIR/$filename"
    git commit -m "Add $filename to components"
    
    log_info "Pushing branch to fork..."
    git push -u origin "$branch_name"

    # Create pull request
    log_info "Creating pull request..."
    gh pr create \
        --repo "accretional/statue" \
        --title "Add $filename component" \
        --body "This PR adds $filename to the components library." \
        --head "${username}:${branch_name}" \
        --base main || \
    gh pr create \
        --repo "accretional/statue" \
        --title "Add $filename component" \
        --body "This PR adds $filename to the components library." \
        --head "${username}:${branch_name}" \
        --base master

    log_info "✅ Done! Pull request created successfully."
}

main "$@"
