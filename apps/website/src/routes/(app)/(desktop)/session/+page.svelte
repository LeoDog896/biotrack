<script lang="ts">
    export let data;
</script>

<h1>Sessions</h1>

<ul>
    {#each data.sessions as session}
        <li>
            <a href="/session/{session.id}">Session {session.id}</a>
            <p>Game: <a href="/game/{session.game.id}">{session.game.name}</a></p>
            <p>Players: {session.user.length}</p>
            <p>Score Blocks: {session.scoreBlock.length}</p>
        </li>
    {/each}
</ul>