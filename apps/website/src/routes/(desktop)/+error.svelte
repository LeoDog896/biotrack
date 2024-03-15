<script lang="ts">
	import { page } from '$app/stores';
</script>

{#if $page.error}
	<h1>Error: {$page.error.message}</h1>
	<p>Check the recent logs.</p>
{:else}
	<h1>Unknown Error</h1>
	<p>Is this a SvelteKit error? Check the logs.</p>
{/if}
