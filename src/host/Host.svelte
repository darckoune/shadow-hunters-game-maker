<script>
    import { PeerHost } from '../peer-host';
    import { createEventDispatcher } from 'svelte';
    import GameCreationForm from './GameCreationForm.svelte'
    import CardsList from './CardsList.svelte';

    const dispatch = createEventDispatcher();
    const host = new PeerHost();
    let hostId;
    let players = [];

    let cards = [];


    function createGameHost() {
        host.start().then(id => { 
            hostId = id;
            dispatch('createdHost', id);
        });

        host.players$.subscribe(p => {
            players = p;
        });
    }

    function onGameCreated(event) {
        host.startGame({
            shadowHunters: event.detail.shadowHunters,
            cards: cards
        })
    }

    function removePlayer(player) {
        host.removePlayer(player);
    }

    $: sharableLink = window.location.origin + '/?game=' + hostId;
</script>

<style>
    .gg-close {
        color: red;
        cursor: pointer;
    }

    .flex-center-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1
    }

    .flex-center {
        text-align: center;
    }

    .container {
        max-width: initial;
    }

    .bigger-text {
        font-size: 130%;
    }

    a {
        font-weight: bold;
    }
</style>

{#if !hostId}
    <div class="flex-center-container">
        <div class="flex-center">
            <h1>Shadow Hunters | Créateur de parties</h1>
            <button on:click={createGameHost}>Créer un serveur</button>
        </div>
    </div>
{:else}
    <h1 class="center">Shadow Hunters | Créateur de parties</h1>
    <p class="center bigger-text">Lien à partager aux joueurs<br/><a href={sharableLink} target="_blank">{sharableLink}</a></p>

    <div class="container">
        <div class="row">
            <div class="column column-50">
                <h2 class="center">Liste des joueurs</h2>
                <table>
                    <tbody>
                        {#each players as player}
                            <tr>
                                <td>{player.name}</td>
                                <td>
                                    <i class="gg-close" on:click={() => removePlayer(player)}></i>
                                </td>
                            </tr> 
                        {/each}
                    </tbody>
                </table>
            </div>
            <div class="column column-50">
                <h2 class="center">Création de la partie</h2>
                <GameCreationForm {players} on:gameCreated={onGameCreated}/>
            </div>
        </div>
        <div class="row">
            <div class="column">
                <CardsList on:cardsChanged={event => cards = event.detail}/>
            </div>
        </div>
    </div>
{/if}