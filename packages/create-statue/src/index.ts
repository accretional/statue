import * as p from '@clack/prompts';
import path from 'node:path';
import { createRequire } from 'node:module';
import fs from 'fs-extra';
import spawn from 'cross-spawn';
import pc from 'picocolors';

const require = createRequire(import.meta.url);

function getStatueSsgPath() {
	// Use require.resolve to find statue-ssg regardless of where npx runs from
	try {
		const pkgPath = require.resolve('statue-ssg/package.json');
		return path.dirname(pkgPath);
	} catch {
		return null;
	}
}

function getAvailableTemplates() {
	const statuePath = getStatueSsgPath();
	const templates = [{ value: 'default', label: 'Default (recommended)' }];

	if (statuePath) {
		const templatesDir = path.join(statuePath, 'templates');
		if (fs.existsSync(templatesDir)) {
			const dirs = fs.readdirSync(templatesDir).filter((f) =>
				fs.statSync(path.join(templatesDir, f)).isDirectory()
			);
			for (const dir of dirs) {
				const label = dir
					.split('-')
					.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
					.join(' ');
				templates.push({ value: dir, label });
			}
		}
	}

	return templates;
}

function getAvailableThemes() {
	const statuePath = getStatueSsgPath();

	// Fallback themes if statue-ssg not found
	const fallbackThemes = [
		{ value: 'black-white', label: 'Black White (recommended)' },
		{ value: 'black-red', label: 'Black Red' },
		{ value: 'blue', label: 'Blue' },
		{ value: 'charcoal', label: 'Charcoal' },
		{ value: 'cyan', label: 'Cyan' },
		{ value: 'green', label: 'Green' },
		{ value: 'orange', label: 'Orange' },
		{ value: 'pink', label: 'Pink' },
		{ value: 'purple', label: 'Purple' },
		{ value: 'red', label: 'Red' }
	];

	if (!statuePath) {
		return fallbackThemes;
	}

	const themesDir = path.join(statuePath, 'src', 'lib', 'themes');
	const themes: { value: string; label: string }[] = [];

	if (fs.existsSync(themesDir)) {
		const files = fs.readdirSync(themesDir).filter(
			(f) => f.endsWith('.css') && !f.includes('template')
		);
		for (const file of files) {
			const name = file.replace('.css', '');
			const label = name
				.split('-')
				.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
				.join(' ');
			// Put black-white first as recommended
			if (name === 'black-white') {
				themes.unshift({ value: name, label: `${label} (recommended)` });
			} else {
				themes.push({ value: name, label });
			}
		}
	}

	return themes.length > 0 ? themes : fallbackThemes;
}

async function main() {
	const args = process.argv.slice(2);
	const projectNameArg = args.find((a) => !a.startsWith('-'));
	const useDefaults = args.includes('--yes') || args.includes('-y');

	if (args.includes('--help') || args.includes('-h')) {
		showHelp();
		return;
	}

	console.log();

	// 1. Project name
	const projectName =
		projectNameArg ??
		(await p.text({
			message: 'What is your project named?',
			placeholder: 'my-statue-site',
			defaultValue: 'my-statue-site',
			validate: (value) => {
				if (!value) return 'Project name is required';
				if (!/^[a-z0-9-_]+$/i.test(value)) {
					return 'Project name can only contain letters, numbers, hyphens, and underscores';
				}
			}
		}));

	if (p.isCancel(projectName)) {
		p.cancel('Operation cancelled.');
		return process.exit(0);
	}

	const targetDir = path.resolve(process.cwd(), projectName as string);

	// Check existing directory
	if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
		const overwrite = await p.confirm({
			message: `Directory "${projectName}" is not empty. Remove existing files?`,
			initialValue: false
		});
		if (p.isCancel(overwrite) || !overwrite) {
			p.cancel('Operation cancelled.');
			return process.exit(0);
		}
		fs.emptyDirSync(targetDir);
	}

	// 2. Template
	const templates = getAvailableTemplates();
	const template = useDefaults
		? 'default'
		: await p.select({
				message: 'Which template would you like to use?',
				options: templates,
				initialValue: 'default'
			});
	if (p.isCancel(template)) {
		p.cancel('Operation cancelled.');
		return process.exit(0);
	}

	// 3. Theme
	const themes = getAvailableThemes();
	const theme = useDefaults
		? 'black-white'
		: await p.select({
				message: 'Which theme would you like to use?',
				options: themes,
				initialValue: 'black-white'
			});
	if (p.isCancel(theme)) {
		p.cancel('Operation cancelled.');
		return process.exit(0);
	}

	// 4. Create project
	console.log();
	console.log(`Creating a new Statue project in ${pc.cyan(targetDir)}...`);
	console.log();

	// Create directory if it doesn't exist
	fs.ensureDirSync(targetDir);

	// Create SvelteKit project using sv create
	console.log('Creating SvelteKit project...');
	runCommand(
		'npx',
		['sv', 'create', '.', '--template', 'minimal', '--types', 'ts', '--no-add-ons', '--no-install'],
		targetDir,
		true // pipe stdin for 'yes'
	);

	// Install dependencies + statue-ssg
	console.log('Installing dependencies...');
	runCommand('npm', ['install', 'statue-ssg'], targetDir);

	// Initialize statue-ssg
	console.log('Initializing statue-ssg...');
	const initArgs = template === 'default'
		? ['statue', 'init']
		: ['statue', 'init', '--template', template as string];
	runCommand('npx', initArgs, targetDir);

	// Apply theme
	applyTheme(targetDir, theme as string);

	// Final install for any new dependencies
	console.log('Installing remaining dependencies...');
	runCommand('npm', ['install'], targetDir);

	// 5. Success
	console.log();
	console.log(
		pc.green(`Success!`) + ` Created ${pc.cyan(projectName as string)} at ${pc.cyan(targetDir)}`
	);
	console.log();
	console.log('Inside that directory, you can run:');
	console.log();
	console.log(`  ${pc.cyan('npm run dev')}`);
	console.log('    Starts the development server.');
	console.log();
	console.log(`  ${pc.cyan('npm run build')}`);
	console.log('    Builds the site for production.');
	console.log();
	console.log('We suggest that you begin by typing:');
	console.log();
	console.log(`  ${pc.cyan('cd')} ${projectName}`);
	console.log(`  ${pc.cyan('npm run dev')}`);
	console.log();
}

function showHelp() {
	console.log(`
Usage: create-statue [project-name] [options]

Options:
  -y, --yes              Use default options
  -h, --help             Show this help message

Examples:
  npm create statue@latest my-site
  npm create statue@latest my-blog -- --yes
  npx create-statue my-docs
`);
}

function runCommand(cmd: string, args: string[], cwd: string, pipeYes = false) {
	const result = spawn.sync(cmd, args, {
		cwd,
		stdio: pipeYes ? ['pipe', 'inherit', 'inherit'] : 'inherit',
		input: pipeYes ? 'y\n' : undefined,
		shell: process.platform === 'win32'
	});
	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}

function applyTheme(targetDir: string, themeName: string) {
	const cssPath = path.join(targetDir, 'src', 'lib', 'index.css');
	if (fs.existsSync(cssPath)) {
		let css = fs.readFileSync(cssPath, 'utf-8');
		css = css.replace(
			/@import\s+["']statue-ssg\/themes\/[^"']+["'];?/g,
			`@import "statue-ssg/themes/${themeName}.css";`
		);
		fs.writeFileSync(cssPath, css);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
