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
var truncateContent = (content, maxLength = 200) => {
  if (content.length <= maxLength)
    return content;
  return content.substring(0, maxLength) + "...";
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
var getContentByUrl = (url) => {
  const allContent = getAllContent();
  const normalizedUrl = url.endsWith("/") ? url.slice(0, -1) : url;
  console.log("Normalized URL for lookup:", normalizedUrl);
  const result = allContent.find((entry) => {
    const entryUrl = entry.url.endsWith("/") ? entry.url.slice(0, -1) : entry.url;
    console.log(`Comparing: "${entryUrl}" vs "${normalizedUrl}"`);
    return entryUrl === normalizedUrl;
  });
  console.log("Match result:", result ? `Found: ${result.url}` : "Not found");
  return result;
};
var getContentByDirectory = (directory) => {
  const allContent = getAllContent();
  if (directory === "root") {
    return allContent.filter((entry) => entry.directory === "root");
  }
  return allContent.filter((entry) => {
    return entry.directory === directory || entry.directory.startsWith(directory + "/");
  });
};
var clearContentCache = () => {
  cachedContent = null;
};
var getSubDirectories = (directory) => {
  const allContent = getAllContent();
  const subdirs = /* @__PURE__ */ new Set();
  const contents = allContent.filter(
    (entry) => entry.directory !== "root" && (entry.directory === directory || entry.directory.startsWith(directory + "/"))
  );
  contents.forEach((entry) => {
    const relativePath = entry.directory.replace(directory + "/", "");
    if (relativePath && relativePath.includes("/")) {
      const firstLevel = relativePath.split("/")[0];
      subdirs.add(firstLevel);
    }
  });
  return Array.from(subdirs).map((subdir) => ({
    name: subdir,
    path: `${directory}/${subdir}`,
    title: formatTitle(subdir),
    url: `/${directory}/${subdir}`
  }));
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
export {
  clearContentCache,
  formatTitle,
  generateStaticSite,
  getAllContent,
  getContentByDirectory,
  getContentByUrl,
  getContentDirectories,
  getSubDirectories,
  scanContentDirectory,
  truncateContent
};
