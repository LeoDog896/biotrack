<script lang="ts">
	export let data;
</script>

<main>
	<h1>Player <span class="gray">//</span> {data.user.name}</h1>
	<p>cuid: {data.user.id}</p>
	<p>created at: {data.user.createdAt}</p>
	{#if data.user.updatedAt.toString() !== data.user.createdAt.toString()}
		<p>updated at: {data.user.updatedAt}</p>
	{/if}
</main>

<style lang="scss">
	main {
		padding: 1rem;
	}

	h1 {
		text-align: center;
	}

	.gray {
		opacity: 0.5;
	}
</style>
