<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<main>
	<h1>Create Game</h1>

	<form method="POST" use:enhance>
		<input type="text" name="name" placeholder="Name" required />

		<button type="submit">Submit</button>
	</form>
</main>

<style>
	main {
		text-align: center;
	}
</style>
