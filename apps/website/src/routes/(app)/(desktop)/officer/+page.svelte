<script lang="ts">
	export let data;

	$: officers = data.officers.filter((officer) => officer.id !== data.officer.id);
</script>

<h1>Officers</h1>

<h2>My Account</h2>

<p>id: <span class="accent">{data.officer.id}</span></p>
<p>name: <span class="accent">{data.officer.name}</span></p>
<p>admin: <span class={data.officer.admin.toString()}>{data.officer.admin}</span></p>

<h2>Other Officers</h2>

{#if officers.length === 0}
	<p>
		<i>No other officers exist.</i>
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

	.true {
		color: var(--success);
	}

	.false {
		color: var(--error);
	}
</style>
