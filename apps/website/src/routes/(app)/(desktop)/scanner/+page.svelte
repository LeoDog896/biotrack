<script lang="ts">
    const portRange = 255;

    const arr = Array.from({ length: portRange }, (_, i) => i);

    let detectedIndex: number | null = null;
    $: detectedIP = detectedIndex ? `https://192.168.0.${detectedIndex}:2022/` : null;

    function onLoad(index: number) {
        return () => {
            detectedIndex = index;
        };
    }

    let errorCount = 0;
    function onError() {
        errorCount += 1;
    }

    // holds all side effects in a function
    // as to not trigger the function when any
    // variables in here change
    function resetSearch() {
        errorCount = 0;
    }

    let searchSymbol = Symbol('search');
    $: searchSymbol && resetSearch();

    let healthRequest: Promise<Response> | null = null;
    $: if (detectedIndex) {
        healthRequest = fetch(`https://192.168.0.${detectedIndex}:2022/health`);
    }
</script>

{#if !detectedIndex}
    {#key searchSymbol}
        <div hidden>
            {#each arr as index}
                <img
                    on:load={onLoad(index)}
                    on:error={onError}
                    src="http://192.168.0.{index}:2023/ferret.jpg"
                    aria-hidden
                    alt="ferret"
                />
            {/each}
        </div>
    {/key}
{/if}

<h1>Check-in</h1>

{#if detectedIndex}
    {#if healthRequest}
        {#await healthRequest}
            <p>checking health... (<a href={detectedIP}>{detectedIP}</a>)</p>
        {:then response}
            {#if response.ok}
                <p>device: <a href={detectedIP}>{detectedIP}</a></p>
            {:else}
                <p>device: <a href={detectedIP}>{detectedIP}</a>, but it is not responding.</p>
                <p>check the <a href={`${detectedIP}/health`}>health</a> of the device, and its logs.</p>
            {/if}
        {:catch error}
            <p>error: {error.message}</p>
            <p>open the site at <a href={detectedIP}>{detectedIP}</a>, pass regardless of security, and refresh this page.</p>
            <button on:click={() => detectedIndex = detectedIndex}>try again?</button>
        {/await}
    {:else}
        <p>making request to {detectedIP}/health</p>
    {/if}
{:else if errorCount >= portRange}
    <p>no devices found.</p>
    <button on:click={() => searchSymbol = Symbol('search')}>try again?</button>
{:else}
    <p>scanning... ({errorCount}/{portRange})</p>
{/if}

<style>
    button {
        margin-top: 1rem;
        display: block;
    }
</style>
