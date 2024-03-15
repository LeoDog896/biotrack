<script lang="ts">
	import { page } from '$app/stores';
</script>

<main>
    {#if $page.error}
        <h1>{$page.error.message}</h1>
        <p>Check the recent logs.</p>
    {:else}
        <h1>Unknown Error</h1>
        <p>Is this a SvelteKit error? Check the logs.</p>
    {/if}
</main>

<style>
    main {
        text-align: center;
    }
</style>
