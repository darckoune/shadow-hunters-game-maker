<script>
	import Host from './host/Host.svelte';
	import Game from './game/Game.svelte';

	const gameId = window.location.pathname ? window.location.pathname.substr(1) : null;
</script>

<style>
	.container {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		overflow: auto;
	}
	.container div {
		padding: 10px;
	}
	.game-section {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
</style>

<div class="container">
	{#if !gameId}
		<div class="host-section">
			<Host/>
		</div>
	{/if}
	
	<div class="game-section">
		<Game/>
	</div>
</div>
