<script lang="ts">
	import { pushState } from '$app/navigation';
	import Modal from '$lib/components/Modal.svelte';
	import { page } from '$app/stores';
	import { trpc } from '$lib/trpc/client';
	import Toaster from './Toaster.svelte';

	const showPingModal = () =>
		pushState('', {
			modalShowing: 'ping'
		});

	export let data;

	let message = '';

	async function sendMessage() {
		await trpc().ping.mutate({ message: message.substring(0, 280) });
		history.back();
	}
</script>

<Toaster officerName={data.officer.name} officerId={data.officer.id} />

<nav>
	<a href="/" class="title"><img src="/logo.svg" alt="biotrack" /> biotrack</a>
	<div class="links">
		<div class="dropdown">
			<a href="/dashboard">dashboard</a>
			<div class="dropdown-container">
				<div class="links">
					<a href="/player">players</a>
					<a href="/game">games</a>
				</div>
			</div>
		</div>
		<a href="/officer">officers</a>
		<a href="/scanner">check-in</a>
		{#if data.local}
			<a href="/orchestrator" class="red">orchestrator</a>
		{/if}
	</div>
</nav>

<main>
	<slot />

	{#if $page.state.modalShowing === 'ping'}
		<Modal on:close={() => history.back()}>
			<h2>ping everyone</h2>
			<p>send a message to everyone</p>
			<textarea
				maxlength="280"
				bind:value={message}
				name="message"
				rows="5"
				cols="30"
				placeholder="Message"
				required
			></textarea>
			<button on:click={sendMessage}>send</button>
		</Modal>
	{/if}
</main>

<footer>
	<div>
		having issues? <button on:click={showPingModal}>ping everyone</button>,
		<a href="https://leodog896.github.io/biotrack">check the docs</a>, or
		<a href="https://github.com/LeoDog896/biotrack/issues/new">report it on the bug tracker</a>
	</div>
</footer>

<style lang="scss">
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 2px solid black;
		height: 4rem;
	}

	.dropdown {
		position: relative;
		display: inline-block;

		&:hover .dropdown-container {
			display: block;
		}

		.dropdown-container {
			display: none;
			position: absolute;
			background-color: white;
			min-width: 160px;
			box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
			padding: 12px 16px;
			z-index: 1;
			border: 1px solid black;
			border-radius: 0;
			top: 100%;
			left: 0;
			text-align: left;

			.links {
				display: flex;
				flex-direction: column;
			}
		}
	}

	textarea {
		display: block;
		margin-bottom: 1rem;
	}

	.title {
		display: flex;
		align-items: center;
		gap: 1rem;

		img {
			width: 2rem;
			height: 2rem;
		}
	}

	.links {
		display: flex;
		gap: 1rem;
	}

	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 1rem;
		padding-bottom: 4rem;
	}

	footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		text-align: center;
		padding: 1rem;
		height: 4rem;
		border-top: 2px solid black;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: white;
		z-index: 1;
	}

	:global(button) {
		cursor: pointer;
		border: 1px solid black;
		border-radius: 0;
		background-color: white;
		text-align: center;

		&:hover {
			background-color: var(--color);
			color: white;
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	.red {
		color: var(--error);
	}
</style>
