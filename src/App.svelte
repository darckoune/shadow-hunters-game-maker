<script>
	import Host from './host/Host.svelte';
	import Game from './game/Game.svelte';

	let hostId = null;
	if (window.location.search) {
		const h = window.location.search.split('=')[1]
		if (h) hostId = h;
	}

	let gameCreator = false;
</script>

<style>
	.app-container {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	.app-container div {
		padding: 10px;
	}
	
	.game-section, .host-section {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
</style>

<div class="app-container">
	{#if !hostId || gameCreator}
		<div class="host-section">
			<Host />
		</div>
	{/if}
	
	{#if hostId}
		<div class="game-section">
			<Game hostId={hostId}/>
		</div>
	{/if}
</div>
