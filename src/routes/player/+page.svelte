<script lang="ts">
    import Fuse from 'fuse.js';

    export let data;

    const fuse = new Fuse(data.users, {
        keys: ['name']
    });

    let input = '';

    $: filteredUsers = input ? fuse.search(input).map(user => user.item) : data.users;
</script>

<main>
    <h1>Players</h1>

    <input type="text" placeholder="Search for a player" bind:value={input} />

    {#each filteredUsers as user}
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
