<script lang="ts">
	import ExternalNfc, { getProductName } from '$lib/components/ExternalNFC.svelte';
	import { onMount } from 'svelte';
	import MdiRaspberryPi from '~icons/mdi/raspberry-pi';
	import { state } from './state';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Modal from '$lib/components/Modal.svelte';

	const ready = state(false);

	const timeout = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	let hasSerial = false;
	let mounted = false;
	let nfc: ExternalNfc;
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

			await nfc.writeSerialString('p');
			const timeoutPromise = timeout(200);
			const [canceller, waitPromise] = nfc.waitForInputString('log: pong\r\n');
			const [promise] = await Promise.race(
				[timeoutPromise, waitPromise].map((p) => p.then(() => [p]))
			);
			pongAttempts++;
			if (promise !== timeoutPromise) {
				ready.set(true);
				break;
			} else {
				canceller.abort();
			}
		}
	});

	let bindedData: number[] = [];
	let output = '';

	async function read(): Promise<string | undefined> {
		await ready.waitFor(true);
		bindedData = [];
		await nfc.writeSerialString('r');
		const str = 'log: read\r\ntag: ';
		const [_, promise] = nfc.waitForInputString(str);
		await promise;
		const index =
			bindedData
				.map((v) => String.fromCharCode(v))
				.join('')
				.indexOf(str) + str.length;
		bindedData = bindedData.slice(index);
		const length = await nfc.consume(3);
		const parsedLength = parseInt(nfc.decoder.decode(new Uint8Array(length)));

		if (parsedLength > 0) {
			await nfc.consume(1); // extra space
			const data = nfc.decoder.decode(new Uint8Array(await nfc.consume(parsedLength)));
			await nfc.consume(1); // extra newline
			return data;
		} else {
			return undefined;
		}
	}

	const decoder = new TextDecoder();

	let writeData = '';
	const write = (writeString: string) => async () => {
		await ready.waitFor(true);
		await nfc.writeSerialString(`w`);
		const [_, promise] = nfc.waitForInputString('log: write; how much?\r\n');
		await promise;
		await nfc.writeSerialString(`${writeString.length.toString().padStart(3, '0')}`);
		const [__, promise2] = nfc.waitForInputString(
			`log: now, write ${writeString.length} bytes:\r\n`
		);
		await promise2;
		await nfc.writeSerialString(writeString);
		const [___, promise3] = nfc.waitForInputString('log: begin writing; put in card\r\n');
		await promise3;
		const [____, promise4] = nfc.waitForInputString('log: done writing\r\n');
		await promise4;
	};

	let readPromise: Promise<string | undefined> | null = null;
	function identifyPlayerModal() {
		readPromise = read();
		pushState('', {
			modalShowing: 'identifyPlayer'
		});
	}

	function loadPlayerModal() {
		pushState('', {
			modalShowing: 'loadPlayer'
		});
	}

	let writePromise: Promise<void> | null = null;
	let selectedUser = '';
	const loadPlayerScanModal = (data: string) => () => {
		writePromise = write(data)();
		pushState('', {
			modalShowing: 'loadPlayerScan'
		});
	};

	export let data;
</script>

<ExternalNfc
	bind:data={bindedData}
	bind:port
	bind:this={nfc}
	on:output={(e) => (output += decoder.decode(e.detail))}
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
		<p>Loading...</p>
	{:then}
		<button on:click={identifyPlayerModal}>identify player</button>
		<button on:click={loadPlayerModal}>load player</button>
		<a href="/player/new">create player</a>
		<br />
		<br />
	{/await}
	<details>
		<summary>Debug Panel</summary>
		<div>
			{#await ready.waitFor(true)}
				<p>Binding{'.'.repeat(pongAttempts)}</p>
			{:then}
				<button on:click={read}>read</button>
				<br />
				<br />
				<input bind:value={writeData} />
				<button
					on:click={async () => {
						await write(writeData)();
						writeData = '';
					}}>write</button
				>
			{/await}
			<code class="log">
				<pre>{output}</pre>
			</code>
		</div>
	</details>
{:else}
	<p>
		Make sure to connect either an <b>arduino</b> or a <b>redboard</b> to your computer.
		If it has issues, try:
	</p>
	<ul>
		<li>refreshing this tab</li>
		<li>unplugging and replugging the device</li>
	</ul>
	<p>if it still has issues, please send a <a href="/pager">page</a>!</p>
	<p>the UI is still a WIP, and workflows may be more convoluted than they aim to be.</p>
	<button on:click={nfc.scanSerial(true)}>initialize serial scan</button>
{/if}

{#if $page.state.modalShowing === 'identifyPlayer'}
	<Modal on:close={() => history.back()}>
		<h1>Identify Player</h1>
		<p>Scan the player's card to identify them.</p>
		{#await readPromise}
			<p>Loading...</p>
		{:then loadedData}
			{@const user = data.users.find((u) => u.id === loadedData)}
			<p>Player identified!</p>
			<p>
				Card data: {loadedData}
			</p>
			{#if user}
				<p>
					Player: <a href="/player/{user.id}">{user.name}</a>
				</p>
				<p>
					Score: {user.scoreLedger.reduce((acc, score) => acc + score.score, 0)}
				</p>
			{:else}
				<p class="error">Player not found.</p>
			{/if}
		{/await}
	</Modal>
{/if}

{#if $page.state.modalShowing === 'loadPlayer'}
	<Modal on:close={() => history.back()}>
		<h1>Load Player</h1>
		<p>Choose a player:</p>
		<select bind:value={selectedUser}>
			{#each data.users as user}
				<option value={user.id}>{user.name}</option>
			{/each}
		</select>
		<button on:click={loadPlayerScanModal(selectedUser)}>Scan Card</button>
	</Modal>
{/if}

{#if $page.state.modalShowing === 'loadPlayerScan'}
	<Modal on:close={() => history.back()}>
		<h1>Load Player</h1>
		<p>Scan the player's card to load them.</p>
		{#await writePromise}
			<p>Loading...</p>
		{:then}
			<p>Player loaded!</p>
		{/await}
	</Modal>
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
