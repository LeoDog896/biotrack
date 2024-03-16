<script lang="ts">
    export let officerNameInput: string;
    export let officerNameInputConfirm = '';
</script>

<div class="warning">
    <h2>Warning</h2>
    <p>
        Admins have the following permissions:
    </p>
    <ul>
        <li>Can not be managed by other admins</li>
        <li>Can deactivate other users</li>
        <li>Can invalidate game sessions</li>
        <li>Can deactivate and make new officers</li>
    </ul>
    <p>
        If you're absolutely sure you want to make this officer an admin,
        type in the officer's name below (<b>{officerNameInput}</b>):
    </p>
    <input
        type="text"
        bind:value={officerNameInputConfirm}
        placeholder="Confirm Officer Name"
    />
</div>

<style lang="scss">
    .warning {
        border-left: 5px solid var(--warning);
        padding: 1rem;
        padding-left: 1rem;
        background-color: rgba(0, 0, 0, 0.05);
        max-width: 500px;
    }
</style>
