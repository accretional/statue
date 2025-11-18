# Developer Guide

This document is for maintainers and contributors of the Statue SSG library. It covers the internal architecture, template management, and release testing procedures.

## Architecture Overview

Statue is a "Template-Based" Static Site Generator.
- **Core Logic:** Resides in `src/lib/` (Components, CMS, Styles). This is shared across all templates.
- **Default Template:** The `src/routes/` and `content/` folders in the **root** of this repository act as the "Default Template".
- **Other Templates:** Located in `templates/<template-name>/`. Each contains its own `routes`, `content`, and `config`.

## Template Management

We use custom scripts to switch between templates during development without messing up the git history or requiring multiple repositories.

### 1. Listing Templates
See all available templates:
```bash
npm run template:list
```

### 2. Loading a Template (Development)
To work on a specific template (e.g., `blog`), you must "load" it into the main workspace:
```bash
npm run template:load blog
```
> ⚠️ **Warning:** This overwrites `src/routes` and `content` in your root directory. Ensure you have committed or stashed your changes before running this.

### 3. Saving a Template
After you've finished editing the loaded template in the root workspace, save it back to its folder:
```bash
npm run template:save blog
```

### 4. Working on Default Template
The default template lives in the root. To "restore" it after working on another template:
```bash
git checkout src/routes content site.config.js
```
(Or simply use `git` to manage the default template changes).

## Testing

Before releasing, we must ensure that the package works from a user's perspective (installing via npm).

### Run Release Test
This script packs the library, creates a temporary environment outside the project, creates fresh SvelteKit apps, and installs Statue into them to verify everything builds correctly.

```bash
./scripts/test-release.sh
```
Artifacts are generated in `statue_test_env/` (which is git-ignored).

## Release Process

1. **Bump Version:** Update `version` in `package.json`.
2. **Test:** Run `./scripts/test-release.sh` to ensure integrity.
3. **Commit:** Commit changes.
4. **Publish:**
   ```bash
   npm publish
   ```
   (Note: `prepublishOnly` script runs `npm run build` automatically).

## File Structure

```
/
├── src/lib/              # Core Logic (Components, CMS, Themes)
├── src/routes/           # Default Template Routes (Source of Truth)
├── content/              # Default Template Content
├── templates/            # Additional Templates
│   ├── blog/             # Blog Template Source
│   └── game/             # Game Template Source
├── scripts/
│   ├── statue-cli.js     # CLI Entry point
│   ├── manage-templates.js # Internal tool for swapping templates
│   └── test-release.sh   # End-to-end test script
└── postinstall.js        # The magic script that copies files to user's project
```

