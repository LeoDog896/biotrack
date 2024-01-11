<script lang="ts">
	async function onScan() {
		console.log('User clicked scan button');

		try {
			const ndef = new NDEFReader();
			await ndef.scan();
			console.log('> Scan started');

			ndef.addEventListener('readingerror', () => {
				alert('Argh! Cannot read data from the NFC tag. Try another one?');
			});

			ndef.addEventListener('reading', (ev) => {
				alert(`> Event: ${ev}`);
			});
		} catch (error) {
			alert('Argh! ' + error);
		}
	};
</script>

<button on:click={onScan}>Scan</button>
