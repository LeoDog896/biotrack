<script lang="ts">
	import Fuse from 'fuse.js';
	import MdiAccountPlus from '~icons/mdi/account-plus';

	export let data;

	const fuse = new Fuse(data.users, {
		keys: ['name']
	});

	let input = '';

	$: filteredUsers = input ? fuse.search(input).map(({ item }) => item) : data.users;
</script>

<div class="title">
	<h1>Players</h1>
	<a href="/player/new"><MdiAccountPlus width="100%" height="2rem" /></a>
</div>

{#if data.users.length === 0}
	<p>No players found. Perhaps <a href="/player/new">create one</a>?</p>
{:else}
	<input type="text" placeholder="Search for a player" bind:value={input} />

	{#if filteredUsers.length === 0}
		<p>No players found. Perhaps change your query?</p>
	{:else}
		<ul>
			{#each filteredUsers as user}
				<li>
					<a href={`/player/${user.id}`}>
						{user.name}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
{/if}

<style lang="scss">
	.title {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
</style>
