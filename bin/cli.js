#!/usr/bin/env node

try {
  // call Dist/cli.js 
  import('../dist/cli.js').catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
} catch (err) {
  console.error('Error:', err);
  process.exit(1);
} 