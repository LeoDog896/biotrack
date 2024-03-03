<script>
	import AndroidLogo from './android.svg?url';
	import ChromeLogo from './chrome.svg?url';

	import QR from '@svelte-put/qr/img/QR.svelte';

	export let data;
</script>

<main>
	<p>Dashboard</p>
	<a href="/player">Player Management</a>
	{#if data.localAddress}
		<div class="qr-container">
			<div class="qr">
				<h1>Scan for Player Management</h1>
				<h2>
					Requires
					<img src={AndroidLogo} alt="Android Logo" width="20" height="20" />
					<img src={ChromeLogo} alt="Chrome Logo" width="20" height="20" />
				</h2>
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

<style lang="scss">
	main {
		margin: 1rem;
	}

	.qr {
		width: 30%;
		padding: 1rem;
		background-color: rgba(0, 0, 0, 0.1);

		h1 {
			text-align: center;
		}

		h2 {
			text-align: center;
		}
	}

	.qr-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
</style>
