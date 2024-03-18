<script lang="ts">
    export let data;
</script>

<h1>Session {data.session.id}</h1>

<p>Game: <a href="/game/{data.session.game.id}">{data.session.game.name}</a></p>

<p>Players:</p>

<ul>
    {#each data.session.user as player}
        <li><a href="/player/{player.id}">{player.name}</a></li>
    {/each}
</ul>

<p>Score Blocks:</p>

<ul>
    {#each data.session.scoreBlock as scoreBlock}
        <li>
            {scoreBlock.id}: {scoreBlock.score}
        </li>
    {/each}
</ul>
