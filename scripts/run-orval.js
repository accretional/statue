#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runOrval() {
  try {
    const configPath = join(__dirname, '../site.config.json');
    const siteConfig = JSON.parse(readFileSync(configPath, 'utf-8'));

    // Only run orval if enabled in config
    const orvalEnabled = siteConfig?.orval?.runPreBuild ?? false;

    if (orvalEnabled) {
      console.log('Orval is enabled. Generating API client...');
      execSync('npm run generate-api', { stdio: 'inherit' });
      console.log('Orval API generation completed.');
    } else {
      console.log('Orval is disabled. Skipping API generation.');
    }
  } catch (error) {
    console.error('Error running orval:', error.message);
    process.exit(1);
  }
}

runOrval();
