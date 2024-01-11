<script lang="ts">
	let hasBeenClicked = false;
	let data = "";
	const decoder = new TextDecoder('utf-8');

	async function onScan() {
		if (hasBeenClicked) return;

		hasBeenClicked = true;
		console.log('User clicked scan button');

		try {
			const ndef = new NDEFReader();
			await ndef.scan();

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
			const ndef = new NDEFReader();
			await ndef.write('Hello world!');
			alert('> Message written');
		} catch (error) {
			alert('Argh! ' + error);
		}
	}
</script>

<main>
	{#if !hasBeenClicked}
		<button on:click={onScan}>Scan</button>
	{:else}
		<pre>{data}</pre>
		<button on:click={write}>Write</button>
	{/if}
</main>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
	}

	main {
		padding: 1rem;
	}

	button {
		width: 100%;
		height: 100%;
	}
</style>