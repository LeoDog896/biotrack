<script lang="ts">
	type State =
		| ['permissionWaiting', state?: never]
		| ['permissionDenied', state?: never]
		| ['home', state?: never]
		| ['fetchPlayer', state?: never]
		| ['writing', state: string]
		| ['newPlayer', state?: never];
	let state: State = ['permissionWaiting'];

    $: if (state[0] === 'writing') write();
    $: if (state[0] === 'fetchPlayer') data = '';

    let data = '';
	const decoder = new TextDecoder('utf-8');

	async function onScan() {
		try {
			const ndef = new NDEFReader();
			await ndef.scan();
			state = ['home'];

			ndef.addEventListener('readingerror', () => {
				alert('Argh! Cannot read data from the NFC tag. Try another one?');
			});

			ndef.addEventListener('reading', (ev) => {
				data = decoder.decode(ev.message.records[0].data);
			});
		} catch (error) {
			alert('Argh! ' + error);
		}
	}

	async function write() {
		try {
            if (state[0] !== 'writing') {
                return;
            }
			const ndef = new NDEFReader();
			await ndef.write(state[1]);
            state = ['home'];
		} catch (error) {
			alert('Argh! ' + error);
		}
	}

	let fullName = '';

	const changeState = (newState: State) => () => (state = newState);
</script>

<main>
	{#if state[0] === 'permissionWaiting'}
		<button class="scan" on:click={onScan}>Enable NFC Scanning</button>
	{:else if state[0] === 'home'}
		<button on:click={changeState(['fetchPlayer'])}>Fetch Player</button>
		<button on:click={changeState(['newPlayer'])}>New Player</button>
	{:else if state[0] === 'fetchPlayer'}
		{#if data}
            <p class="big">Welcome {data}</p>
        {:else}
            <p class="big">Press NFC Card to read</p>
        {/if}
	{:else if state[0] === 'newPlayer'}
		<input bind:value={fullName} placeholder="Full Name" />
		<button 
            disabled={fullName.length < 2}
            on:click={() => state = ['writing', fullName]}
        >Write</button>
	{:else if state[0] === 'writing'}
        <p class="big">Press NFC Card to write</p>
            <ul>
                <li>Length: {state[1].length}</li>
                <li>Data: {state[1]}</li>
            </ul>
    {:else}
        <p>Unknown state {state[0]}</p>
    {/if}
</main>

<style>
    p {
        text-align: center;
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

	main {
		padding: 1rem;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		gap: 1rem;
	}

	button {
		margin: 0;
		padding: 0;
		border: 0.5rem dashed oklch(60.68% 0.138 242.47);
		background-color: oklch(60.68% 0.138 242.47 / 20.86%);
		font-size: 2rem;
		padding: 3rem;
		height: 100%;
	}

	button:disabled {
		opacity: 0.5;
	}

	button.scan {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
