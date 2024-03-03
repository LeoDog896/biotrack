<script lang="ts">
	import '@fontsource/ibm-plex-mono';
</script>

<slot />

<style global>
	:global(:root) {
		--color: oklch(60.68% 0.138 242.47);
		--primary: var(--color);
	}

	:global(a) {
		color: var(--color);
	}

	:global(html, body) {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
	}

	:global(body, button, input, select, textarea) {
		font-family: 'IBM Plex Mono', sans-serif;
	}

	:global(*) {
		box-sizing: border-box;
	}
</style>
