<script>
    export let card = null;
    let hasError = false;

    $: {
        card;
        hasError = false;
    }

</script>

<style>
    .aspect-ratio-box {
        height: 0;
        overflow: hidden;
        padding-top: calc(1406 / 991 * 100%);
        position: relative;
    }

    .aspect-ratio-box-inside {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .no-data {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .no-data > span {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 200%;
        transform: translateX(-50%) translateY(-50%);
    }

    .shadow {
        background-color: rgba(182, 13, 13);
    }

    .hunter {
        background-color: rgba(38, 13, 182);
        color: white;
    }

    .neutral {
        background-color: rgba(245, 193, 22);
    }

    img {
        width: 100%;
        height: 100%;
    }
</style>

<div class="aspect-ratio-box">
    <div class="aspect-ratio-box-inside">
        {#if !hasError}
            <img src={'cards/images/' + card.image} alt="card" on:error={() => hasError = true} />
        {:else}
            <div 
                class="no-data" 
                class:shadow={card.team === 'shadow'}
                class:hunter={card.team === 'hunter'}
                class:neutral={card.team === 'neutral'}>
                <span>{card.name}</span>
            </div>
        {/if}
    </div>
</div>