<script>
    export let src = '';

    let realSrc = src

    function onError() {
        if (realSrc != 'default.png') {
            realSrc = 'default.png';
        }
    }
</script>

<style>
    .card-container {
        width: 198px;
        height: 281px;
        display: inline-block;
    }

    img {
        width: 100%;
        height: 100%;
    }

    img:before {
        content: ' ';
        display: block;
        position: absolute;
        width: 198px;
        height: 281px;
        background-image: url(cards/images/default.png);
    }
</style>

<div class="card-container">
    <img src={'cards/images/' + realSrc} alt="card" on:error={onError} />
</div>