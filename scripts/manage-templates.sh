#!/bin/bash
## manage-templates.sh - Manage Statue SSG templates for development
#
# Usage:
#   manage-templates.sh load <templateName> [--force]   # Load template into workspace
#   manage-templates.sh save <templateName>             # Save workspace as template
#   manage-templates.sh list                            # List available templates
#

set -e  # Exit on error

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEMPLATES_DIR="$PROJECT_ROOT/templates"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
GRAY='\033[0;90m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}$1${NC}"
}

log_error() {
    echo -e "${RED}$1${NC}"
}

log_warn() {
    echo -e "${YELLOW}$1${NC}"
}

log_success() {
    echo -e "${GREEN}$1${NC}"
}

log_gray() {
    echo -e "${GRAY}$1${NC}"
}

# Show usage
show_usage() {
    cat << EOF
Template Manager - Manage Statue SSG templates for development

Usage:
  manage-templates.sh load <templateName> [--force]   Load a template into workspace
  manage-templates.sh save <templateName>             Save workspace as template
  manage-templates.sh list                            List available templates

Commands:
  load    Load a template into the workspace (src/routes, content)
  save    Save current workspace into a template folder
  list    List available templates

Examples:
  manage-templates.sh list
  manage-templates.sh load blog --force
  manage-templates.sh save my-template

EOF
}

# Load template into workspace
load_template() {
    local template_name="$1"
    local force=false
    
    # Parse options
    shift
    while [ $# -gt 0 ]; do
        case "$1" in
            --force|-f)
                force=true
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Special handling for 'default'
    if [ "$template_name" = "default" ]; then
        log_warn "⚠️  The \"default\" template lives in the project root (src/routes)."
        log_warn "   To restore the default template, please use git:"
        echo "   git checkout src/routes content site.config.js"
        return 0
    fi
    
    local source_template_dir="$TEMPLATES_DIR/$template_name"
    
    if [ ! -d "$source_template_dir" ]; then
        log_error "❌ Template '$template_name' not found in $TEMPLATES_DIR"
        return 1
    fi
    
    log_info "📂 Loading template '$template_name' into workspace..."
    
    if [ "$force" != "true" ]; then
        log_warn "⚠️  Warning: This will overwrite:"
        log_warn "   - src/routes/"
        log_warn "   - content/"
        log_warn "   - src/lib/components/ (if template has custom components)"
        log_warn "   - src/lib/themes/ (if template has custom themes)"
        log_warn "   - src/lib/index.ts and src/lib/index.css (if template has them)"
        log_warn "   Ensure you have committed your changes to \"default\" (or other templates)."
        log_error "Operation aborted. Use -f or --force to proceed."
        return 1
    fi
    
    # Targets in workspace
    local target_routes="$PROJECT_ROOT/src/routes"
    local target_content="$PROJECT_ROOT/content"
    local target_config="$PROJECT_ROOT/site.config.js"
    local target_lib_index_ts="$PROJECT_ROOT/src/lib/index.ts"
    local target_lib_index_css="$PROJECT_ROOT/src/lib/index.css"
    local target_lib_components="$PROJECT_ROOT/src/lib/components"
    local target_lib_themes="$PROJECT_ROOT/src/lib/themes"
    
    # 1. Clear current workspace
    log_gray "Cleaning current workspace..."
    rm -rf "$target_routes"/*
    rm -rf "$target_content"/*
    
    # 2. Copy from Template -> Workspace
    # Routes
    if [ -d "$source_template_dir/src/routes" ]; then
        cp -r "$source_template_dir/src/routes"/* "$target_routes/"
        log_gray "  ✓ Copied src/routes"
    fi
    
    # Content
    if [ -d "$source_template_dir/content" ]; then
        cp -r "$source_template_dir/content"/* "$target_content/"
        log_gray "  ✓ Copied content"
    fi
    
    # Config
    if [ -f "$source_template_dir/site.config.js" ]; then
        cp "$source_template_dir/site.config.js" "$target_config"
        log_gray "  ✓ Copied site.config.js"
    fi
    
    # src/lib/index.ts
    if [ -f "$source_template_dir/src/lib/index.ts" ]; then
        cp "$source_template_dir/src/lib/index.ts" "$target_lib_index_ts"
        log_gray "  ✓ Copied src/lib/index.ts"
    fi
    
    # src/lib/index.css
    if [ -f "$source_template_dir/src/lib/index.css" ]; then
        cp "$source_template_dir/src/lib/index.css" "$target_lib_index_css"
        log_gray "  ✓ Copied src/lib/index.css"
    fi
    
    # src/lib/components
    if [ -d "$source_template_dir/src/lib/components" ]; then
        rm -rf "$target_lib_components"
        mkdir -p "$target_lib_components"
        cp -r "$source_template_dir/src/lib/components"/* "$target_lib_components/"
        log_gray "  ✓ Copied src/lib/components"
    fi
    
    # src/lib/themes
    if [ -d "$source_template_dir/src/lib/themes" ]; then
        rm -rf "$target_lib_themes"
        mkdir -p "$target_lib_themes"
        cp -r "$source_template_dir/src/lib/themes"/* "$target_lib_themes/"
        log_gray "  ✓ Copied src/lib/themes"
    fi
    
    log_success "✅ Template '$template_name' loaded successfully!"
    log_warn "Run \"npm run dev\" to test it."
}

# Save workspace to template
save_template() {
    local template_name="$1"
    
    # Special handling for 'default'
    if [ "$template_name" = "default" ]; then
        log_success "✅  The \"default\" template is already in the project root."
        log_gray "   Just git commit your changes to save them."
        return 0
    fi
    
    local target_template_dir="$TEMPLATES_DIR/$template_name"
    
    log_info "💾 Saving workspace to template '$template_name'..."
    
    # Sources from workspace
    local source_routes="$PROJECT_ROOT/src/routes"
    local source_content="$PROJECT_ROOT/content"
    local source_config="$PROJECT_ROOT/site.config.js"
    local source_lib_index_ts="$PROJECT_ROOT/src/lib/index.ts"
    local source_lib_index_css="$PROJECT_ROOT/src/lib/index.css"
    local source_lib_components="$PROJECT_ROOT/src/lib/components"
    local source_lib_themes="$PROJECT_ROOT/src/lib/themes"
    
    # 1. Ensure template dir exists
    mkdir -p "$target_template_dir/src/lib"
    
    # 2. Copy Workspace -> Template
    # Routes
    if [ -d "$source_routes" ]; then
        rm -rf "$target_template_dir/src/routes"
        mkdir -p "$target_template_dir/src/routes"
        cp -r "$source_routes"/* "$target_template_dir/src/routes/"
        log_gray "  ✓ Saved src/routes"
    fi
    
    # Content
    if [ -d "$source_content" ]; then
        rm -rf "$target_template_dir/content"
        mkdir -p "$target_template_dir/content"
        cp -r "$source_content"/* "$target_template_dir/content/"
        log_gray "  ✓ Saved content"
    fi
    
    # Config
    if [ -f "$source_config" ]; then
        cp "$source_config" "$target_template_dir/site.config.js"
        log_gray "  ✓ Saved site.config.js"
    fi
    
    # src/lib/index.ts
    if [ -f "$source_lib_index_ts" ]; then
        cp "$source_lib_index_ts" "$target_template_dir/src/lib/index.ts"
        log_gray "  ✓ Saved src/lib/index.ts"
    fi
    
    # src/lib/index.css
    if [ -f "$source_lib_index_css" ]; then
        cp "$source_lib_index_css" "$target_template_dir/src/lib/index.css"
        log_gray "  ✓ Saved src/lib/index.css"
    fi
    
    # src/lib/components
    if [ -d "$source_lib_components" ]; then
        rm -rf "$target_template_dir/src/lib/components"
        mkdir -p "$target_template_dir/src/lib/components"
        cp -r "$source_lib_components"/* "$target_template_dir/src/lib/components/"
        log_gray "  ✓ Saved src/lib/components"
    fi
    
    # src/lib/themes
    if [ -d "$source_lib_themes" ]; then
        rm -rf "$target_template_dir/src/lib/themes"
        mkdir -p "$target_template_dir/src/lib/themes"
        cp -r "$source_lib_themes"/* "$target_template_dir/src/lib/themes/"
        log_gray "  ✓ Saved src/lib/themes"
    fi
    
    log_success "✅ Workspace saved to template '$template_name'!"
}

# List available templates
list_templates() {
    log_info "Available Templates:"
    echo " - default (Project Root)"
    
    if [ -d "$TEMPLATES_DIR" ]; then
        for dir in "$TEMPLATES_DIR"/*; do
            if [ -d "$dir" ]; then
                local template_name=$(basename "$dir")
                echo " - $template_name"
            fi
        done
    fi
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
        load)
            if [ $# -eq 0 ]; then
                log_error "Error: Template name required"
                echo ""
                show_usage
                exit 1
            fi
            load_template "$@"
            ;;
        
        save)
            if [ $# -eq 0 ]; then
                log_error "Error: Template name required"
                echo ""
                show_usage
                exit 1
            fi
            save_template "$@"
            ;;
        
        list)
            list_templates
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
