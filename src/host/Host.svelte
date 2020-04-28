<script>
    import { PeerHost } from '../peer-host';
    import { createEventDispatcher } from 'svelte';
    import GameCreationForm from './GameCreationForm.svelte'

    const dispatch = createEventDispatcher();
    const host = new PeerHost();
    let hostId;
    let players = [];

    let brokingHost;
    let brokingPort;
    let brokingPath;
    let brokingKey;


    function createGameHost() {
        host.start({
            debug: 2,
            host: brokingHost,
            port: brokingPort,
            path: brokingPath,
            key: brokingKey
        }).then(id => { 
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

    function generateUrlParam(key, value) {
        if (value) {
            return  `&${key}=${value}`; 
        }
        return '';
    }

    $: sharableLink = window.location.origin 
        + '/?game=' + hostId 
        + generateUrlParam('brokingHost', brokingHost) 
        + generateUrlParam('brokingPort', brokingPort) 
        + generateUrlParam('brokingPath', brokingPath) 
        + generateUrlParam('brokingKey', brokingKey);
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
    <h2>Broking server options</h2>
    <label>Host</label>
    <input bind:value={brokingHost} />
    <label>Port</label>
    <input bind:value={brokingPort}/>
    <label>Path</label>
    <input bind:value={brokingPath}/>
    <label>Key</label>
    <input bind:value={brokingKey}/>
{:else}
    <button on:click={restartGame}>Restart the game</button>
    <p>Share this link to the players : <a href={sharableLink} target="_blank">{sharableLink}</a></p>

    <h2>Liste des joueurs</h2>

    <table>
        <tbody>
            {#each players as player}
                <tr>
                    <td>{player.name}</td>
                    <td on:click={() => removePlayer(player)}>
                        <i class="gg-close"></i>
                    </td>
                </tr> 
            {/each}
        </tbody>
    </table>

    <h2>Création de la partie</h2>
    <GameCreationForm {players} on:gameCreated={onGameCreated}/>
{/if}