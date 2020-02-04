<script>
    import { createEventDispatcher } from 'svelte';
    import { cardsStore } from '../cards-store';
    import Card from '../display/Card.svelte';
    export let players = [];

    const dispatch = createEventDispatcher();
    
    let shadowHunters;
    let shadowHuntersChoices;
    let cards = [];
    let playableCards = [];

    cardsStore.subscribe(c => {
        cards = c;
        playableCards = [...cards];
    });
    
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

    .medium-card {
        width: 300px;
        display: inline-block;
    }
</style>

<p>Nombre de joueurs : {players.length}</p>

<form>
    <div>
        <label class="inline">Shadow & Hunters count</label>
        <select bind:value={shadowHunters} class="inline">
            {#each shadowHuntersChoices as choice}
                <option value={choice}>{choice}</option>
            {/each}
        </select>
    </div>

    <div>
        <label class="inline">Neutral count</label>
        <span>{neutrals}</span>
    </div>

    <button type="button" on:click={submit}>Start game !</button>

    <h2>Liste des personnages</h2>

    {#each cards as card}
        <div class="medium-card">
            <Card {card} />
        </div>
    {/each}
</form>