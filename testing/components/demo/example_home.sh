#!/bin/bash
# Demo: homepage stack (NavigationBar + Hero + Stats + Categories + CTA + BuiltBy).
set -euo pipefail

node testing/components/run.js \
  --component NavigationBar \
  --component Hero \
  --component Stats \
  --component Categories \
  --component CTA \
  --component BuiltBy \
  --output_dir testing/components/output/demo-home

echo "Open testing/components/output/demo-home/NavigationBar_COMPOSITE.html (and other *_COMPOSITE.html files) for animated composite view."
