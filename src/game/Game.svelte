<script>
    import PlayersList from './components/PlayersList.svelte';
    import Card from '../display/Card.svelte';

    import Peer from 'peerjs';
    import { afterUpdate } from 'svelte';

    export let hostId;

    let connectionToHost = null;
    let connectedToHostId = null;
    let connecting = false;
    let requestedName;

    let players = [];
    let card = null;

    const peer = new Peer();

    window.addEventListener("beforeunload", function (e) {
        if (connectionToHost) {
            connectionToHost.close();
        }
    }, false);

    function connect() {
        connecting = true;
        connectionToHost = peer.connect(hostId);
        connectionToHost.on('open', () => {
            connectedToHostId = hostId;
            connectionToHost.send({
                action: 'name',
                data: {
                    name: requestedName
                }
            });
            connectionToHost.send({
                request: 'players'
            });
        });
        connectionToHost.on('data', (data) => {
            console.log('data received', data);
            if (data.type === 'players') {
                players = data.data;
            }
            if (data.type === 'card') {
                card = data.data;
            }
        });
    }
</script>

<style>
    .horizontal-flex {
        display: flex;
        flex-direction: row;
    }

    .flex-1 {
        flex: 1;
    }
</style>

<h1>Game</h1>

{#if !connectedToHostId}
<div>
    <input bind:value={requestedName}>
    <button 
        on:click={connect} 
        disabled={connecting}>
        Pick a name
    </button>
</div>
{/if}

{#if connectedToHostId}
<div class="horizontal-flex">
    <div class="flex-1">
        <PlayersList {players} />
    </div>
</div>   
{/if}

{#if card}
    <Card {card} />
{/if}