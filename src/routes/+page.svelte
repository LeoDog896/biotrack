<script>
	import QR from '@svelte-put/qr/img/QR.svelte';

	export let data;
</script>

<main>
	<p>Dashboard</p>
	<a href="/player">Player Management</a>
	{#if data.localAddress}
		<div class="qr-container">
			<div class="qr">
				<QR
					data="https://{data.localAddress}:5173/player"
					anchorOuterFill="#0954b8"
					moduleFill="#0d274a"
					anchorInnerFill="#0d274a"
				/>
			</div>
		</div>
	{/if}
</main>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<style>
	main {
		margin: 1rem;
	}

	.qr {
		width: 30%;
	}

	.qr-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
</style>
