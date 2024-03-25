<script lang="ts">
	import ExternalNfc, { getProductName } from '$lib/components/ExternalNFC.svelte';
	import { onMount } from 'svelte';
	import MdiRaspberryPi from '~icons/mdi/raspberry-pi';

	let hasSerial = false;
	let mounted = false;
	let nfc: ExternalNfc
	let port: SerialPort | null = null;

	onMount(async () => {
		// Check for serial support
		if ('serial' in navigator) {
			hasSerial = true;
		}

		mounted = true;
	});

	async function read() {
		await nfc.writeSerialString("r");
		console.log("r")
		await nfc.waitForInputString("log: read\ntag: ");
		console.log("read")
		const input = await nfc.consume(4);
		// get first three to get len
		const len = input.slice(0, 3);
		const data = await nfc.consume(parseInt(nfc.decoder.decode(len)));
		console.log(data);
	}
</script>

<ExternalNfc bind:port bind:this={nfc} />

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
	<button on:click={read}>read</button>
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
</style>
