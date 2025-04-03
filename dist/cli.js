var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/cli.js
import fs3 from "fs-extra";
import path3 from "path";
import { fileURLToPath } from "url";
import { Command } from "commander";
import chalk from "chalk";

// src/lib/cms/content-processor.js
import fs from "fs";
import path from "path";
import { marked } from "marked";
import matter from "gray-matter";
var isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
if (isBrowser) {
  console.error("content-processor.js should only be used on the server side!");
  throw new Error("Content processor cannot run on the client side!");
}
var scanContentDirectory = () => {
  const contentPath = path.resolve("content");
  const contentEntries = [];
  if (!fs.existsSync(contentPath)) {
    console.warn("Content folder not found!");
    return contentEntries;
  }
  function scanDir(dirPath, relativePath = "") {
    const entries = fs.readdirSync(dirPath);
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry);
      const entryRelativePath = path.join(relativePath, entry);
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        scanDir(fullPath, entryRelativePath);
      } else if (stats.isFile() && entry.endsWith(".md")) {
        const slug = entry.replace(".md", "");
        const url = relativePath ? `/${relativePath}/${slug}`.replace(/\\/g, "/") : `/${slug}`;
        const content = fs.readFileSync(fullPath, "utf-8");
        const { data, content: markdownContent } = matter(content);
        const html = marked.parse(markdownContent);
        let directory = relativePath.replace(/\\/g, "/");
        const mainDirectory = directory.split("/")[0] || "root";
        contentEntries.push({
          slug,
          path: entryRelativePath,
          url,
          directory,
          mainDirectory,
          // Depth of the path
          depth: directory === "" ? 0 : directory.split("/").length,
          content: html,
          metadata: {
            title: data.title || formatTitle(slug),
            description: data.description || "",
            date: data.date || null,
            author: data.author || null,
            ...data
          }
        });
      }
    }
  }
  scanDir(contentPath);
  return contentEntries;
};
var getContentDirectories = () => {
  const contentPath = path.resolve("content");
  const directories = [];
  if (!fs.existsSync(contentPath)) {
    console.warn("Content folder not found!");
    return directories;
  }
  const entries = fs.readdirSync(contentPath);
  for (const entry of entries) {
    const fullPath = path.join(contentPath, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      directories.push({
        name: entry,
        path: `content/${entry}`,
        title: formatTitle(entry),
        url: `/${entry}`
      });
    }
  }
  return directories;
};
var formatTitle = (slug) => {
  return slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};
var cachedContent = null;
var getAllContent = () => {
  if (cachedContent)
    return cachedContent;
  cachedContent = scanContentDirectory();
  return cachedContent;
};

// src/generator.js
import fs2 from "fs-extra";
import path2 from "path";
async function generateStaticSite({
  inputDir = "content",
  outputDir = "build",
  template = null,
  verbose = false
} = {}) {
  try {
    console.log("\u{1F4E6} Starting to generate static site...");
    if (!fs2.existsSync(inputDir)) {
      throw new Error(`Input directory "${inputDir}" not found`);
    }
    fs2.ensureDirSync(outputDir);
    fs2.emptyDirSync(outputDir);
    const useCustomTemplate = template && fs2.existsSync(template);
    if (verbose && useCustomTemplate) {
      console.log(`\u{1F527} Using custom template: ${template}`);
    }
    const allContent = getAllContent();
    const directories = getContentDirectories();
    if (verbose) {
      console.log(`\u{1F4C4} Found ${allContent.length} content files`);
      console.log(`\u{1F4C1} Found ${directories.length} directories`);
    }
    for (const item of allContent) {
      const outputPath = path2.join(outputDir, item.url);
      fs2.ensureDirSync(path2.dirname(outputPath));
      const html = generateHtmlForContent(item, allContent, directories);
      fs2.writeFileSync(`${outputPath}.html`, html);
      if (verbose) {
        console.log(`\u2705 Generated: ${item.url}.html`);
      }
    }
    const indexHtml = generateIndexHtml(directories, allContent);
    fs2.writeFileSync(path2.join(outputDir, "index.html"), indexHtml);
    const staticDir = path2.join(inputDir, "static");
    if (fs2.existsSync(staticDir)) {
      fs2.copySync(staticDir, path2.join(outputDir, "static"));
      console.log("\u{1F4C1} Copied static assets");
    }
    console.log(`\u2728 Static site generated successfully in ${outputDir}`);
  } catch (error) {
    console.error("\u274C Error generating static site:", error);
    throw error;
  }
}
function generateHtmlForContent(item, allContent, directories) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${item.metadata.title}</title>
  <meta name="description" content="${item.metadata.description || ""}">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      margin-bottom: 40px;
    }
    nav ul {
      display: flex;
      list-style: none;
      padding: 0;
      gap: 20px;
    }
    a {
      color: #0066cc;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    pre {
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 5px;
      overflow-x: auto;
    }
    code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <header>
    <h1><a href="/">Statue SSG</a></h1>
    <nav>
      <ul>
        ${directories.map(
    (dir) => `<li><a href="${dir.url}">${dir.title}</a></li>`
  ).join("")}
      </ul>
    </nav>
  </header>
  <main>
    <h1>${item.metadata.title}</h1>
    ${item.metadata.date ? `<p>Published on: ${new Date(item.metadata.date).toLocaleDateString()}</p>` : ""}
    ${item.metadata.author ? `<p>Author: ${item.metadata.author}</p>` : ""}
    <div class="content">
      ${item.content}
    </div>
  </main>
  <footer>
    <p>Generated with <a href="https://github.com/your-username/statue-ssg">Statue SSG</a></p>
  </footer>
</body>
</html>`;
}
function generateIndexHtml(directories, allContent) {
  const rootContent = allContent.filter((entry) => entry.directory === "");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Statue SSG</title>
  <meta name="description" content="A simple static site generator for markdown content">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      margin-bottom: 40px;
    }
    nav ul {
      display: flex;
      list-style: none;
      padding: 0;
      gap: 20px;
    }
    a {
      color: #0066cc;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 40px;
    }
    .card {
      border: 1px solid #eee;
      border-radius: 5px;
      padding: 20px;
      transition: all 0.3s ease;
    }
    .card:hover {
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <header>
    <h1><a href="/">Statue SSG</a></h1>
    <nav>
      <ul>
        ${directories.map(
    (dir) => `<li><a href="${dir.url}">${dir.title}</a></li>`
  ).join("")}
      </ul>
    </nav>
  </header>
  <main>
    <h1>Welcome to Statue SSG</h1>
    <p>A simple static site generator for markdown content with SvelteKit</p>
    
    <h2>Content Categories</h2>
    <div class="grid">
      ${directories.map((dir) => `
        <div class="card">
          <h3>${dir.title}</h3>
          <a href="${dir.url}">View Content</a>
        </div>
      `).join("")}
    </div>
    
    ${rootContent.length > 0 ? `
      <h2>Latest Content</h2>
      <div class="grid">
        ${rootContent.map((page) => `
          <div class="card">
            <h3>${page.metadata.title}</h3>
            ${page.metadata.description ? `<p>${page.metadata.description}</p>` : ""}
            <a href="${page.url}.html">Read more</a>
          </div>
        `).join("")}
      </div>
    ` : ""}
  </main>
  <footer>
    <p>Generated with <a href="https://github.com/your-username/statue-ssg">Statue SSG</a></p>
  </footer>
</body>
</html>`;
}

// src/cli.js
import { execSync } from "child_process";
var __dirname = path3.dirname(fileURLToPath(import.meta.url));
var program = new Command();
program.name("statue-ssg").description("Convert markdown content to a static website").version("0.1.2");
program.command("build").description("Build a static site from markdown content").option("-i, --input <directory>", "input content directory", "content").option("-o, --output <directory>", "output directory", "build").option("-t, --template <path>", "custom template directory").option("-v, --verbose", "verbose output").action(async (options) => {
  console.log(chalk.bold.green("Statue SSG - Static Site Generator"));
  try {
    await generateStaticSite({
      inputDir: options.input,
      outputDir: options.output,
      template: options.template,
      verbose: options.verbose
    });
    console.log(chalk.green("\u2728 Static site generated successfully!"));
  } catch (err) {
    console.error(chalk.red("Error:"), err.message);
    process.exit(1);
  }
});
program.command("setup").description("Set up Statue SSG in your SvelteKit project").action(() => {
  var _a, _b;
  try {
    const pkgPath = path3.join(process.cwd(), "package.json");
    if (!fs3.existsSync(pkgPath)) {
      console.error(chalk.red("Error: No package.json found. Please run this command in a SvelteKit project."));
      process.exit(1);
    }
    const pkg = JSON.parse(fs3.readFileSync(pkgPath, "utf8"));
    if (!((_a = pkg.dependencies) == null ? void 0 : _a["@sveltejs/kit"]) && !((_b = pkg.devDependencies) == null ? void 0 : _b["@sveltejs/kit"])) {
      console.warn(chalk.yellow("Warning: This doesn't appear to be a SvelteKit project."));
      const proceed = true;
      if (!proceed) {
        console.log(chalk.blue("Setup cancelled."));
        process.exit(0);
      }
    }
    console.log(chalk.green("Setting up Statue SSG in your project..."));
    const postinstallPath = path3.resolve(__dirname, "..", "postinstall.js");
    if (fs3.existsSync(postinstallPath)) {
      try {
        console.log(chalk.blue("Running setup script..."));
        __require(postinstallPath);
      } catch (e) {
        try {
          console.log(chalk.blue("Trying alternative method..."));
          execSync(`node "${postinstallPath}"`, { stdio: "inherit" });
        } catch (err) {
          console.error(chalk.red("Error executing postinstall script:"), err.message);
          process.exit(1);
        }
      }
    } else {
      console.error(chalk.red("Error: Setup script not found."));
      console.log(chalk.yellow("Try running: node node_modules/statue-ssg/postinstall.js"));
      process.exit(1);
    }
  } catch (err) {
    console.error(chalk.red("Error during setup:"), err.message);
    process.exit(1);
  }
});
program.command("init").description("Initialize a new Statue SSG project").option("-d, --directory <n>", "project directory name", ".").option("-s, --sveltekit", "initialize with SvelteKit integration").action((options) => {
  const targetDir = path3.resolve(process.cwd(), options.directory);
  try {
    if (options.sveltekit) {
      console.log(chalk.green("SvelteKit entegrasyonu ile Statue SSG ba\u015Flat\u0131l\u0131yor..."));
      if (!fs3.existsSync(path3.join(targetDir, "package.json"))) {
        console.log(chalk.yellow("Mevcut bir SvelteKit projesinde de\u011Filsiniz."));
        console.log(chalk.blue("\xD6nce bir SvelteKit projesi olu\u015Fturun:"));
        console.log(chalk.white("npm create svelte@latest my-app"));
        console.log(chalk.white("cd my-app"));
        console.log(chalk.white("npm install"));
        console.log(chalk.white("npm install statue-ssg"));
        process.exit(0);
      }
      try {
        console.log(chalk.blue("Statue SSG dosyalar\u0131 kopyalan\u0131yor..."));
        const postinstallPath = path3.join(__dirname, "..", "postinstall.js");
        if (fs3.existsSync(postinstallPath)) {
          execSync(`node ${postinstallPath}`, { stdio: "inherit" });
        } else {
          console.error(chalk.red("postinstall.js dosyas\u0131 bulunamad\u0131."));
          console.log(chalk.yellow("Manuel olarak kurulum yap\u0131l\u0131yor..."));
          fs3.ensureDirSync(path3.join(targetDir, "content"));
          fs3.ensureDirSync(path3.join(targetDir, "content/blog"));
          fs3.ensureDirSync(path3.join(targetDir, "content/docs"));
          fs3.ensureDirSync(path3.join(targetDir, "content/static"));
          console.log(chalk.green("\u2705 \u0130\xE7erik klas\xF6rleri olu\u015Fturuldu."));
        }
      } catch (err) {
        console.error(chalk.red("Entegrasyon s\u0131ras\u0131nda hata olu\u015Ftu:"), err.message);
      }
      console.log(chalk.green("\u2705 SvelteKit entegrasyonu tamamland\u0131!"));
      console.log();
      console.log("Sonraki ad\u0131mlar:");
      console.log("  1. Ba\u011F\u0131ml\u0131l\u0131klar\u0131 y\xFCkleyin:", chalk.bold("npm install"));
      console.log("  2. Geli\u015Ftirme sunucusunu ba\u015Flat\u0131n:", chalk.bold("npm run dev"));
      console.log("  3. content/ dizinindeki i\xE7eri\u011Fi d\xFCzenleyin");
    } else {
      fs3.ensureDirSync(targetDir);
      fs3.ensureDirSync(path3.join(targetDir, "content"));
      fs3.ensureDirSync(path3.join(targetDir, "content/blog"));
      fs3.ensureDirSync(path3.join(targetDir, "content/docs"));
      fs3.ensureDirSync(path3.join(targetDir, "content/static"));
      const exampleContent = `---
title: Hello World
description: Welcome to Statue SSG
date: ${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}
---

# Welcome to Statue SSG

This is an example markdown file.

## Features

- Simple markdown content
- Fast static site generation
- SEO friendly

`;
      fs3.writeFileSync(path3.join(targetDir, "content/blog/hello-world.md"), exampleContent);
      const pkgPath = path3.join(targetDir, "package.json");
      if (!fs3.existsSync(pkgPath)) {
        const pkg = {
          name: path3.basename(targetDir),
          version: "0.0.1",
          description: "A static site built with Statue SSG",
          type: "module",
          scripts: {
            build: "statue-ssg build",
            dev: "statue-ssg build && serve build"
          },
          dependencies: {
            "statue-ssg": "^0.1.2"
          },
          devDependencies: {
            serve: "^14.0.0"
          }
        };
        fs3.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      }
      console.log(chalk.green("\u2705 Statue SSG projesi ba\u015Flat\u0131ld\u0131!"));
      console.log();
      console.log("Sonraki ad\u0131mlar:");
      console.log("  1. Ba\u011F\u0131ml\u0131l\u0131klar\u0131 y\xFCkleyin:", chalk.bold("npm install"));
      console.log("  2. Statik siteyi olu\u015Fturun:", chalk.bold("npm run build"));
      console.log("  3. content/ dizinindeki i\xE7eri\u011Fi d\xFCzenleyin");
    }
  } catch (err) {
    console.error(chalk.red("Hata:"), err.message);
    process.exit(1);
  }
});
program.parse();
