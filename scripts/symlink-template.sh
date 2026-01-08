#!/bin/bash
# symlink-template.sh - Symlink template files to root for development
# Usage: ./scripts/symlink-template.sh [template-name]
# Default template name is 'default'
#
# NOTE: This creates symlinks for template-specific files only.
# The src/lib directory contains the shared library and should NOT be symlinked.

set -e

TEMPLATE_NAME="${1:-default}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🔗 Symlinking '$TEMPLATE_NAME' template files to root..."

# Only symlink template-specific files, NOT the shared library
# src/lib is the shared library for all templates
LINKS=(
    "src/routes"
    "site.config.js"
)

# Optional: content if exists in template
if [ -d "templates/$TEMPLATE_NAME/content" ]; then
    LINKS+=("content")
fi

for link in "${LINKS[@]}"; do
    SOURCE="templates/$TEMPLATE_NAME/$link"
    TARGET="$link"

    # Create parent directory if target doesn't exist
    TARGET_DIR=$(dirname "$TARGET")
    if [ "$TARGET_DIR" != "." ] && [ ! -e "$TARGET_DIR" ]; then
        mkdir -p "$TARGET_DIR"
    fi

    # Remove existing symlink
    if [ -L "$TARGET" ]; then
        echo "  ✓ Removing existing symlink: $TARGET"
        rm "$TARGET"
    fi

    # Skip if target exists and is not a symlink (user may have custom files)
    if [ -e "$TARGET" ] && [ ! -L "$TARGET" ]; then
        echo "  ⚠ Skipping $TARGET (already exists, not a symlink)"
        continue
    fi

    # Create symlink
    echo "  ✓ Linking: $SOURCE → $TARGET"
    ln -s "$SOURCE" "$TARGET"
done

echo ""
echo "✨ Done! Template files are now symlinked to root."
echo "   You can now run 'npm run dev' to test changes."
echo ""
echo "   Note: These symlinks are gitignored."
echo "   Edit files directly in templates/$TEMPLATE_NAME/"
