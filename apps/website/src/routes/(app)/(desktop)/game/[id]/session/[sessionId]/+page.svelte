<script lang="ts">
    export let data;
</script>

<h1>Session {data.session.id}</h1>

<p>Game: <a href="/game/{data.session.game.id}">{data.session.game.name}</a></p>

<h2>Players</h2>

<ul>
    {#each data.session.user as player}
        <li><a href="/player/{player.id}">{player.name}</a></li>
    {/each}
</ul>

<h2>Score Blocks</h2>

<ul>
    {#each data.session.scoreBlock as scoreBlock}
        <li>
            {scoreBlock.id}: {scoreBlock.score}
        </li>
    {/each}
</ul>
