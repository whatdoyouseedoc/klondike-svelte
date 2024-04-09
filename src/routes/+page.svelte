<script lang="ts">
	import type { CardProps, PlaceProps } from '../types';
	import Card from '../components/Card.svelte';
	import Place from '../components/Place.svelte';
	import { CARDS, TEST_STACK_COMPLETE } from '../const';
	import Deck from '../components/Stock.svelte';
	import { randomizeDeck, canDrop, init } from '../utils';

	let deck: PlaceProps = {
		id: 'd',
		// cards: [
		// 	{ suit: 'spade', value: 'A', id: 's1' },
		// 	{ suit: 'spade', value: '2', id: 's2' },
		// 	{ suit: 'spade', value: '3', id: 's3' },
		// 	{ suit: 'spade', value: '4', id: 's4' },
		// ]
		// cards: randomizeDeck(CARDS)
		cards: []
	};
	
	let places: PlaceProps[] = [
		{ id: 'p1', cards: [TEST_STACK_COMPLETE[0], TEST_STACK_COMPLETE[1]] },
		{ id: 'p2', cards: [] },
		{ id: 'p3', cards: [] },
		{ id: 'p4', cards: [] },
		{ id: 'p5', cards: [] },
		{ id: 'p6', cards: [] },
		{ id: 'p7', cards: [] },
	];

	init(deck.cards, places);
	
	let card: CardProps | null = null;
	let fromId: string | null = null;

	function onDrop(e: DragEvent) {
		let dropzoneEl = null;

		if ((e.target as HTMLElement).classList.contains('dropzone')) {
			dropzoneEl = e.target;
		} else {
			dropzoneEl = (e.target as HTMLElement).closest('.dropzone');
		}
		const id = dropzoneEl?.id;
		console.log(id);

		if (!id || (id[0] !== 'p' && id !== 'd')) {
			console.log('place id not found');
			return;
		}

		if (id === fromId) {
			return;
		}

		const place = places.find((it) => it.id === id)!;
		
		if (!canDrop(card!, place)) {
			return;
		}

		place.cards = [...place.cards, card!];

		if (fromId === 'd') {
			deck.cards = deck.cards.filter((c) => c.id !== card?.id);
		} else {
			const fromPlace = places.find((it) => it.id === fromId)!;
			fromPlace.cards = fromPlace.cards.filter((c) => c.id !== card?.id);
		}

		places = [...places];
		card = null;
	}

	function onDrag(e: DragEvent) {
		const dropzoneEl = (e.target as HTMLElement).closest('.dropzone');
		fromId = dropzoneEl?.id!;
		const cardId = (e.target as HTMLElement).getAttribute('id');

		if (fromId === 'd') {
			card = deck.cards.find((it) => it.id === cardId)!;
		} else {
			card = places.find(it => it.id === fromId)?.cards.find((it) => it.id === cardId)!;
		}
	}
</script>

<style lang="scss">
	* {
		user-select: none;
	}

	.table {
		height: 100vh;
		background-color: #35654d;
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.row {
		display: flex;
		justify-content: flex-start;
		gap: 40px;
	}
</style>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="table">
	<div class="row">
		<!-- <Place id={deck.id} cards={deck.cards} {onDrag} /> -->
		<Deck cards={deck.cards} {onDrag} />
	</div>
	<div class="row">
		{#each places as place (place.id)}
			<Place {...place} {onDrop} {onDrag} />
		{/each}
	</div>
</section>
