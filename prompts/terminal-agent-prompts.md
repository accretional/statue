# Add or Modify Site Page

Execute the following tasks in sequence:

1. First, based on the user's specifications determine if a page already exists or needs to be created entirely. All existing pages should be contained as +page.svelte files in their own directory within the /src/routes/ directory. The landing page appears directly within the /src/routes/ directory. If the page already exists, only update that page. If the page does not yet exist, create a new +page.svelte file in a new folder within the /src/routes/ directory and update it to the user's specifications.
2. If needed, update svelte.config.js prerender.entries array to include all new routes
3. Ensure all components are imported individually using proper Svelte import syntax
4. Create any additional components needed in src/lib/components/
5. Do NOT run build commands
6. Exit when finished

Execute these commands carefully, creating a faithful recreation of the [specified] website as a Statue static site.

---

# Update Site Configuration

Execute the following tasks in sequence:
1. Update the site.config.js file to match the user's requirements. If a field's requirements are not specified, assume they do not exist and remove entirely. Ensure the following fields are considered:
Main contact email
Privacy policy related email
Support email
Phone number
Mailing address
twitter
github
linkedin
facebook
instagram
youtube
2. For the remaining fields of the the site.config.js, reference the /src/routes/+page.svelte for your updates.
3. Do NOT run build commands
4. Exit when finished

Execute these commands carefully, faithfully updating the site.config.js file to match the user's requirements."

---

# Create Component

Execute the following tasks in sequence:

1. Generate a clean, flexible, production-ready Svelte component saved to the src/lib/components/ directory. Ensure the component is fully customizable through props, with configurable layout, spacing, colors, borders, shadows, radiuses, variants, and behavior flags. Never use hardcoded color values; instead, always use theme variables from src/lib/index.css for these components. Use Svelte slots where appropriate, including default and named slots, and use inline SVG when appropriate for icons or visuals. Use Svelte 4.
2. If the user specifies to add the new component to a page, import the new component from src/lib/components/ to the specified page within the /src/routes directory. Prioritize adhering to the user's specified requirements first. If specific content and design requirements are not specified, match the new component to the existing page's content and design.
3. Do NOT run build commands.
4. Exit when finished.

Execute these commands carefully, creating and adding a Svelte component that is faithful to the user's specifications.

---

# Convert Site to Statue

Execute the following tasks in sequence:

1. First, curl [specified site] to analyze the existing site structure and content
2. Create a new Statue site by running: “yes | npx sv create statue-site --template minimal --types ts --no-add-ons --install npm && cd statue-site && npm install statue-ssg && npx statue init && npm install” (npm information on statue can be found at https://www.npmjs.com/package/statue-ssg)
3. cd [statue-site]
4. Analyze the curled content and identify all pages, services, and key information
5. Curl additional pages if referenced in the main page to gather complete content
6. Update src/routes/+page.svelte to match the homepage design and content from the original site
7. Create service pages in src/routes/ for each service area mentioned (e.g., src/routes/services/+page.svelte)
8. Update content in /content/blog or /content/docs as needed for service descriptions
9. Update src/lib/components/NavigationBar.svelte to include links matching the original site navigation
10. Update svelte.config.js prerender.entries array to include all new routes
11. Copy styling approach from original site into src/app.css or component styles
12. Ensure all components are imported individually using proper Svelte import syntax
13. Create any additional components needed in src/lib/components/
14. Do NOT run build commands
15. Exit when finished

Execute these commands carefully, creating or updating site pages that are faithful to the user's specifications.

---

# Add or Modify Content Page

Execute the following tasks in sequence:

1. First, based on the user's specifications determine if a content directory already exists or needs to be created entirely. All existing content directories should be contained in their own /content/ directory. If the directory does not yet exist, create a new directory within /content/.
2. Next, determine if the user's specifications require updates to existing markdown file(s), or if a new markdown file needs to be created entirely. Examine the markdown files within the directory determined in step 1 to make your determination for this step. Based on your determination here, either update any existing files in markdown, or write a new file in markdown based on the user's specifications.
3. Always ensure markdown files have proper frontmatter that adhere to the following example structure:
---
title: 
description: 
date: 
author: 
authorAvatar: 
thumbnail: 
category: 
order: 
---
4. Do NOT run build commands
5. Exit when finished

Execute these commands carefully, creating or updating content pages that are faithful to the user's specifications.
