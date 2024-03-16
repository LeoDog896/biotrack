<script lang="ts">
	import { enhance } from "$app/forms";

    let admin = false;

    let officerNameInput = '';
    let officerNameInputConfirm = '';

    let password = '';
    let passwordConfirm = '';

    $: shouldStopSubmission =
        (admin && officerNameInputConfirm !== officerNameInput) ||
        password !== passwordConfirm;

</script>

<h1>New Officer</h1>

<form method="POST" use:enhance>
    <input type="text" autocomplete="off" name="name" placeholder="Name" bind:value={officerNameInput} />
    <input type="password" autocomplete="new-password" bind:value={password} name="password" placeholder="Password" />
    <input type="password" bind:value={passwordConfirm} name="passwordConfirm" placeholder="Confirm Password" />
    
    {#if password !== passwordConfirm}
        <p class="error">Passwords do not match</p>
    {/if}
    
    <div class="formInput">
        <label for="admin">Admin</label>
        <input type="checkbox" name="admin" id="admin" bind:checked={admin} />
    </div>

    {#if admin}
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
                If you're absolutely sure you want to create an admin,
                type in the officer's name below (<b>{officerNameInput}</b>):
            </p>
            <input
                type="text"
                bind:value={officerNameInputConfirm}
                placeholder="Confirm Officer Name"
            />
        </div>
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

    .warning {
        border-left: 5px solid var(--warning);
        padding: 1rem;
        padding-left: 1rem;
        background-color: rgba(0, 0, 0, 0.05);
    }

    button {
        margin-top: 1rem;
    }
</style>
