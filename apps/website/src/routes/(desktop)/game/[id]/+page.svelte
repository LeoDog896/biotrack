<script lang="ts">
    export let data;
</script>

<h1>{data.game.name}</h1>
<p>id: {data.game.id}</p>
<p>Max Players: {data.game.playerCount ?? "Arbitrary"}</p>
