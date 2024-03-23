<script lang="ts">
	import { onMount } from 'svelte';
	import MdiRaspberryPi from '~icons/mdi/raspberry-pi';

	let hasSerial = false;
	let mounted = false;
	let port: SerialPort | null = null;

	onMount(() => {
		// Check for serial support
		if ('serial' in navigator) {
			hasSerial = true;
		}

		mounted = true;
	});

	const productToName: Record<number, string> = {
		0x2341: 'Arduino',
		0x0403: 'RedBoard'
	};

	function getProductName(id: number | undefined) {
		if (id === undefined) return;
		return id in productToName ? productToName[id] : undefined;
	}

	async function scanSerial() {
		port = await navigator.serial.requestPort({
			filters: Object.keys(productToName).map((id) => ({
				usbVendorId: parseInt(id)
			}))
		});

		while (port.readable) {
			const reader = port.readable.getReader();
			try {
				while (true) {
					const { value, done } = await reader.read();
					if (done) {
						break;
					}
					console.log(value);
				}
			} catch (error) {
				console.error(error);
			} finally {
				reader.releaseLock();
			}
		}
	}
</script>

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
	<p>
		Product ID: {port.getInfo().usbVendorId}
		{#if getProductName(port.getInfo().usbVendorId)}
			(<span class="accent">{getProductName(port.getInfo().usbVendorId)}</span>)
		{/if}
	</p>
	<p>Vendor ID: {port.getInfo().usbVendorId}</p>
{:else}
	<button on:click={scanSerial}> initialize serial scan </button>
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
