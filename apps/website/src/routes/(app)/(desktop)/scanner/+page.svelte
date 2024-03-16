<script lang="ts">
	import { onMount } from "svelte";

    onMount(async () => {
        for (let i = 0; i < 255; i++) {
            const request = fetch("https://192.168.0." + i + ":2022")
                .catch(() => {});
        }
    })
</script>

<h1>Check-in</h1>
