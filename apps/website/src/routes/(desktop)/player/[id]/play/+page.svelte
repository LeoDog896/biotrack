<script lang="ts">
	export let data;
</script>

<h1>Play Log of <a href="/player/{data.user.id}">{data.user.name}</a></h1>

{#if data.activeJoinRequest || data.activeSession}
	{#if data.activeJoinRequest}
		<p>active join request:</p>
		<ul>
			<li>
				made to
				<a href="/game/{data.activeJoinRequest.game.id}">
					{data.activeJoinRequest.game.name}
				</a>
				at
				{data.activeJoinRequest.createdAt.toLocaleString()}
			</li>
			<li>
				<form method="POST" action="?/cancel">
					<button type="submit">cancel join request</button>
				</form>
			</li>
		</ul>
	{/if}
	{#if data.activeSession}
		<p>active session: {data.activeSession}</p>
	{/if}
{:else}
	<p>no active join request or session</p>
{/if}

<h2>History</h2>

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
