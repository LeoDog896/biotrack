<!-- svelte-ignore a11y-distracting-elements we want it distracting -->
<!-- <marquee>
    {"orchestrator ".repeat(100)}
</marquee> -->
<span class="marquee">
    {"orchestrator ".repeat(100)}
</span>

<style>
    .marquee {
        display: block;
        white-space: nowrap;
        position: relative;
        animation: marquee 10s linear infinite;
        border-top: 4px solid var(--error);
        border-bottom: 4px solid var(--error);
        text-transform: uppercase;
    }

    @keyframes marquee {
        0% {
            left: 0%;
        }
        100% {
            left: -100%;
        }
    }
</style>