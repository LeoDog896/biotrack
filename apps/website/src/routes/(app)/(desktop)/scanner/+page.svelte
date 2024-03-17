<script lang="ts">
	import { onMount } from "svelte";

    let requests: Promise<Response>;

    onMount(() => {
        requests = Promise.any(
            Array.from({ length: 255 }, (_, i) =>
                fetch("http://192.168.0." + i + ":2023/ferret.jpg")
            )
        );
    })
</script>

<h1>Check-in</h1>

{#if requests}
    {#await requests}
        <p>Scanning...</p>
    {:then response}
        <p>Found at {response}</p>
    {:catch error}
        <p>Not found</p>
    {/await}
{/if}