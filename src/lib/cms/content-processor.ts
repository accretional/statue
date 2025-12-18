// Load all markdown files from /content folder
const rawFiles = import.meta.glob('/content/**/*.{md,svx}', {
	eager: true,
	query: '?raw',
	import: 'default'
});

const moduleFiles = import.meta.glob('/content/**/*.{md,svx}', {
	eager: true
});

// Helper: Convert "my-page" to "My Page"
const formatTitle = (slug) => {
	return slug
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

// Helper: Extract H2-H6 headings from markdown content
const extractSections = (markdownContent) => {
	const lines = markdownContent.split('\n');
	const sections = [];

	for (const line of lines) {
		const match = line.match(/^##\s+(.*)$/);
		if (!match) continue;

		const title = match[1].trim().replace(/\s*\{#.*?\}\s*$/, '');

		const slug = title
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-');

		sections.push({ title, slug });
	}

	return sections;
};

// Build array of all content with metadata
export const ALL_CONTENT = Object.entries(moduleFiles).map(([filePath, module]) => {
	// Convert "/content/docs/getting-started.md" to "docs/getting-started"
	const cleanPath = filePath.replace('/content/', '').replace(/\.(md|svx)$/, '');

	const pathSegments = cleanPath.split('/');
	const fileName = pathSegments[pathSegments.length - 1];
	const rawContent = rawFiles[filePath] || '';

	return {
		slug: fileName,
		path: cleanPath,
		url: `/${cleanPath}`,
		directory: pathSegments.length > 1 ? pathSegments.slice(0, -1).join('/') : 'root',
		mainDirectory: pathSegments[0] || 'root',
		metadata: {
			title: module.metadata?.title || formatTitle(fileName),
			order: module.metadata?.order || 999,
			...module.metadata
		},
		content: module.default,
		sections: extractSections(rawContent),
		rawContent
	};
});

// ------------------------------------------------------------------
// PUBLIC FUNCTIONS
// ------------------------------------------------------------------

// Get all content pages
export const getAllContent = () => {
	return ALL_CONTENT;
};

// Get all top-level directories (e.g., "docs", "blog", "guides")
export const getContentDirectories = () => {
	const directoryNames = ALL_CONTENT.map((page) => page.mainDirectory).filter(
		(dir) => dir !== 'root'
	);

	const uniqueDirectories = [...new Set(directoryNames)];

	return uniqueDirectories.map((name) => ({
		name,
		title: formatTitle(name),
		url: `/${name}`
	}));
};

// Get subdirectories within a directory (e.g., "docs/api", "docs/guides")
export const getSubDirectories = (directory) => {
	const subdirectories = new Set();

	for (const page of ALL_CONTENT) {
		if (page.directory.startsWith(directory + '/')) {
			const remainingPath = page.directory.replace(directory + '/', '');
			const firstSubfolder = remainingPath.split('/')[0];
			subdirectories.add(firstSubfolder);
		}
	}

	return Array.from(subdirectories).map((name) => ({
		name,
		title: formatTitle(name),
		url: `/${directory}/${name}`
	}));
};

// Get all pages within a directory and its subdirectories
export const getContentByDirectory = (directory) => {
	return ALL_CONTENT.filter((page) => {
		return page.directory === directory || page.directory.startsWith(directory + '/');
	});
};

// Get sidebar navigation data grouped by subfolder
export const getSidebarData = (directory) => {
	const pages = getContentByDirectory(directory);
	const groups = {};

	for (const page of pages) {
		// Remove the base directory to get relative path
		const relativePath = page.directory.replace(directory, '').replace(/^\//, '');

		// Group by first subfolder, or "Root" if no subfolder
		const groupTitle = relativePath ? formatTitle(relativePath.split('/')[0]) : 'Root';

		if (!groups[groupTitle]) {
			groups[groupTitle] = [];
		}

		groups[groupTitle].push({
			title: page.metadata.title,
			url: page.url,
			order: page.metadata.order
		});
	}

	// Sort each group by order
	for (const groupTitle in groups) {
		groups[groupTitle].sort((a, b) => a.order - b.order);
	}

	return groups;
};

// Get the URL of the first page in a directory
export const getFirstPageUrl = (directory) => {
	const sidebarGroups = getSidebarData(directory);
	const firstGroup = Object.values(sidebarGroups)[0];

	if (firstGroup && firstGroup.length > 0) {
		return firstGroup[0].url;
	}

	return null;
};

// Get a specific page by its URL path
export const getPageContent = (fullPath) => {
	const cleanPath = fullPath.replace(/\/$/, ''); // Remove trailing slash

	return (
		ALL_CONTENT.find((page) => {
			return page.url === cleanPath || page.path === cleanPath.replace(/^\//, '');
		}) || null
	);
};

// Get table of contents (sections) for a page
export const getSectionData = (routeId) => {
	const page = getPageContent(routeId);
	return page ? page.sections : [];
};
