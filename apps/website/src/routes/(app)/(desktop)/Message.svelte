<script lang="ts">
    export let author: string;
    export let message: string;
    export let id: string;
</script>

<div class="content">
    <p>from: <a href="/officer/{id}">{author}</a></p>
    <p>{message.substring(0, 280)}</p>
</div>
