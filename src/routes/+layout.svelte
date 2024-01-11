<slot />

<style global>
    :global(html, body) {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }

    ::global(*) {
        box-sizing: border-box;
    }
</style>