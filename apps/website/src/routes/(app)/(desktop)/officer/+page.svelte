<script lang="ts">
	import { UAParser } from 'ua-parser-js';
	import MdiShieldAdd from '~icons/mdi/shield-add';

	export let data;

	$: officers = data.officers.filter((officer) => officer.id !== data.officer.id);
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

<style lang="scss">
	.accent {
		color: var(--color);
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
