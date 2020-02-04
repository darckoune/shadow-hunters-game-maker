<script>
	import Host from './host/Host.svelte';
	import Game from './game/Game.svelte';

	let hostId = window.location.pathname ? window.location.pathname.substr(1) : null;
	let gameCreator = false;

	function onCreatedHost(ev) {
		gameCreator = true;
		hostId = ev.detail;
	}
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
	{#if !hostId || gameCreator}
		<div class="host-section">
			<Host on:createdHost={onCreatedHost}/>
		</div>
	{/if}
	
	{#if hostId}
		<div class="game-section">
			<Game hostId={hostId}/>
		</div>
	{/if}
</div>
