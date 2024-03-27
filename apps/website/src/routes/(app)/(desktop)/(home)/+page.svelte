<script>
	import AndroidLogo from './android.svg?url';
	import ChromiumLogo from './chromium.svg?url';
	import MdiGithub from '~icons/mdi/github';
	import MdiRaspberryPi from '~icons/mdi/raspberry-pi';
	import MdiComputer from '~icons/mdi/computer';
	import MdiShareVariant from '~icons/mdi/share-variant';

	import QR from '@svelte-put/qr/img/QR.svelte';

	export let data;
</script>

<h1>biotrack <img src="/logo.svg" alt="biotrack" /></h1>
<p>
	Welcome to biotrack! This is a web application for managing <b>players</b>
	who create <b>sessions</b> in <b>games</b> and their resulting <b>data</b>.
</p>
<p>To get started, you can:</p>
<ul>
	<li>
		<a href="/dashboard" class="noUnderscore"
			><MdiComputer /> <span class="underscore">go to the dashboard</span></a
		>
	</li>
	<li>
		<a href="/scanner" class="noUnderscore">
			<MdiRaspberryPi />
			<span class="underscore">use the <b>hardware-powered</b> check-in (currently finnicky..)</span
			>
		</a>
	</li>
	<li>
		<div class="flexLink">
			<MdiShareVariant />
			<span>share this URL with other officers: <b>{data.localAddress}:5000</b></span>
		</div>
	</li>
</ul>
<p>
	Your browser may report this URL as unsafe. Despite this, continue anyway; the page is safe. <a
		href="https://leodog896.github.io/biotrack/security/https.html">More Information</a
	>.
</p>
<p>
	Want to hack the software, or connect your games to this platform? <a
		class="noUnderscore"
		href="https://github.com/LeoDog896/biotrack"
	>
		<MdiGithub /> <span class="underscore">Find it on GitHub.</span></a
	>
</p>
<details>
	<summary>Mobile Information →</summary>
	<div class="qr">
		<h1>Scan for Player Management</h1>
		<QR
			data="https://{data.localAddress}:5173/mobile"
			anchorOuterFill="#198acd"
			moduleFill="black"
			anchorInnerFill="black"
			width="500px"
		/>
		<h2>
			Requires
			<img src={AndroidLogo} alt="Android Logo" width="20" height="20" />
			<img src={ChromiumLogo} alt="Chromium Logo" width="20" height="20" />
		</h2>
		<p>(non-chrome chromium derivatives may not function)</p>
	</div>
</details>

<style lang="scss">
	.qr {
		width: 30%;
		padding: 1rem;
		background-color: rgba(0, 0, 0, 0.1);
		text-align: center;
		width: 100%;
		border-left: 10px solid black;
	}

	h1 img {
		width: 1em;
		height: 1em;
		vertical-align: middle;
	}

	.flexLink {
		display: flex;
		gap: 0.5rem;
	}

	a.noUnderscore {
		:global(svg) {
			vertical-align: middle;
		}

		text-decoration: none;
	}

	details summary {
		margin-bottom: 1rem;
	}

	.underscore {
		text-decoration: underline;
	}
</style>
