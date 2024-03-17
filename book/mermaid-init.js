var theme = localStorage.getItem('mdbook-theme');

if (theme === 'light' || theme === 'rust') {
	mermaid.initialize({
		startOnLoad: true,
		theme: 'default'
	});
} else {
	mermaid.initialize({
		startOnLoad: true,
		theme: 'dark'
	});
}
