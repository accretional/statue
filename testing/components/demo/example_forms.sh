#!/bin/bash
# Demo: forms + notices (Signup + Warning + CollapsibleTree).
set -euo pipefail

node testing/components/run.js \
  --component Signup \
  --component Warning \
  --component CollapsibleTree \
  --output_dir testing/components/output/demo-forms

echo "Open testing/components/output/demo-forms/Signup_COMPOSITE.html (and other *_COMPOSITE.html files) for animated composite view."
