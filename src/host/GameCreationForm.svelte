<script>
    export let players = [];
    
    let shadowHunters;
    let shadowHuntersChoices;
    
    $: neutrals = players.length - shadowHunters * 2;

    $: {
        players;
        playersUpdated();
    }

    function playersUpdated() {
        shadowHuntersChoices = [...Array(Math.floor(players.length / 2) + 1).keys()];
        console.log('players', shadowHuntersChoices);
    }
</script>

<style>
    .inline {
        display: inline-block;
    }
</style>

<p>Nombre de joueurs : {players.length}</p>

<form>
    <label class="inline">Shadow & Hunters count</label>
    <select bind:value={shadowHunters} class="inline">
        {#each shadowHuntersChoices as choice}
            <option value={choice}>{choice}</option>
        {/each}
    </select>

    <label class="inline">Neutral count</label> <span>{neutrals}</span>
</form>