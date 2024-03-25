<script lang="ts">
	import ExternalNfc, { getProductName } from '$lib/components/ExternalNFC.svelte';
	import { onMount } from 'svelte';
	import MdiRaspberryPi from '~icons/mdi/raspberry-pi';
	import { state } from './state';

	const ready = state(false);

	const timeout = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	let hasSerial = false;
	let mounted = false;
	let nfc: ExternalNfc
	let port: SerialPort | null = null;

	let pongAttempts = 0;

	onMount(async () => {
		// Check for serial support
		if ('serial' in navigator) {
			hasSerial = true;
		}

		mounted = true;

		while (true) {
			if (!port) {
				await timeout(100);
				continue;
			}

			await nfc.writeSerialString("p");
			const timeoutPromise = timeout(2000);
			const [promise] = await Promise.race([
				timeoutPromise,
				nfc.waitForInputString("log: pong\r\n")
			].map(p => p.then(() => [p])));
			pongAttempts++;
			if (promise !== timeoutPromise) {
				ready.set(true);
				break;
			}
		}
	});

	let output = "";

	async function read() {
		await ready.waitFor(true);
		await nfc.writeSerialString("r");
		await nfc.waitForInputString("log: read\r\ntag: ");
		const length = await nfc.consume(3);
		const parsedLength = parseInt(nfc.decoder.decode(new Uint8Array(length)));
		
		console.log(parsedLength)

		if (parsedLength > 0) {
			await nfc.consume(1); // extra space
			const data = nfc.decoder.decode(new Uint8Array(await nfc.consume(parsedLength)));
			await nfc.consume(1); // extra newline
			console.log("data:", data);
		} else {
			console.log("data: no data");
		}
	}

	const decoder = new TextDecoder();
</script>

<ExternalNfc
	bind:port 
	bind:this={nfc}
	on:output={(e) => output += decoder.decode(e.detail)}
/>

<h1>
	<MdiRaspberryPi />
	Scanner
</h1>

{#if !mounted}
	<p>Loading...</p>
{:else if mounted && !hasSerial}
	<p class="error">
		Your browser does <b>not</b> support the
		<a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API"> Web Serial API</a>.
		Please use a different browser. (i,e. chromium-derived browsers; chrome; edge; opera)
	</p>
{:else if port}
	{#if port.getInfo().usbVendorId}
		<p>
			Product ID: {port.getInfo().usbVendorId}
			{#if getProductName(port.getInfo().usbVendorId)}
				(<span class="accent">{getProductName(port.getInfo().usbVendorId)}</span>)
			{/if}
		</p>
	{/if}
	{#if port.getInfo().usbVendorId}
		<p>Vendor ID: {port.getInfo().usbVendorId}</p>
	{/if}
	{#await ready.waitFor(true)}
		<p>Binding{".".repeat(pongAttempts)}</p>
	{:then}
		<button on:click={read}>read</button>
	{/await}
	<code class="log">
		<pre>{output}</pre>
	</code>
{:else}
	<button on:click={nfc.scanSerial(true)}>initialize serial scan</button>
	<button on:click={nfc.scanSerial(false)}>initialize serial scan raw (ttyAMC0)</button>
{/if}

<style lang="scss">
	h1 {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.error {
		color: var(--error);
	}

	.accent {
		color: var(--accent);
	}

	.log {
		overflow: auto;
		background: black;
		color: white;
		padding: 1em;
		display: block;
		margin: 1rem;
	}
</style>
