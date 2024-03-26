<script lang="ts">
	import { UAParser } from 'ua-parser-js';
	import MdiShieldAdd from '~icons/mdi/shield-add';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores'
	import Modal from '$lib/components/Modal.svelte';

	export let data;

	$: officers = data.officers.filter((officer) => officer.id !== data.officer.id);

	let password = '';
	let confirmPassword = '';
	function changePassword() {
		pushState('', {
			modalShowing: 'changePassword'
		});
	}
</script>

<div class="title">
	<h1>Officers</h1>
	{#if data.officer.admin}
		<a href="/officer/add"><MdiShieldAdd width="2rem" height="2rem" /></a>
	{/if}
</div>
<h2>My Account</h2>

<p>id: <span class="accent">{data.officer.id}</span></p>
<p>name: <span class="accent">{data.officer.name}</span></p>
<p>admin: <span class={data.officer.admin.toString()}>{data.officer.admin}</span></p>
<button on:click={changePassword}>change password</button>
<p>sessions:</p>
<div class="sessions">
	{#each data.officer.sessions as session}
		{@const parsedUA = new UAParser(session.userAgent).getResult()}
		<div class="session">
			<p>created at: <span class="accent">{session.createdAt.toLocaleString()}</span></p>
			<p>last used: <span class="accent">{session.lastUsed.toLocaleString()}</span></p>
			<p>by: <span class="accent">{session.ip}</span></p>
			{#if parsedUA}
				<p>
					on: <span class="accent">
						{parsedUA.browser.name}
						{parsedUA.browser.version};
						{parsedUA.os.name}
						{parsedUA.os.version}
					</span>
				</p>
			{:else}
				<p>on: <span class="false">unknown user agent</span></p>
			{/if}
		</div>
	{/each}
</div>

<h2>Other Officers</h2>

{#if officers.length === 0}
	<p>
		<i>
			No other officers exist.
			{#if data.officer.admin}
				<a href="/officer/add">Create one?</a>
			{/if}
		</i>
	</p>
{:else}
	<ul>
		{#each officers as officer}
			<li>
				<a href="/officer/{officer.id}">{officer.name}</a>
			</li>
		{/each}
	</ul>
{/if}

{#if $page.state.modalShowing === 'changePassword'}
	<Modal on:close={() => history.back()}>
		<h1>Change Password</h1>
		<p>Enter your new password:</p>
		<form method="POST" action="?/changePassword">
			<input class="input" name="password" type="password" autocomplete="new-password" placeholder="New Password" bind:value={password} />
			<input class="input" type="password" placeholder="Confirm password" bind:value={confirmPassword} />
			<button
				class="submitButton"
				type="submit"
				disabled={password !== confirmPassword || password.length < 1}
				on:click={changePassword}
			>change password</button>
		</form>
	</Modal>
{/if}

<style lang="scss">
	.accent {
		color: var(--color);
	}

	.input {
		display: block;
		margin-bottom: 0.5rem;
	}

	.submitButton {
		margin-top: 0.5rem;
	}

	.title {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.true {
		color: var(--success);
	}

	.false {
		color: var(--error);
	}

	.session {
		border-left: 4px solid var(--color);
		padding-left: 1rem;
	}
</style>
