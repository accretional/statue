#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSEOFiles() {
	try {
		// Load site config from JSON
		const configPath = path.join(__dirname, '..', 'site.config.json');
		if (!fs.existsSync(configPath))
			return console.log('⚠️ site.config.json not found. Skipping SEO generation.');

		const siteConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

		// Get the site URL from config
		const siteUrl = siteConfig.site.url;

		console.log('🚀 Generating SEO files...');
		console.log(`🔗 Using site URL: ${siteUrl}`);

		// Generate sitemap using svelte-sitemap
		console.log('📄 Generating sitemap...');
		execSync(`npx svelte-sitemap --domain ${siteUrl}`, { stdio: 'inherit' });

		// Create robots.txt content
		const robotsContent = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

		// Write robots.txt to build directory
		const buildDir = path.join(__dirname, '..', 'build');
		const robotsPath = path.join(buildDir, 'robots.txt');

		// Ensure build directory exists
		if (!fs.existsSync(buildDir)) {
			console.error('❌ Build directory does not exist. Please run "npm run build" first.');
			process.exit(1);
		}

		// Write the robots.txt file
		fs.writeFileSync(robotsPath, robotsContent);

		console.log('✅ All SEO files generated successfully!');
		console.log(`📍 Sitemap: ${buildDir}/sitemap.xml`);
		console.log(`📍 Robots: ${robotsPath}`);
		console.log(`🌐 Sitemap URL: ${siteUrl}/sitemap.xml`);
	} catch (error) {
		console.error('❌ Error generating SEO files:', error.message);
		process.exit(1);
	}
}

generateSEOFiles();
