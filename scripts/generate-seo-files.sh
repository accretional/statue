#!/bin/bash
## generate-seo-files.sh - Generate sitemap.xml and robots.txt
#
# Usage:
#   ./generate-seo-files.sh
#

set -e  # Exit on error

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_success() {
    echo -e "${GREEN}$1${NC}"
}

# Main function
generate_seo_files() {
    log_info "🚀 Generating SEO files..."
    
    # Get site URL from site.config.js using node
    local site_url
    site_url=$(node -e "
        import('$PROJECT_ROOT/site.config.js')
            .then(m => console.log(m.siteConfig.site.url))
            .catch(e => {
                console.error('Error loading site.config.js:', e.message);
                process.exit(1);
            });
    " 2>&1)
    
    if [ $? -ne 0 ]; then
        log_error "Failed to load site.config.js"
        log_error "$site_url"
        exit 1
    fi
    
    log_info "🔗 Using site URL: $site_url"
    
    # Check if build directory exists
    local build_dir="$PROJECT_ROOT/build"
    if [ ! -d "$build_dir" ]; then
        log_error "❌ Build directory does not exist. Please run \"npm run build\" first."
        exit 1
    fi
    
    # Generate sitemap using svelte-sitemap
    log_info "📄 Generating sitemap..."
    cd "$PROJECT_ROOT"
    npx svelte-sitemap --domain "$site_url"
    
    # Create robots.txt
    log_info "📝 Generating robots.txt..."
    cat > "$build_dir/robots.txt" << EOF
User-agent: *
Allow: /

Sitemap: $site_url/sitemap.xml
EOF
    
    log_success "✅ All SEO files generated successfully!"
    echo "📍 Sitemap: $build_dir/sitemap.xml"
    echo "📍 Robots: $build_dir/robots.txt"
    echo "🌐 Sitemap URL: $site_url/sitemap.xml"
}

generate_seo_files
