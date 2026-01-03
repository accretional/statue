import * as p from '@clack/prompts';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';
import spawn from 'cross-spawn';
import pc from 'picocolors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TEMPLATES = [
	{ value: 'default', label: 'Default (recommended)' },
	{ value: 'blog', label: 'Blog' }
];

const THEMES = [
	{ value: 'black-white', label: 'Black & White (recommended)' },
	{ value: 'black-red', label: 'Black & Red' },
	{ value: 'blue', label: 'Blue' },
	{ value: 'charcoal', label: 'Charcoal' },
	{ value: 'cyan', label: 'Cyan' },
	{ value: 'green', label: 'Green' },
	{ value: 'orange', label: 'Orange' },
	{ value: 'pink', label: 'Pink' },
	{ value: 'purple', label: 'Purple' },
	{ value: 'red', label: 'Red' }
];

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

	// 2. TypeScript
	const useTypeScript = useDefaults
		? true
		: await p.confirm({
				message: 'Would you like to use TypeScript?',
				initialValue: true
			});
	if (p.isCancel(useTypeScript)) {
		p.cancel('Operation cancelled.');
		return process.exit(0);
	}

	// 3. Template
	const template = useDefaults
		? 'default'
		: await p.select({
				message: 'Which template would you like to use?',
				options: TEMPLATES,
				initialValue: 'default'
			});
	if (p.isCancel(template)) {
		p.cancel('Operation cancelled.');
		return process.exit(0);
	}

	// 4. Theme
	const theme = useDefaults
		? 'black-white'
		: await p.select({
				message: 'Which theme would you like to use?',
				options: THEMES,
				initialValue: 'black-white'
			});
	if (p.isCancel(theme)) {
		p.cancel('Operation cancelled.');
		return process.exit(0);
	}

	// 5. Create project
	console.log();
	console.log(`Creating a new Statue project in ${pc.cyan(targetDir)}...`);
	console.log();

	await scaffoldProject(targetDir, { useTypeScript: useTypeScript as boolean });

	console.log('Installing dependencies...');
	runCommand('npm', ['install'], targetDir);

	console.log('Initializing statue-ssg...');
	runCommand('npx', ['statue', 'init', '--template', template as string], targetDir);

	applyTheme(targetDir, theme as string);

	// 6. Success
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

function runCommand(cmd: string, args: string[], cwd: string) {
	const result = spawn.sync(cmd, args, {
		cwd,
		stdio: 'inherit',
		shell: process.platform === 'win32'
	});
	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}

async function scaffoldProject(targetDir: string, options: { useTypeScript: boolean }) {
	const templateDir = path.join(__dirname, '..', 'templates', 'base');
	fs.copySync(templateDir, targetDir);

	// Rename _gitignore to .gitignore
	const gitignoreSrc = path.join(targetDir, '_gitignore');
	if (fs.existsSync(gitignoreSrc)) {
		fs.renameSync(gitignoreSrc, path.join(targetDir, '.gitignore'));
	}

	// Update package name
	const pkgPath = path.join(targetDir, 'package.json');
	const pkg = fs.readJsonSync(pkgPath);
	pkg.name = path.basename(targetDir);
	fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });

	if (!options.useTypeScript) {
		fs.removeSync(path.join(targetDir, 'tsconfig.json'));
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
