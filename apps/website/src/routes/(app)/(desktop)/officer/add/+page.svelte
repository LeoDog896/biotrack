<script lang="ts">
	import { enhance } from '$app/forms';
	import AdminWarning from '../AdminWarning.svelte';

	let admin = false;

	let officerNameInput = '';
	let officerNameInputConfirm = '';

	let password = '';
	let passwordConfirm = '';

	$: shouldStopSubmission =
		(admin && officerNameInputConfirm !== officerNameInput) || password !== passwordConfirm;
</script>

<h1>New Officer</h1>

<form method="POST" use:enhance>
	<input
		type="text"
		autocomplete="off"
		name="name"
		placeholder="Name"
		bind:value={officerNameInput}
	/>
	<input
		type="password"
		autocomplete="new-password"
		bind:value={password}
		name="password"
		placeholder="Password"
	/>
	<input
		type="password"
		bind:value={passwordConfirm}
		name="passwordConfirm"
		placeholder="Confirm Password"
	/>

	{#if password !== passwordConfirm}
		<p class="error">Passwords do not match</p>
	{/if}

	<div class="formInput">
		<label for="admin">Admin</label>
		<input type="checkbox" name="admin" id="admin" bind:checked={admin} />
	</div>

	{#if admin}
		<AdminWarning bind:officerNameInput bind:officerNameInputConfirm />
	{/if}

	<button type="submit" disabled={shouldStopSubmission}>Create</button>
</form>

<style>
	input {
		display: block;
		margin-bottom: 1rem;
	}

	.error {
		color: var(--error);
	}

	.formInput {
		display: flex;
		gap: 1rem;
	}

	button {
		margin-top: 1rem;
	}
</style>
