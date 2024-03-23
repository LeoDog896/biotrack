<script lang="ts">
	const links = [
		{
			name: 'Player Dashboard',
			link: '/player'
		},
		{
			name: 'Game Dashboard',
			link: '/game'
		},
		{
			name: 'Session Dashboard',
			link: '/session'
		}
	];

	export let data;
</script>

<h1>Dashboard</h1>

<h2>Quick Links</h2>
<ul>
	{#each links as link}
		<li>
			<a href={link.link}>{link.name}</a>
		</li>
	{/each}
</ul>

<h2>Statistics</h2>

<ul>
	<li>Players: <span class="accent">{data.players}</span></li>
	<li>Games: <span class="accent">{data.games}</span></li>
	<li>
		Sessions: <span class="accent">{data.games}</span>
		{#if data.sessions > 0}
			(active: <span class="accent">{data.activeSessions}</span>)
		{/if}
	</li>
	<li>
		Join Requests: <span class="accent">{data.joinRequests}</span>
		{#if data.joinRequests > 0}
			(active: <span class="accent">{data.activeJoinRequests}</span>)
		{/if}
	</li>
</ul>

<style>
	.accent {
		color: var(--color);
	}
</style>
