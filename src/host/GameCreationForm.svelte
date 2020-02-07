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
        if (!localStorage.getItem('removedCards')) {
            playableCards = [...cards];
        } else {
            const removedCardsNames = JSON.parse(localStorage.getItem('removedCards'));
            playableCards = cards.filter(card => !removedCardsNames.includes(card.name));
        }
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
            shadowHunters: shadowHunters,
            cards: playableCards
        });
    }

    function toggleCard(card) {
        if (playableCards.findIndex(c => c.name === card.name) > -1) {
            playableCards.splice(playableCards.findIndex(c => c.name === card.name), 1);
            playableCards = [...playableCards];
        } else {
            playableCards = [...playableCards, card];
        };
        localStorage.setItem(
            'removedCards', 
            JSON.stringify(cards.map(c => c.name).filter(cardName => !playableCards.map(c => c.name).includes(cardName)))
        );       
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

    .removed-card {
        opacity: 0.6;
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
        <div 
            class="medium-card" 
            on:click={() => toggleCard(card)}
            class:removed-card={playableCards.findIndex(c => c.name === card.name) === -1}>
            <Card {card}/>
        </div>
    {/each}
</form>