<script lang="ts">
    export let author: string;
    export let message: string;
</script>

<div class="content">
    <p>from: <span class="accent">{author}</span></p>
    <p>{message}</p>
</div>

<style lang="scss">
    .accent {
        color: var(--color);
    }
</style>
