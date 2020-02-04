<script>
    export let players = [];
</script>

<h2>Players ({players.length})</h2>
<ul>
    {#each players as player}
    <li>{player.playerId} : {player.name}</li>
    {/each}
</ul>