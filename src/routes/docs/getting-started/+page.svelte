
<script>
  import Wrapper from '$lib/cms/Wrapper.svelte';
  
  const metadata = {"title":"Getting Started","description":"Learn how to get started with our platform"};
  const content = "<h1>Getting Started</h1>\n<p>This guide will help you get started with our platform. Follow these simple steps to set up your environment and begin development.</p>\n<h2>Prerequisites</h2>\n<p>Before you begin, make sure you have the following installed:</p>\n<ul>\n<li>Node.js (version 16 or higher)</li>\n<li>npm or yarn</li>\n<li>Git</li>\n</ul>\n<h2>Installation</h2>\n<p>Clone the repository and install dependencies:</p>\n<pre><code class=\"language-bash\">git clone https://github.com/yourusername/your-project.git\ncd your-project\nnpm install\n</code></pre>\n<h2>Configuration</h2>\n<p>Create a <code>.env</code> file in the root directory with the following variables:</p>\n<pre><code>API_KEY=your_api_key\nBASE_URL=https://api.example.com\n</code></pre>\n<h2>Running the Development Server</h2>\n<p>Start the development server with:</p>\n<pre><code class=\"language-bash\">npm run dev\n</code></pre>\n<p>Your site should now be running at <code>http://localhost:5173</code>. </p>\n";
</script>

<Wrapper 
  title="Getting Started"
  content={content}
  metadata={metadata}
/>
