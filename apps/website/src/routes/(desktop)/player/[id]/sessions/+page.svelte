<script lang="ts">
    export let data;
</script>

<h1>Sessions</h1>

<div class="sessions">
    {#each data.sessions as session}
        <div class="session">
            <h2>General</h2>
            <p>id: {session.id}</p>
            <p>game: <a href="/game/{session.game.id}">{session.game.name}</a></p>
            <h2>Users</h2>
            <ul>
                {#each session.user as user}
                    <li><a href="/player/{user.id}">{user.name}</a></li>
                {/each}
            </ul>
        </div>
    {/each}
</div>