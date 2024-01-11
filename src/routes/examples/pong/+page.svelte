<!-- <script lang="ts">
	import { Canvas, Layer, type Render } from 'svelte-canvas';

    interface Player {
        y: number;
        vy: number;
    }

    let player1: Player = {
        y: 0,
        vy: 0,
    };

    let player2: Player = {
        y: 0,
        vy: 0,
    };

    function keydown(event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowUp':
                player1.vy = -1;
                break;
            case 'ArrowDown':
                player1.vy = 1;
                break;
            case 'w':
                player2.vy = -1;
                break;
            case 's':
                player2.vy = 1;
                break;
        }
    }

	const render: Render = ({ context, width, height }) => {
        context.fillStyle = 'white';

        // draw player 1
        context.fillRect(0, player1.y, 10, 100);
        // draw player 2
        context.fillRect(width - 10, player2.y, 10, 100);
	};
</script>

<svelte:window on:keydown={keydown} />

<Canvas autoplay>
	<Layer {render} />
</Canvas>

<style>
    :global(html, body) {
        background-color: black;
    }
</style> -->