<script lang="ts">
	import Card3 from "../../components/Card3.svelte";
	import type { CardProps, PlaceProps } from "../../types";
	
	let cards = [
		{ suit: 'spade', value: 'A', id: 's1', isOpen: false },
		{ suit: 'spade', value: '2', id: 's2', isOpen: false },
		{ suit: 'spade', value: '3', id: 's3', isOpen: false },
		{ suit: 'spade', value: '4', id: 's4', isOpen: false },
		{ suit: 'spade', value: '5', id: 's5', isOpen: false },
		{ suit: 'spade', value: '6', id: 's6', isOpen: false },
	];

	let state: PlaceProps[] = [
		{ id: 'p1', cards: [
			{ suit: 'spade', value: 'A', id: 's1', isOpen: false },
			{ suit: 'spade', value: '2', id: 's2', isOpen: false }
		] },
		{ id: 'p2', cards: [{ suit: 'spade', value: '3', id: 's3', isOpen: false }] },
		{ id: 'p3', cards: [
			{ suit: 'spade', value: '4', id: 's4', isOpen: false },
			{ suit: 'spade', value: '5', id: 's5', isOpen: false },
			{ suit: 'spade', value: '6', id: 's6', isOpen: false },
		] }
	];

	function updateState(to: string, from: string) {
		const [, toPlaceIndex, toCardIndex, toCardId] = to.split('--');
		const [placeIndex, cardIndex, cardId] = from.split('--');
		const temp: CardProps[] = state[+placeIndex].cards.splice(+cardIndex);
		state[+toPlaceIndex].cards.push(...temp);
		state = state;
		// state[+toPlaceIndex].cards.splice(+toCardIndex, 0, cards.find((it) => it.id === toCardId)!);

		// console.log({toPlaceIndex, toCardIndex, toCardId});
	}
</script>

<div class="container">
	<div class="zone">
		<Card3 {state} cardIndex={0} placeIndex={0} {updateState} />
	</div>
	<div class="zone">
		<Card3 {state} cardIndex={0} placeIndex={1} {updateState} />
	</div>
	<div class="zone">
		<Card3 {state} cardIndex={0} placeIndex={2} {updateState} />
	</div>
</div>

<style lang="scss">
	body {
		background-color: #ccc;
	}
	.container {
		display: flex;
		gap: 10px;
	}
	.zone {
		width: 300px;
		height: 600px;
		padding: 10px;
		border: 1px solid #999;
	}
</style>