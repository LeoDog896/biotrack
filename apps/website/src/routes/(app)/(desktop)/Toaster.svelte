<script lang="ts">
	import toast, { Toaster } from '@leodog896/svelte-french-toast';
	import { onMount } from 'svelte';
	import { trpc } from '$lib/trpc/client';
	import Message from './Message.svelte';
	import { page } from '$app/stores';

	onMount(() => {
		const { unsubscribe } = trpc().pingSubscription.subscribe(undefined, {
			onData({ message, officerID, officerName }) {
				if ($page.url.pathname === '/pager') return;

				toast(Message, {
					style: 'border: 2px solid black; border-radius: 0;',
					icon: '💬',
					position: 'bottom-right',
					props: {
						author: officerName,
						id: officerID,
						message
					},
					duration: 6000
				});
			}
		});

		return () => unsubscribe();
	});
</script>

<Toaster />
