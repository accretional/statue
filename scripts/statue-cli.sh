#!/bin/bash
## statue-cli.sh - Unified Statue SSG CLI
#
# Usage:
#   statue init [--template <name>]    # Initialize Statue SSG in your project
#   statue template <command> [args]   # Manage templates (load/save/list)
#   statue seo                         # Generate SEO files (sitemap, robots.txt)
#   statue search                      # Run pagefind search indexing
#

set -e  # Exit on error

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

log_success() {
    echo -e "${GREEN}$1${NC}"
}

# Show usage
show_usage() {
    cat << EOF
${CYAN}Statue SSG - SvelteKit Static Site Generator for Markdown Content${NC}

Usage:
  statue init [--template <name>]    Initialize Statue SSG in your project
  statue template <command> [args]   Manage templates (load/save/list)
  statue seo                         Generate SEO files (sitemap, robots.txt)
  statue search                      Run pagefind search indexing
  statue help                        Show this help message

Commands:
  init              Initialize Statue SSG with a template
  template load     Load a template into workspace
  template save     Save workspace as a template
  template list     List available templates
  seo               Generate sitemap.xml and robots.txt
  search            Index site for search functionality

Examples:
  statue init
  statue init --template blog
  statue template list
  statue template load blog --force
  statue seo
  statue search

EOF
}

# Main command router
main() {
    if [ $# -eq 0 ]; then
        show_usage
        exit 0
    fi

    local command="$1"
    shift

    case "$command" in
        init)
            # Call the existing postinstall.js with template option
            local template="default"
            while [ $# -gt 0 ]; do
                case "$1" in
                    --template|-t)
                        template="$2"
                        shift 2
                        ;;
                    *)
                        log_error "Unknown option: $1"
                        exit 1
                        ;;
                esac
            done
            
            log_info "Initializing Statue SSG with template: $template"
            npx statue-setup --template "$template"
            ;;
        
        template)
            "$SCRIPT_DIR/manage-templates.sh" "$@"
            ;;
        
        seo)
            "$SCRIPT_DIR/generate-seo-files.sh" "$@"
            ;;
        
        search)
            "$SCRIPT_DIR/run-pagefind.sh" "$@"
            ;;
        
        help|--help|-h)
            show_usage
            ;;
        
        *)
            log_error "Unknown command: $command"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

main "$@"
