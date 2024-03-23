<script lang="ts">
	import { enhance } from '$app/forms';

	export let form;

	let name = '';
</script>

<h1>Create Game</h1>

<form
	method="POST"
	use:enhance={() => {
		return async ({ update }) => {
			await update();
			name = '';
		};
	}}
>
	<input bind:value={name} type="text" name="name" placeholder="Name" required />

	<button type="submit">Submit</button>

	{#if !name && form?.success}
		<p class="success">{form.message}</p>
		<p><a href="/game/{form.id}">see game</a></p>
	{/if}
</form>

<style lang="scss">
	.success {
		color: var(--success);
	}
</style>
