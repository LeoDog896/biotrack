<script lang="ts">
	import { Canvas, Layer, type Render } from 'svelte-canvas';

    interface Player {
        y: number;
        vy: number;
    }

    let player1: Player = {
        y: 0.5,
        vy: 0,
    };

    let player2: Player = {
        y: 0.5,
        vy: 0,
    };

    function keydown(event: KeyboardEvent) {
        player1.vy = 0;
        player2.vy = 0;

        if (event.key === 'ArrowUp') {
            player1.vy = -1;
        } else if (event.key === 'ArrowDown') {
            player1.vy = 1;
        }
        
        if (event.key === 'w') {
            player2.vy = -1;
        } else if (event.key === 's') {
            player2.vy = 1;
        }
    }

    function keyup(event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
                player1.vy = 0;
                break;
            case 'w':
            case 's':
                player2.vy = 0;
                break;
        }
    }

    const xPad = 50;
    const padSize = 10;
    const padHeight = 100;

	const render: Render = ({ context, width, height, time }) => {
        context.fillStyle = 'white';
        const min = padHeight / height / 2;

        player1.y = Math.min(Math.max(player1.y + player1.vy / 40, min), 1 - min);
        player2.y = Math.min(Math.max(player2.y + player2.vy / 40, min), 1 - min);

        context.fillRect(xPad, player1.y * height - padHeight / 2, padSize, padHeight);
        context.fillRect(width - padSize - xPad, player2.y * height - padHeight / 2, 10, padHeight);
	};
</script>

<svelte:window on:keydown={keydown} on:keyup={keyup} />

<Canvas autoplay>
	<Layer {render} />
</Canvas>

<style>
    :global(html, body) {
        background-color: black;
        overflow-y: hidden;
    }
</style>
