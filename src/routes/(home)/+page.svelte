<script>
	import AndroidLogo from './android.svg?url';
	import ChromeLogo from './chrome.svg?url';

	import QR from '@svelte-put/qr/img/QR.svelte';

	export let data;
</script>

<main>
	<div class="info">
		<h1>biotrack <img src="/logo.svg" alt="biotrack" /></h1>
		<p>
			Welcome to biotrack! This is a web application for managing <b>players</b>
			who create <b>sessions</b> in <b>games</b> and their resulting <b>data</b>. 
		</p>
	</div>
	{#if data.localAddress}
		<div class="qr-container">
			<div class="qr">
				<h1>Scan for Player Management</h1>
				<p>(or <a href="/player">click here</a>)</p>
				<h2>
					Requires
					<img src={AndroidLogo} alt="Android Logo" width="20" height="20" />
					<img src={ChromeLogo} alt="Chrome Logo" width="20" height="20" />
				</h2>
				<p>
					Your browser may report this URL as unsafe. Despite this,
					continue anyway; the page is safe. <a href="/unsafe">More
					Information</a>.
				</p>
				<QR
					data="https://{data.localAddress}:5173/player"
					anchorOuterFill="#198acd"
					moduleFill="black"
					anchorInnerFill="black"
				/>
				<p>Want to go to the <a href="/dashboard">dashboard</a> instead?</p>
			</div>
		</div>
	{/if}
</main>

<svelte:head>
	<title>biotrack</title>
</svelte:head>

<style lang="scss">
	main {
		margin: 1rem;
	}

	.info {
		max-width: 800px;
		margin: 0 auto;
	}

	.qr {
		width: 30%;
		padding: 1rem;
		background-color: rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	h1 img {
		width: 1em;
		height: 1em;
		vertical-align: middle;
	}

	.qr-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
</style>
