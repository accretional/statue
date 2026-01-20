#!/bin/bash
# Validation script for Statue SSG contributions
# Detects contribution type and runs appropriate validation

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
ERRORS=0
WARNINGS=0

# Helper functions
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; WARNINGS=$((WARNINGS + 1)); }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; ERRORS=$((ERRORS + 1)); }
log_success() { echo -e "${GREEN}[✓]${NC} $1"; }

# Usage
show_usage() {
    echo "Usage:"
    echo "  $0 component <ComponentName.svelte> [subdir]"
    echo "  $0 theme <theme-name.css>"
    echo "  $0 template <template-name>"
    echo ""
    echo "Examples:"
    echo "  $0 component MyButton.svelte"
    echo "  $0 component MyButton.svelte forms"
    echo "  $0 theme sunset-orange.css"
    echo "  $0 template portfolio"
}

# Validate component
validate_component() {
    local component_file="$1"
    local subdir="${2:-}"

    log_info "Validating component: $component_file"

    # Check file exists
    if [[ ! -f "$component_file" ]]; then
        log_error "Component file not found: $component_file"
        return 1
    fi

    # Check file is valid Svelte
    if ! grep -q "<script" "$component_file" && ! grep -q "<style" "$component_file" && ! grep -q "<.*>" "$component_file"; then
        log_error "File does not appear to be a valid Svelte component"
    else
        log_success "Valid Svelte component structure"
    fi

    # Check for TypeScript usage (warning only)
    if grep -q '<script lang="ts">' "$component_file" || grep -q "<script lang='ts'>" "$component_file"; then
        log_success "Component uses TypeScript"
    else
        log_warn "Component does not use TypeScript (recommended but not required)"
        log_warn "  Consider adding: <script lang=\"ts\">"
    fi

    # Check for CSS variables usage
    if grep -q "var(--color-" "$component_file"; then
        log_success "Component uses CSS variables"
    else
        log_error "Component does not use CSS variables"
        log_error "  Required: Use var(--color-primary), var(--color-background), etc."
        log_error "  See: src/lib/themes/black-white.css for available variables"
    fi

    # Check for hardcoded colors (anti-pattern)
    if grep -E "(#[0-9a-fA-F]{3,6}|rgb\(|rgba\()" "$component_file" | grep -v "var(--" | grep -qv "^[[:space:]]*//"; then
        log_warn "Component may contain hardcoded colors"
        log_warn "  Use CSS variables instead: var(--color-primary)"
    fi

    # Check syntax validity (basic)
    if node -e "const fs=require('fs'); fs.readFileSync('$component_file', 'utf8');" 2>/dev/null; then
        log_success "Component file is readable"
    else
        log_error "Component file has encoding or read issues"
    fi

    # Check for props export
    if grep -q "export let" "$component_file"; then
        log_success "Component exports props"
    else
        log_warn "Component has no exported props (may be intentional)"
    fi

    # Auto-generate exports and verify
    local component_name=$(basename "$component_file" .svelte)
    log_info "Auto-generating exports..."
    if node scripts/generate-exports.js >/dev/null 2>&1; then
        if [[ -f "src/lib/index.ts" ]] && grep -q "export.*${component_name}" "src/lib/index.ts"; then
            log_success "Component auto-exported in src/lib/index.ts"
        else
            log_warn "Component not found after auto-generation - may need manual verification"
        fi
    else
        log_warn "Could not auto-generate exports - run 'npm run generate:exports' manually"
    fi

    # Check for documentation (warning only)
    if [[ -f "src/lib/components/COMPONENTS_README.md" ]]; then
        if grep -q "### ${component_name}" "src/lib/components/COMPONENTS_README.md"; then
            log_success "Component is documented in COMPONENTS_README.md"
        else
            log_warn "Component not documented in COMPONENTS_README.md"
            log_warn "  Consider adding documentation for ${component_name}"
        fi
    else
        log_warn "COMPONENTS_README.md not found - cannot verify documentation"
    fi

    return 0
}

# Validate theme
validate_theme() {
    local theme_file="$1"

    log_info "Validating theme: $theme_file"

    # Check file exists
    if [[ ! -f "$theme_file" ]]; then
        log_error "Theme file not found: $theme_file"
        return 1
    fi

    # Check for @theme block
    if grep -q "@theme" "$theme_file"; then
        log_success "Theme uses @theme block"
    else
        log_error "Theme missing @theme block"
        log_error "  Required format: @theme { ... }"
    fi

    # Required CSS variables (13 total)
    local required_vars=(
        "--color-background"
        "--color-card"
        "--color-border"
        "--color-foreground"
        "--color-muted"
        "--color-primary"
        "--color-secondary"
        "--color-accent"
        "--color-on-primary"
        "--color-on-background"
        "--color-hero-from"
        "--color-hero-via"
        "--color-hero-to"
    )

    local missing_vars=0
    for var in "${required_vars[@]}"; do
        if grep -q -- "$var:" "$theme_file"; then
            log_success "Found required variable: $var"
        else
            log_error "Missing required variable: $var"
            missing_vars=$((missing_vars + 1))
        fi
    done

    if [[ $missing_vars -eq 0 ]]; then
        log_success "All 13 required CSS variables present"
    else
        log_error "Missing $missing_vars required CSS variable(s)"
    fi

    # Check naming convention (lowercase-with-hyphens.css)
    local filename=$(basename "$theme_file")
    if [[ "$filename" =~ ^[a-z0-9-]+\.css$ ]]; then
        log_success "Theme follows naming convention: lowercase-with-hyphens.css"
    else
        log_error "Theme name must be lowercase-with-hyphens.css"
        log_error "  Got: $filename"
    fi

    # Check for valid CSS syntax (basic)
    if grep -E "^[[:space:]]*--[a-z-]+:[[:space:]]*#[0-9a-fA-F]{6}" "$theme_file" > /dev/null; then
        log_success "Theme contains valid CSS variable declarations"
    fi

    return 0
}

# Validate template
validate_template() {
    local template_dir="$1"

    log_info "Validating template: $template_dir"

    # Check directory exists
    if [[ ! -d "$template_dir" ]]; then
        log_error "Template directory not found: $template_dir"
        return 1
    fi

    # Check for required routes
    local routes_dir="$template_dir/src/routes"
    if [[ ! -d "$routes_dir" ]]; then
        log_error "Missing required directory: src/routes"
    else
        log_success "Found src/routes directory"
    fi

    # Check for [...slug] route
    if [[ -f "$routes_dir/[...slug]/+page.svelte" ]] && [[ -f "$routes_dir/[...slug]/+page.server.js" ]]; then
        log_success "Found required [...slug] route"

        # Check for prerender
        if grep -q "export const prerender = true" "$routes_dir/[...slug]/+page.server.js"; then
            log_success "[...slug]/+page.server.js has prerender = true"
        else
            log_error "[...slug]/+page.server.js missing: export const prerender = true"
        fi
    else
        log_error "Missing required route: [...slug]/+page.svelte and +page.server.js"
    fi

    # Check for [directory] route
    if [[ -f "$routes_dir/[directory]/+page.svelte" ]] && [[ -f "$routes_dir/[directory]/+page.server.js" ]]; then
        log_success "Found required [directory] route"

        # Check for prerender
        if grep -q "export const prerender = true" "$routes_dir/[directory]/+page.server.js"; then
            log_success "[directory]/+page.server.js has prerender = true"
        else
            log_error "[directory]/+page.server.js missing: export const prerender = true"
        fi
    else
        log_error "Missing required route: [directory]/+page.svelte and +page.server.js"
    fi

    # Check for $lib imports (not statue-ssg)
    log_info "Checking imports in route files..."
    local bad_imports=0
    while IFS= read -r -d '' file; do
        if grep -q "from 'statue-ssg'" "$file" || grep -q 'from "statue-ssg"' "$file"; then
            log_error "File uses 'statue-ssg' import instead of '\$lib': $(basename "$file")"
            log_error "  Change: import { Component } from 'statue-ssg'"
            log_error "  To:     import { Component } from '\$lib'"
            bad_imports=$((bad_imports + 1))
        fi
    done < <(find "$routes_dir" \( -name "*.svelte" -o -name "*.js" \) -print0 2>/dev/null)

    if [[ $bad_imports -eq 0 ]]; then
        log_success "All route files use '\$lib' imports"
    fi

    # Check for content directory
    if [[ -d "$template_dir/content" ]]; then
        log_success "Found content directory"
    else
        log_warn "No content directory (recommended but not required)"
    fi

    # Check for site.config.js
    if [[ -f "$template_dir/site.config.js" ]]; then
        log_success "Found site.config.js"
    else
        log_warn "No site.config.js (recommended but not required)"
    fi

    return 0
}

# Main validation dispatcher
validate() {
    local type="$1"
    shift

    case "$type" in
        component)
            validate_component "$@"
            ;;
        theme)
            validate_theme "$@"
            ;;
        template)
            validate_template "$@"
            ;;
        *)
            log_error "Unknown contribution type: $type"
            show_usage
            return 1
            ;;
    esac
}

# Main script
main() {
    if [[ $# -lt 2 ]]; then
        show_usage
        exit 1
    fi

    local type="$1"
    shift

    echo ""
    echo "========================================="
    echo " Statue SSG Contribution Validator"
    echo "========================================="
    echo ""

    validate "$type" "$@"

    echo ""
    echo "========================================="
    echo " Validation Summary"
    echo "========================================="

    if [[ $ERRORS -eq 0 ]]; then
        log_success "Validation passed with $WARNINGS warning(s)"
        echo ""
        if [[ $WARNINGS -gt 0 ]]; then
            echo "You may proceed, but consider addressing the warnings above."
        fi
        exit 0
    else
        echo -e "${RED}Validation failed with $ERRORS error(s) and $WARNINGS warning(s)${NC}"
        echo ""
        echo "Please fix the errors above before submitting."
        echo "See documentation:"
        echo "  - Components: ADDING_COMPONENTS.md"
        echo "  - Themes: ADDING_THEMES.md"
        echo "  - Templates: ADDING_TEMPLATES.md"
        echo ""
        exit 1
    fi
}

main "$@"
