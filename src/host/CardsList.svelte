<script>
    import { createEventDispatcher } from 'svelte';
    import { cardsStore } from '../cards-store';
    import Card from '../display/Card.svelte';

    const dispatch = createEventDispatcher();

    let cards = [];
    let playableCards = [];
    let showCards = true;

    cardsStore.subscribe(c => {
        cards = c;
        if (!localStorage.getItem('removedCards')) {
            playableCards = [...cards];
        } else {
            const removedCardsNames = JSON.parse(localStorage.getItem('removedCards'));
            playableCards = cards.filter(card => !removedCardsNames.includes(card.name));
        }
    });

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
        dispatch('cardsChanged', playableCards);
    }
</script>

<style>
    .medium-card {
        width: 300px;
        display: inline-block;
    }

    .removed-card {
        opacity: 0.6;
    }
</style>

<h2 class="center">Liste des personnages <span><i class="{showCards ? 'gg-chevron-down' : 'gg-chevron-up'}" on:click={() => showCards = !showCards}></i></span></h2>

{#if showCards}
    {#each cards as card}
        <div 
            class="medium-card" 
            on:click={() => toggleCard(card)}
            class:removed-card={playableCards.findIndex(c => c.name === card.name) === -1}>
            <Card {card}/>
        </div>
    {/each}
{/if}