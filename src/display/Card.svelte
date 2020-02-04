<script>
    export let card = null;

    let realSrc = card.image;

    function onError() {
        if (realSrc != 'default.png') {
            realSrc = 'default.png';
        }
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

    img {
        width: 100%;
        height: 100%;
    }
</style>

<div class="aspect-ratio-box">
    <div class="aspect-ratio-box-inside">
        <img src={'cards/images/' + realSrc} alt="card" on:error={onError} />
    </div>
</div>