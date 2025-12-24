#!/bin/bash
## run-pagefind.sh - Run pagefind indexing if search is enabled
#
# Usage:
#   ./run-pagefind.sh
#

set -e  # Exit on error

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Main function
run_pagefind() {
    # Check if search is enabled in site.config.js
    local search_enabled
    search_enabled=$(node -e "
        import('$PROJECT_ROOT/site.config.js')
            .then(m => {
                const enabled = m.siteConfig?.search?.enabled ?? false;
                console.log(enabled);
            })
            .catch(e => {
                console.error('Error loading site.config.js:', e.message);
                process.exit(1);
            });
    " 2>&1)
    
    if [ $? -ne 0 ]; then
        log_error "Failed to load site.config.js"
        log_error "$search_enabled"
        exit 1
    fi
    
    if [ "$search_enabled" = "true" ]; then
        log_info "Search is enabled. Running pagefind indexing..."
        cd "$PROJECT_ROOT"
        npx pagefind --site build
        log_info "Pagefind indexing completed."
    else
        log_info "Search is disabled. Skipping pagefind indexing."
    fi
}

run_pagefind
