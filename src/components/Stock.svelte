<script lang="ts">
	import type { CardProps } from '../types';
	import Card from './Card.svelte';
	import EmptyPlace from './EmptyPlace.svelte';
	// export let onDrag: (e: DragEvent) => void;
	export let openCard: any;
	export let updateState: any;

	// export let id = 'talon';
	export let state: Record<string, CardProps[]>;

	$: cards = state['talon'];

	function getZIndexStyle(card: CardProps, i: number) {
		return card.isOpen ? `z-index: ${cards.length - i};` : '';
	}

	function getTransformStyle(card: CardProps) {
		return card.isOpen ? 'transform: translateX(140px);' : '';
	}

	function resetDeck() {
		cards.forEach((card, i) => {
			setTimeout(
				() => {
					card.isOpen = false;
					cards = cards;
				},
				(800 / cards.length) * i
			);
		});
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="stock">
	<EmptyPlace on:click={resetDeck} />
	{#each cards as card, i (card.id)}
		<div
			class="card-container"
			class:open={card.isOpen}
			style={`${getZIndexStyle(card, i)} ${getTransformStyle(card)}`}
			on:click={() => {}}
		>
			<!-- <Card {card} isOpen={card.isOpen} {onDrag} /> -->
			<Card
				{updateState}
				openCard={openCard}
				{state}
				placeId={'talon'}
				cardIndex={i}
			/>
		</div>
	{/each}
</div>

<style lang="scss">
	.stock {
		position: relative;
		width: 100px;
		border: 1px solid #ddd;
        border-radius: 10px;
        padding: 1px;
	}

	.card-container {
		transition: 0.5s;
		position: absolute;
		top: 0;
		left: 0;

		@for $i from 1 through 10 {
		    &:nth-child(#{$i}) {
		        margin-top: 1px;
		        margin-left: 1px;
		    }

			&.open:nth-last-child(#{$i}) {
				margin-top: 1px;
				margin-left: 1px;
			}
		}

		@for $i from 11 through 20 {
		    &:nth-child(#{$i}) {
		        margin-top: 3px;
		        margin-left: 3px;

			}
			
			&.open:nth-last-child(#{$i}) {
				margin-top: 3px;
				margin-left: 3px;
			}
		}

		@for $i from 21 through 30 {
		    &:nth-child(#{$i}) {
		        margin-top: 5px;
		        margin-left: 5px;
			}

			&.open:nth-last-child(#{$i}) {
				margin-top: 5px;
				margin-left: 5px;
			}
		}

		@for $i from 31 through 40 {
		    &:nth-child(#{$i}) {
		        margin-top: 7px;
		        margin-left: 7px;
		    }

			&.open:nth-last-child(#{$i}) {
				margin-top: 7px;
				margin-left: 7px;
			}
		}

		@for $i from 41 through 54 {
		    &:nth-child(#{$i}) {
		        margin-top: 9px;
		        margin-left: 9px;
		    }

			&.open:nth-last-child(#{$i}) {
				margin-top: 9px;
				margin-left: 9px;
			}
		}
	}
</style>
