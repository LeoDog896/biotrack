<script lang="ts">
	import { enhance } from '$app/forms';

	export let form;
</script>

<main>
	<h1>Scanner</h1>

	<form method="POST" use:enhance>
		<input type="text" name="cuid" placeholder="CUID" required />
		<input type="number" name="game" placeholder="Game ID" value="1" min="1" required />
		<button type="submit">Submit</button>
	</form>

	{#if form}
		<pre>{JSON.stringify(form.data, null, 2)}</pre>
	{/if}
</main>
