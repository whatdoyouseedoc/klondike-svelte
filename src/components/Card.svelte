<script lang="ts">
	import { selectedCard } from '../stores';
	import type { CardProps } from '../types';
	import {
		animateMove,
		canDrop,
		getPlaceIdFromString,
		getRank,
		highlightOff,
		highlightOn
	} from '../utils';

	export let state: Record<string, CardProps[]>;
	export let placeId: string;
	export let cardIndex: number;
	export let updateState: any;
	export let openCard: any;

	$: place = state[placeId];
	$: card = place[cardIndex];
	$: nextCardIndex = cardIndex + 1;
	$: color = card.suit === 'spade' || card.suit === 'club' ? 'black' : 'red';
	$: suit =
		card.suit === 'spade'
			? '♠'
			: card.suit === 'heart'
				? '♥'
				: card.suit === 'club'
					? '♣'
					: '♦';

	let selectedCardValue: CardProps;

	selectedCard.subscribe((value: CardProps) => {
		selectedCardValue = value;
	});

	function isThereNextCard() {
		return place[nextCardIndex];
	}

	function onDragStart(e: DragEvent) {
		const data = {
			placeId,
			cardIndex,
			cardId: card.id,
			card
		};

		selectedCard.set(card);

		e.dataTransfer?.setData('text/plain', JSON.stringify(data));
	}

	function onDragOver(e: DragEvent) {
		if (isThereNextCard() || !canDrop(selectedCardValue, placeId, state)) {
			return;
		}

		const card = (e.target as HTMLElement).closest('.card');

		highlightOn(card as HTMLElement);
	}

	function onDragLeave(e: DragEvent) {
		const card = (e.target as HTMLElement).closest('.card');
		highlightOff(card as HTMLElement);
	}

	/* Fires when something has been dropped on it */
	function onDrop(e: DragEvent) {
		if (isThereNextCard() || !canDrop(selectedCardValue, placeId, state)) {
			return;
		}

		const card = (e.target as HTMLElement).closest('.card');
		highlightOff(card as HTMLElement);

		const json = e.dataTransfer?.getData('text/plain');
		const data = JSON.parse(json!);

		const dz = (e.target as HTMLElement).closest('.dropzone');
		const id = getPlaceIdFromString(dz?.id!);

		updateState(id, data.placeId, data.cardIndex);

		selectedCard.set(null);
	}

	function open() {
		return openCard(placeId, cardIndex);
	}

	async function onDblClick(e: MouseEvent) {
		if (
			(placeId !== 'talon' && isThereNextCard()) ||
			!card.isOpen ||
			placeId.includes('foundation')
		) {
			return;
		}

		for (const fKey of ['foundation-1', 'foundation-2', 'foundation-3', 'foundation-4']) {
			const foundation = state[fKey];

			if (foundation.length === 0) {
				if (getRank(card) === 1) {
					const el = (e.target as HTMLElement).closest('.card')! as HTMLElement;
					const target = document.getElementById(`foundation--${fKey}`)!;

					await animateMove(el, target);
					updateState(fKey, placeId, cardIndex);

					return;
				}
			} else {
				const lastCard = foundation.at(-1)!;

				if (lastCard.suit === card.suit && getRank(lastCard) === getRank(card) - 1) {
					const el = (e.target as HTMLElement).closest('.card')! as HTMLElement;
					const target = document.getElementById(`foundation--${fKey}`)!;

					await animateMove(el, target);
					updateState(fKey, placeId, cardIndex);

					return;
				}
			}
		}
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	id={`dz--${placeId}--${cardIndex}--${card.id}`}
	class="dropzone"
	class:foundation-pile={placeId.includes('foundation')}
	draggable={card.isOpen}
	on:dragstart|stopPropagation={onDragStart}
	on:dragover|preventDefault={onDragOver}
	on:dragleave={onDragLeave}
	on:drop={onDrop}
	on:dblclick|stopPropagation={onDblClick}
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="card" class:closed={!card.isOpen} on:click={open}>
		<div class="card-back"></div>
		<div class="card-face">
			<div class="card-rank-corner" style="color: {color}">
				<div>{card.rank}</div>
				<div>{suit}</div>
			</div>
			<div class="card-rank-center" style="color: {color}">{suit}</div>
		</div>
	</div>

	{#if placeId !== 'talon' && !placeId.includes('foundation') && place[nextCardIndex]}
		<svelte:self {updateState} {openCard} {state} {placeId} cardIndex={nextCardIndex} />
	{/if}

	<!-- <slot /> -->
</div>

<style lang="scss">
	.dropzone {
		width: fit-content;
		box-sizing: border-box;
		position: relative;
		border-radius: 10px;
		perspective: 750px;

		&.foundation-pile {
			position: absolute;
		}
	}

	.card {
		box-sizing: border-box;
		width: 100px;
		height: 150px;
		border-radius: 10px;
		cursor: pointer;
		transition: transform 0.4s;
		position: relative;
		transform-style: preserve-3d;
		transform: rotateY(0deg);

		& > * {
			// fix highligiht flickering when drag over child elements
			pointer-events: none;
		}

		&.closed {
			transform: rotateY(-180deg);
		}

		@keyframes pop-animation {
			0% {
				transform: scale(1);
			}
			50% {
				transform: scale(2);
			}
			100% {
				transform: scale(1);
			}
		}

		&.pop-animation {
			animation-name: pop-animation;
			animation-duration: 0.5s;
		}

		.card-face,
		.card-back {
			box-sizing: border-box;
			border: 1px solid black;
			border-radius: 8px;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			backface-visibility: hidden;
		}

		.card-back {
			background: green;
			transform: rotateY(180deg);
		}

		.card-face {
			background: #eee;
		}

		.card-rank-corner {
			font-size: 1rem;
			position: absolute;
			top: 5px;
			left: 5px;
			display: flex;
			flex-flow: column;
			justify-content: center;
			align-items: center;

			:nth-child(2) {
				margin-top: -4px;
			}
		}

		.card-rank-center {
			font-size: 4rem;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>
