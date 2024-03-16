<script lang="ts">
    import toast, { Toaster } from '@leodog896/svelte-french-toast';
	import { onMount } from 'svelte';
    import { trpc } from '$lib/trpc/client';
	import Message from './Message.svelte';

    export let officerName: string;

    onMount(() => {
		const { unsubscribe } = trpc().pingSubscription.subscribe(undefined, {
			onData(value) {
				toast(Message, {
					style: 'border: 2px solid black; border-radius: 0;',
					icon: '💬',
					position: 'bottom-right',
                    props: {
                        author: officerName,
                        message: value
                    }
				});
			}
		});

		return () => unsubscribe();
	})
</script>

<Toaster />
