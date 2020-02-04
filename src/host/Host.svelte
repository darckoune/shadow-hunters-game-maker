<script>
    import { PeerHost } from '../peer-host';

    const host = new PeerHost();
    let hostId;


    function createGameHost() {
        host.start().then(id => hostId = id);
    }

    function restartGame() {
        host.resetGame();
    }

    $: sharableLink = window.location.origin + '/' + hostId;
</script>

<h1>Host</h1>

{#if !hostId}
    <button on:click={createGameHost}>Create a host server and start game</button>
{:else}
    <button on:click={restartGame}>Restart the game</button>
    <p>Share this link to the players : <a href={sharableLink} target="_blank">{sharableLink}</a></p>
{/if}