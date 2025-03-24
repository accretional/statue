
<script>
  import Wrapper from '$lib/cms/Wrapper.svelte';
  
  const metadata = {"title":"Hello World","date":"2025-03-24T00:00:00.000Z","author":"John Doe","description":"Our first blog post"};
  const content = "<h1>Hello World</h1>\n<p>Welcome to our first blog post. This is a sample markdown file that will be converted to HTML and displayed on our site.</p>\n<h2>Markdown Features</h2>\n<p>Markdown is a lightweight markup language that allows you to write using an easy-to-read, easy-to-write plain text format, which then converts to valid HTML for viewing on a website.</p>\n<h3>Some examples:</h3>\n<ul>\n<li><strong>Bold text</strong> is created using double asterisks</li>\n<li><em>Italic text</em> is created using single asterisks</li>\n<li><a href=\"https://example.com\">Links</a> are created using square brackets and parentheses</li>\n</ul>\n<h3>Code blocks</h3>\n<pre><code class=\"language-javascript\">// This is a code block\nfunction helloWorld() {\n  console.log(&quot;Hello, world!&quot;);\n}\n</code></pre>\n<h2>Next Steps</h2>\n<p>In future posts, we&#39;ll explore more advanced features and integrations with our static site generator. </p>\n";
</script>

<Wrapper 
  title="Hello World"
  content={content}
  metadata={metadata}
/>
