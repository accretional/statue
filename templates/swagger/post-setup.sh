#!/bin/bash

# Swagger template post-setup script
# Adds prepare script to package.json so generate-api runs after npm install

PKG_FILE="$PROJECT_DIR/package.json"

if [ -f "$PKG_FILE" ]; then
  # Check if jq is available, otherwise use node
  if command -v jq &> /dev/null; then
    jq '.scripts.prepare = "npm run generate-api || true"' "$PKG_FILE" > "$PKG_FILE.tmp" && mv "$PKG_FILE.tmp" "$PKG_FILE"
  else
    # Use node as fallback
    node -e "
      const fs = require('fs');
      const pkg = JSON.parse(fs.readFileSync('$PKG_FILE', 'utf8'));
      pkg.scripts = pkg.scripts || {};
      pkg.scripts.prepare = 'npm run generate-api || true';
      fs.writeFileSync('$PKG_FILE', JSON.stringify(pkg, null, 2));
    "
  fi
  echo "✓ Added prepare script for API generation"
fi
