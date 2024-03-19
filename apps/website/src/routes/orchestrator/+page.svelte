<script lang="ts">
    import Marquee from "./Marquee.svelte";
    import MdiViolin from '~icons/mdi/violin';
</script>

<div class="container">
    <Marquee />
    <main>
        <h1><MdiViolin color="var(--error)" />Orchestrator</h1>
        <p>Management software for creating and editing all officers, <i>only</i> on the host computer.</p>

        <h2>Officers</h2>
    </main>
    <Marquee reverse />
</div>

<style lang="scss">
    h1 {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    main {
        text-align: center;
        flex: 1;
        overflow-y: scroll;
    }

    div.container {
        height: 100vh;
        display: flex;
        flex-direction: column;
    }
</style>