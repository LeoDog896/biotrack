<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { isCuid } from '@paralleldrive/cuid2';
	import { z } from 'zod';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ActionData } from '../player/$types.js';

	$: state = $page.state.state;

	$: if (state && (state[0] === 'writing' || state[0] === 'eraseData')) write();
	$: if (state && state[0] === 'checkPlayer') scannedData = undefined;

	let scannedData: string | undefined = undefined;
	$: player = browser
		? globalThis.fetch(`/player/${scannedData}`).then((r) => r.json())
		: undefined;
	const decoder = new TextDecoder('utf-8');

	function setState(newState: State) {
		pushState('', {
			state: newState
		});
	}

	async function beginScanning() {
		try {
			const ndef = new NDEFReader();
			await ndef.scan();
			setState(['home']);

			ndef.addEventListener('readingerror', () => {
				alert('Argh! Cannot read data from the NFC tag. Try another one?');
			});

			const schema = z.object({
				message: z.object({
					records: z.array(
						z.object({
							data: z.instanceof(DataView)
						})
					)
				})
			});

			ndef.addEventListener('reading', (ev) => {
				scannedData = decoder.decode(schema.parse(ev).message.records[0].data);
			});
		} catch (error) {
			if (error instanceof ReferenceError) {
				setState(['initializationError']);
			} else {
				alert('Argh! ' + error);
			}
		}
	}

	async function write() {
		try {
			if (!state) return;

			if (state[0] === 'writing') {
				const ndef = new NDEFReader();
				await ndef.write(state[1]);
				setState(['home']);
			} else if (state[0] === 'eraseData') {
				const ndef = new NDEFReader();
				await ndef.write('');
				setState(['home']);
			}
		} catch (error) {
			alert('Argh! ' + error);
		}
	}

	let fullName = '';

	const changeState = (newState: State) => () => setState(newState);

	export let form: ActionData;
	export let data;

	$: if (form && form.player && state && state[0] === 'newPlayer') {
		setState(['writing', form.player?.id]);
	}
</script>

<main>
	{#if state}
		{#if state[0] === 'home'}
			<button on:click={changeState(['findPlayer'])}>Find Player</button>
			<button on:click={changeState(['checkPlayer'])}>Check Player</button>
			<button on:click={changeState(['newPlayer'])}>New Player</button>
			<button on:click={changeState(['eraseData'])}>Erase Data</button>
		{:else if state[0] === 'checkPlayer'}
			{#if scannedData !== undefined}
				{#if isCuid(scannedData)}
					{#await player}
						<p class="big">Loading...</p>
					{:then player}
						<p class="big">Welcome <span class="blue">{player?.name}</span></p>
					{:catch error}
						<p class="big">Error: <span class="error">{error.message}</span></p>
					{/await}
				{:else}
					<p class="big">Invalid CUID</p>
					{#if scannedData.length > 0}
						<p><span class="error long-text">{scannedData}</span></p>
					{:else}
						<p><span class="error">Error:</span> no data.</p>
					{/if}
				{/if}
			{:else}
				<p class="big">Press NFC Card to read</p>
			{/if}
		{:else if state[0] === 'newPlayer'}
			<form use:enhance method="POST" action="player/?/create">
				<input bind:value={fullName} placeholder="Full Name" name="name" />
				<button type="submit" disabled={fullName.length < 2}>Create Player</button>
			</form>
		{:else if state[0] === 'findPlayer'}
			<input bind:value={fullName} placeholder="Search Name" />
			<div class="names">
				{#each data.users as user}
					<button class="name" on:click={changeState(['writing', user.id])}>{user.name}</button>
				{/each}
			</div>
		{:else if state[0] === 'writing'}
			<p class="big">Press NFC Card to write</p>
			<ul>
				<li>Length: {state[1].length}</li>
				<li>Data: {state[1]}</li>
			</ul>
		{:else if state[0] === 'initializationError'}
			<p>This device or browser does not support NFC.</p>
			<p>
				Please use the <b>Chrome</b>/<b>Chromium</b> browser on an <b>Android</b> device to use this feature.
			</p>
		{:else if state[0] === 'eraseData'}
			<p class="big">Press NFC Card to erase</p>
			<p class="error">Warning: This will erase all data on the card (<i>not</i> player data)</p>
		{:else}
			<p>Unknown state {state[0]}</p>
		{/if}
	{:else}
		<button class="scan" on:click={beginScanning}>Enable NFC Scanning</button>
	{/if}
</main>

<style>
	p {
		text-align: center;
	}

	div.names {
		height: 100%;
		overflow-y: scroll;
	}

	p.big {
		font-size: 4rem;
	}

	input {
		margin: 2rem 1rem;
		padding: 2rem;
		font-size: 1rem;
		text-align: center;
	}

	main,
	form {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		gap: 1rem;
	}

	main {
		padding: 1rem;
		width: 100%;
		height: 100%;
	}

	span.blue {
		color: var(--primary);
	}

	span.error {
		color: red;
	}

	button {
		margin: 0;
		padding: 0;
		border: 0.5rem dashed var(--primary);
		background-color: oklch(60.68% 0.138 242.47 / 20.86%);
		font-size: 2rem;
		padding: 3rem;
		height: 100%;
	}

	button.name {
		height: min-content;
		font-size: 1rem;
		width: 100%;
		margin: 1rem 0;
	}

	button:disabled {
		opacity: 0.5;
	}

	button.scan {
		display: block;
		width: 100%;
		height: 100%;
	}

	.long-text {
		white-space: normal;
		word-break: break-all;
		overflow-wrap: anywhere;
		text-overflow: ellipsis;
		font-size: 1rem;
	}
</style>
