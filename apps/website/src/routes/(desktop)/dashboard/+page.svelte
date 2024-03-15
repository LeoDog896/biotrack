<script lang="ts">
	const links = [
		{
			name: 'Player Dashboard',
			link: '/player'
		},
		{
			name: 'Game Dashboard',
			link: '/game'
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
	<li>Players: {data.players}</li>
	<li>Games: {data.games}</li>
	<li>Sessions: {data.sessions}</li>
</ul>
