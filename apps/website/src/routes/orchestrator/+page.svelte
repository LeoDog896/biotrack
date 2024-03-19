<script lang="ts">
	import Marquee from './Marquee.svelte';
	import MdiViolin from '~icons/mdi/violin';
	import MdiShieldPlus from '~icons/mdi/shield-plus';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Modal from '$lib/components/Modal.svelte';

	export let data;

	function addOfficerModal() {
		pushState('', {
			modalShowing: 'addOfficer'
		});
	}

	let officerId: string | undefined;
	$: selectedOfficer = data.officers.find((officer) => officer.id === officerId);

	const editOfficerModal = (id: string) => () => {
		officerId = id;
		pushState('', {
			modalShowing: 'editOfficer'
		});
	};
</script>

<div class="container">
	<Marquee />
	<main>
		<h1><MdiViolin color="var(--error)" />Orchestrator</h1>
		<p>
			Management software for creating and editing all officers,
			<i>only</i> on the host computer.
		</p>
		<p>
			While this allows for officer management, this has its own systemic limitations, and to
			continue with actions, creating a new officer is required.
		</p>

		<h2>
			Officers
			<button class="addOfficer" on:click={addOfficerModal}>
				<MdiShieldPlus width="2rem" height="2rem" color="var(--error)" />
			</button>
		</h2>

		<div class="officers">
			{#each data.officers as officer}
				<button class="officer" on:click={editOfficerModal(officer.id)}>
					<h3>
						{officer.name}
					</h3>
					{#if officer.admin}
						<span class="admin">Admin</span>
					{/if}
				</button>
			{/each}
		</div>
	</main>
	<Marquee reverse />
</div>

{#if $page.state.modalShowing === 'addOfficer'}
	<Modal on:close={() => history.back()}>
		<h1>Add Officer</h1>
		<form method="POST" action="?/add">
			<div class="input">
				<label for="name">Name</label>
				<input type="text" name="name" id="name" required />
			</div>
			<div class="input">
				<label for="password">Password</label>
				<input type="newPassword" name="password" id="password" required />
			</div>
			<div class="input">
				<label for="confirmPassword">Confirm Password</label>
				<input type="confirmPassword" name="confirmPassword" id="confirmPassword" required />
			</div>
			<div class="input">
				<label for="admin">Admin</label>
				<input type="checkbox" name="admin" id="admin" />
			</div>
			<button type="submit">Add</button>
		</form>
	</Modal>
{/if}

{#if $page.state.modalShowing === 'editOfficer' && selectedOfficer}
	<Modal on:close={() => history.back()}>
		<div class="title">
			<h1>
				Officer
				<span class="accent">{selectedOfficer.name}</span>
			</h1>
		</div>
		{#if selectedOfficer.admin}
			<p class="accent">(admin) <button>demote</button></p>
		{:else}
			<button class="promoteButton">promote</button>
		{/if}
	</Modal>
{/if}

<style lang="scss">
	h1 {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

    form {
        text-align: left;
    }

	.title h1 {
		margin-bottom: 0;
	}

	.promoteButton {
		margin: 1rem 0;
	}

	button {
		background-color: white;
		border: 2px solid black;
		border-radius: 0;

		&:hover {
			cursor: pointer;
			background-color: var(--error);
			color: white;
		}
	}

	.accent {
		color: var(--error);
	}

	h2 {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;

		button {
			background-color: var(--background);
			transition: background-color 0.2s;
			cursor: pointer;
			border: none;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: scale 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);

			&:hover {
				scale: 1.1;
			}
		}
	}

	.addOfficer:hover {
		background-color: white;
	}

	main {
		text-align: center;
		flex: 1;
		overflow-y: scroll;
	}

	div.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.officers {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;

		.officer {
			color: black;
			border: 1px solid var(--border);
			padding: 1rem;
			border-radius: 0.5rem;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			gap: 1rem;
			min-width: 200px;
			max-width: 300px;
			border: 4px solid var(--error);
			background-color: white;

			&:hover {
				cursor: pointer;
				background-color: oklch(79.41% 0.094 18.69);
			}

			h3 {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			.admin {
				color: var(--error);
			}
		}
	}
</style>
