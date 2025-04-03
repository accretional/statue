#!/usr/bin/env node

import('../dist/cli.js').catch(err => {
  console.error('Error occurred while executing statue-ssg:', err);
  process.exit(1);
}); 