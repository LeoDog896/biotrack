<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	const dispatch = createEventDispatcher<{
		close: undefined;
	}>();

	let modalClickHelper = () => dispatch('close');
</script>

<button
	on:mousedown|self={modalClickHelper}
	transition:fade={{ easing: cubicInOut, duration: 150 }}
>
	<div transition:fly={{ easing: cubicInOut, duration: 300, delay: 50, y: 50 }}>
		<slot />
	</div>
</button>

<style lang="scss">
	button {
		all: unset;
		position: fixed;
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
		top: 0px;
		left: 0px;
		z-index: 10;

		&:hover {
			background: rgba(0, 0, 0, 0.5);
			color: black;
		}
	}

    div {
		box-sizing: border-box;
        border: 2px solid black;
		padding: 2rem;
		background: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		max-width: calc(100% - 2rem);
	}
</style>
