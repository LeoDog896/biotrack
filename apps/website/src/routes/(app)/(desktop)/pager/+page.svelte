<script lang="ts">
    import MdiMessage from '~icons/mdi/message';

    export let data;
</script>

<h1>
    Pager
    <MdiMessage />
</h1>

<p><i>note: all chats are stored permanently</i></p>

<div class="messageBox">
    {#each data.messages as message}
        <div class="message">
            <div class="author">
                <a href="/officer/{message.officer.id}">{message.officer.name}</a>
                <span class="gray">
                    at {message.createdAt.toLocaleString()}
                </span>
            </div>
            <div class="content">{message.content}</div>
        </div>
    {/each}

    <input type="text" placeholder="message" />
</div>

<style>
    h1 {
        display: flex;
        align-items: center;
        gap: 0.5em;
    }

    .message {
        border: 1px solid black;
        margin: 0.5em 0;
        padding: 0.5em;
    }

    .author {
        display: flex;
        justify-content: space-between;
    }

    .gray {
        color: gray;
    }

    .content {
        margin-top: 0.5em;
    }

    input {
        display: block;
        margin-top: 1em;
    }

    .messageBox {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        padding: 1rem;
        border: 1px solid black;
    }
</style>