<script>
    import { PeerHost } from '../peer-host';
    import { createEventDispatcher } from 'svelte';
    import GameCreationForm from './GameCreationForm.svelte'

    const dispatch = createEventDispatcher();
    const host = new PeerHost();
    let hostId;
    let players = [];


    function createGameHost() {
        host.start().then(id => { 
            hostId = id;
            dispatch('createdHost', id);
        });

        host.players$.subscribe(p => {
            players = p;
        });
    }

    function restartGame() {
        host.resetGame();
    }

    function onGameCreated(event) {
        host.startGame(event.detail)
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
</style>

<h1>Host</h1>

{#if !hostId}
    <button on:click={createGameHost}>Create a host server and start game</button>
{:else}
    <button on:click={restartGame}>Restart the game</button>
    <p>Share this link to the players : <a href={sharableLink} target="_blank">{sharableLink}</a></p>

    <h2>Liste des joueurs</h2>

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

    <h2>Création de la partie</h2>
    <GameCreationForm {players} on:gameCreated={onGameCreated}/>
{/if}