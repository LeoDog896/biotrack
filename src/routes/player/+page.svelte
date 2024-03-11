<script lang="ts">
    export let data;
</script>

<main>
    <h1>Players</h1>

    {#each data.users as user}
        <a href={`/player/${user.id}`}>
            <h2>{user.name}</h2>
        </a>
    {/each}
</main>

<style lang="scss">
    main {
        text-align: center;
        margin: 1rem;
    }
</style>
