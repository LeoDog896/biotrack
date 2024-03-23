<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { trpc } from '$lib/trpc/client.js';
	import { onMount } from 'svelte';
	import MdiMessage from '~icons/mdi/message';

	export let data;

	let message = '';
	let messageBox: HTMLDivElement;

	async function sendMessage() {
		await trpc().ping.mutate({ message: message.substring(0, 280) });
		message = '';
	}

    function isClose(a: number, b: number, threshold = 10) {
        return Math.abs(a - b) < threshold;
    }

	onMount(() => {
		messageBox.scrollTop = messageBox.scrollHeight;

		const { unsubscribe } = trpc().pingSubscription.subscribe(undefined, {
			async onData() {
				const atBottom = isClose(messageBox.scrollTop + messageBox.clientHeight, messageBox.scrollHeight);
                await invalidateAll();
				if (atBottom) {
					messageBox.scrollTop = messageBox.scrollHeight;
				}
			}
		});

		return () => unsubscribe();
	});
</script>

<h1>
	Pager
	<MdiMessage />
</h1>

<p>
	<i>
		<span class="accent">note:</span>
		all chats are stored permanently.
	</i>
</p>

<div class="messageBox">
	<div class="messages" bind:this={messageBox}>
		{#each data.messages.slice().reverse() as message}
			<div class="message">
				<div class="author">
					<a href="/officer/{message.officer.id}">
						{#if message.officer.id === data.officer.id}
							<span class="positive">{message.officer.name}</span>
						{:else}
							{message.officer.name}
						{/if}
					</a>
					<span class="gray">
						at {message.createdAt.toLocaleString()}
					</span>
				</div>
				<div class="content">{message.content}</div>
			</div>
		{/each}
	</div>

	<div class="sendMessage">
		<input
			type="text"
			bind:value={message}
			placeholder="message"
			maxlength="280"
			on:keydown={(e) => e.key === 'Enter' && sendMessage()}
		/>
		<button on:click={sendMessage}>send</button>
	</div>
</div>

<style lang="scss">
	h1 {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.message {
		border: 1px solid black;
		margin: 0.5em 0;
		padding: 0.5em;
	}

	.sendMessage {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;

		input {
			width: 100%;
			margin-top: 0;
		}
	}

	.accent {
		color: var(--color);
	}

	.author {
		display: flex;
		justify-content: space-between;
	}

	.gray {
		color: gray;
	}

	.positive {
		color: var(--success);
	}

	.content {
		margin-top: 0.5em;
	}

	input {
		display: block;
		margin-top: 1em;
	}

	.messages {
		overflow-y: auto;
		height: 100%;
		margin-bottom: 1rem;
	}

	.messageBox {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		padding: 1rem;
		border: 1px solid black;
	}
</style>
