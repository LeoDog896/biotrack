<script lang="ts">
    import Marquee from "./Marquee.svelte";
    import MdiViolin from '~icons/mdi/violin';
    import MdiShieldPlus from '~icons/mdi/shield-plus';
	import { pushState } from "$app/navigation";
    import { page } from "$app/stores";
    import Modal from "$lib/components/Modal.svelte";

    export let data;

    function addOfficerModal() {
        pushState('', {
            modalShowing: 'addOfficer'
        })
    }
</script>

<div class="container">
    <Marquee />
    <main>
        <h1><MdiViolin color="var(--error)" />Orchestrator</h1>
        <p>
            Management software for creating and editing all officers,
            <i>only</i> on the host computer.
        </p>

        <h2>
            Officers 
            <button on:click={addOfficerModal}>
                <MdiShieldPlus width="2rem" height="2rem" color="var(--error)" />
            </button>
        </h2>

        <div class="officers">
            {#each data.officers as officer}
                <div class="officer">
                    <h3>
                        {officer.name}
                    </h3>
                    {#if officer.admin}
                        <span class="admin">Admin</span>
                    {/if}
                </div>
            {/each}
        </div>
    </main>
    <Marquee reverse />
</div>

{#if $page.state.modalShowing === 'addOfficer'}
    <Modal on:close={() => history.back()}>
        <h1>Add Officer</h1>
    </Modal>
{/if}

<style lang="scss">
    h1 {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    h2 {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;

        button {
            background-color: var(--background);
            transition: background-color 0.2s;
            cursor: pointer;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: scale 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);

            &:hover {
                scale: 1.1;
            }
        }
    }

    main {
        text-align: center;
        flex: 1;
        overflow-y: scroll;
    }

    div.container {
        height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .officers {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;

        .officer {
            border: 1px solid var(--border);
            padding: 1rem;
            border-radius: 0.5rem;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            min-width: 200px;
            max-width: 300px;
            border: 4px solid var(--error);

            h3 {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .admin {
                color: var(--error);
            }
        }
    }
</style>
