<script>
	import AndroidLogo from './android.svg?url';
	import ChromiumLogo from './chromium.svg?url';
	import MdiGithub from '~icons/mdi/github';

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
		<p>
			To get started, you can <a href="/dashboard">go to the dashboard</a> or manage players by
			<a href="/mobile">going to player management</a>
			(<b>mobile-only</b>, see qr code →).
		</p>
		<p>
			Want to hack the software, or connect your games to this platform? <a class="noUnderscore" href="https://github.com/LeoDog896/biotrack">
				<MdiGithub /> <span class="underscore">Find it on GitHub.</span></a
			>
		</p>
	</div>
	{#if data.localAddress}
		<div class="qr-container">
			<div class="qr">
				<h1>Scan for Player Management</h1>
				<QR
					data="https://{data.localAddress}:5173/mobile"
					anchorOuterFill="#198acd"
					moduleFill="black"
					anchorInnerFill="black"
				/>
				<h2>
					Requires
					<img src={AndroidLogo} alt="Android Logo" width="20" height="20" />
					<img src={ChromiumLogo} alt="Chromium Logo" width="20" height="20" />
				</h2>
				<p>(non-chrome chromium derivatives may not function)</p>
				<p>
					Your browser may report this URL as unsafe. Despite this, continue anyway; the page is
					safe. <a href="/unsafe">More Information</a>.
				</p>
				<p>Not signing in players? Want to go to the <a href="/dashboard">dashboard</a> instead?</p>
			</div>
		</div>
	{/if}
</main>

<style lang="scss">
	main {
		margin: 1rem;
	}

	.info {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.qr {
		width: 30%;
		padding: 1rem;
		background-color: rgba(0, 0, 0, 0.1);
		text-align: center;
		width: 100%;
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
		max-width: 400px;
	}

	main {
		display: flex;
	}

	a.noUnderscore {
		:global(svg) {
			vertical-align: middle;
		}

		text-decoration: none;
	}

	.underscore {
		text-decoration: underline;
	}
</style>
