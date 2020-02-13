<script>
    import { createEventDispatcher } from 'svelte';
    export let players = [];

    const dispatch = createEventDispatcher();
    
    let shadowHunters;
    let shadowHuntersChoices;
    
    $: neutrals = players.length - shadowHunters * 2;

    $: {
        players;
        playersUpdated();
    }

    function playersUpdated() {
        shadowHuntersChoices = [...Array(Math.floor(players.length / 2) + 1).keys()];
        console.log('players', shadowHuntersChoices);
    }

    function submit() {
        dispatch('gameCreated', {
            shadowHunters: shadowHunters
        });
    }
</script>

<style>
    .inline {
        display: inline-block;
    }

    .container {
        margin: 0;
        padding: 0;
    }

    select {
        background-color: white;
    }

    button {
        width: 100%;
    }
</style>

<p>Nombre de joueurs : {players.length}</p>

<form>
    <div class="container">
        <div class="row">
            <div class="column column-50">
                <label class="inline">Nombre de Shadow et Hunters</label>
                <select bind:value={shadowHunters} class="inline">
                    {#each shadowHuntersChoices as choice}
                        <option value={choice}>{choice}</option>
                    {/each}
                </select>
            </div>

            <div class="column column-50">
                <label class="inline">Nombre de neutres</label>
                <select bind:value={neutrals} disabled>
                    <option value={neutrals}>{neutrals}</option>
                </select>
            </div>
        </div>
    </div>
    <button type="button" on:click={submit}>Start game !</button>
</form>