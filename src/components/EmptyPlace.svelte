<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="place" on:click>
	<div id="stock-circle" class="stock-circle"></div>
</div>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<style lang="scss">
	.place {
		box-sizing: border-box;
		width: 100px;
		height: 150px;
		border-radius: 10px;
		cursor: pointer;
		display: flex;
		align-items: center;
		position: relative;

		&.drag-over {
			border-color: #22d3ee;
		}

		.stock-circle {
			position: absolute;
			width: 80px;
			height: 80px;
			border-radius: 50%;
			border: 2px solid #ddd;
			position: absolute;
			top: 50%;
			right: 50%;
			transform: translate(50%, -50%);
			overflow: hidden;
		}
	}
</style>
