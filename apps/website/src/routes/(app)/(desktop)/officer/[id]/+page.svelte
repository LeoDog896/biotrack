<script lang="ts">
	import { enhance } from '$app/forms';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Modal from '$lib/components/Modal.svelte';
	import AdminWarning from '../AdminWarning.svelte';

	function openPromoteModal() {
		pushState('', {
			modalShowing: 'promote'
		});
	}

	let officerNameInputConfirm = '';

	export let data;
</script>

<h1>Officer <span class="accent">{data.officer.name}</span></h1>

<p>id: <span class="accent">{data.officer.id}</span></p>
<p>
	admin:
	<span class={data.officer.admin.toString()}>{data.officer.admin}</span>
	{#if !data.officer.admin && data.thisOfficer.admin}
		<button on:click={openPromoteModal}>promote</button>
	{/if}
</p>

{#if $page.state.modalShowing === 'promote'}
	<Modal on:close={() => history.back()}>
		<form method="POST" action="?/promote" use:enhance>
			<AdminWarning officerNameInput={data.officer.name} bind:officerNameInputConfirm />

			<button type="submit" disabled={officerNameInputConfirm !== data.officer.name}>Promote</button
			>
		</form>
	</Modal>
{/if}

<h2>Actions</h2>

<button>archive</button>

<style lang="scss">
	.accent {
		color: var(--color);
	}

	.true {
		color: var(--success);
	}

	.false {
		color: var(--error);
	}

	button {
		margin-top: 1rem;
	}
</style>
