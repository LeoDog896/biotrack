<script lang="ts">
	export let data;
</script>

<h1>Officer <span class="accent">{data.officer.name}</span></h1>

<p>id: <span class="accent">{data.officer.id}</span></p>
<p>admin: <span class={data.officer.admin.toString()}>{data.officer.admin}</span></p>

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
