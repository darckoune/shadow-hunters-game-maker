<script>
    import PlayersList from './components/PlayersList.svelte';
    import Peer from 'peerjs';

    let connectionToHost = null;
    let connectedToHostId = null;
    let hostId = null;

    let gameState = null;
    let players = [];

    const peer = new Peer();

    window.addEventListener("beforeunload", function (e) {
        if (connectionToHost) {
            connectionToHost.close();
        }
    }, false);

    function connect() {
        connectionToHost = peer.connect(hostId);
        connectionToHost.on('open', () => {
            connectedToHostId = hostId;
            connectionToHost.send({
                request: 'state'
            });
            connectionToHost.send({
                request: 'players'
            });
        });
        connectionToHost.on('data', (data) => {
            console.log('data received', data);
            if (data.type === 'state') {
                gameState = data.data;
            } else if (data.type === 'players') {
                players = data.data;
            }
        });
    }

    function sendPlayAction(event) {
        if (!connectionToHost) return;
        connectionToHost.send({
            action: 'play',
            data: {
                x: event.detail.x,
                y: event.detail.y
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

<div>
    <input bind:value={hostId}>
    <button 
        on:click={connect} 
        disabled={hostId === connectedToHostId}>
        Connect
    </button>
</div>

{#if connectionToHost || !connectionToHost}
<div class="horizontal-flex">
    <div class="flex-1">
        <PlayersList {players} />
    </div>
</div>   
{/if}