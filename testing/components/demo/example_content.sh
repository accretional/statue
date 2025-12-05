#!/bin/bash
# Demo: content stack (ContentHeader + ContentBody + DirectoryContent + LatestContent + Footer + Sitemap).
set -euo pipefail

node testing/components/run.js \
  --component ContentHeader \
  --component ContentBody \
  --component DirectoryContent \
  --component LatestContent \
  --component Footer \
  --component Sitemap \
  --output_dir testing/components/output/demo-content

echo "Open testing/components/output/demo-content/ContentHeader_COMPOSITE.html (and other *_COMPOSITE.html files) for animated composite view."
