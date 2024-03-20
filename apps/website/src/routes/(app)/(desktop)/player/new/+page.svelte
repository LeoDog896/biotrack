<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Fuse from 'fuse.js';

	export let data;
	export let form;

	$: fuse = new Fuse(data.users, {
		keys: ['name']
	});

	let input = '';

	$: filteredUsers = input ? fuse.search(input).map(({ item }) => item) : data.users;
</script>

<h1>New Player</h1>

<form
	method="POST"
	use:enhance={() => {
		return async ({ update }) => {
			await update();
			await invalidateAll();
			input = '';
		};
	}}
>
	<input type="text" name="name" placeholder="Name" bind:value={input} required />

	<button type="submit">Submit</button>
</form>

{#if input}
	{#if filteredUsers.length === 0}
		<p>No similar players found. You're good to go!</p>
	{:else}
		<h2>Similar Players</h2>

		<ul>
			{#each filteredUsers as user}
				<li>
					<a href={`/player/${user.id}`}>{user.name}</a>
				</li>
			{/each}
		</ul>
	{/if}
{:else if form && form.success && form.message}
	<p class="success">{form.message}</p>
	<p><a href="/player/{form.id}">see player</a></p>
{/if}

<style>
	.success {
		color: var(--success);
	}
</style>
