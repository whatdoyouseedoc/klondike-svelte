<script lang="ts">
	import { dropZonehighlight } from "../const";
	import { selectedCard } from "../stores";
	import type { PlaceProps, CardProps } from "../types";
	import { canDrop, getPlaceIdFromString, highlightOff, highlightOn } from "../utils";
	import Card from "./Card.svelte";

    export let state: Record<string, CardProps[]>;
    export let placeId: string;
    export let updateState: any;
    export let openCard: any;

    $: place = state[placeId];

    let selectedCardValue: CardProps;

    selectedCard.subscribe((value: CardProps) => {
        selectedCardValue = value;
    });

    function isThereNextCard() {
        return place.length;
    }

    function onDragOver(e: DragEvent) {
        if (isThereNextCard() || !canDrop(selectedCardValue, placeId, state)) {
            return;
        }

        highlightOn(e.target as HTMLElement);
    }

    function onDragLeave(e: DragEvent) {
        highlightOff(e.target as HTMLElement);
    }

    function onDrop(e: DragEvent) {
        if (isThereNextCard() || !canDrop(selectedCardValue, placeId, state)) {
            return;
        }

        // (e.target as HTMLElement).style.border = '';
        highlightOff(e.target as HTMLElement);

        const json = e.dataTransfer?.getData("text/plain");
		const data = JSON.parse(json!);
        
        const dz = (e.target as HTMLElement).closest('.dropzone');        
        const id = getPlaceIdFromString(dz?.id!);

        updateState(id, data.placeId, data.cardIndex);
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    id={`place--${placeId}`}
    class="dropzone"
    draggable="false"
    on:dragover|preventDefault={onDragOver}
    on:dragleave={onDragLeave}
    on:drop={onDrop}
>
    {#if place.length}
        <Card
            {updateState}
            {openCard}
            {state}
            {placeId}
            cardIndex={0}
        />
    {/if}
</div>

<style lang="scss">
    .dropzone {
        min-width: 104px;
        height: 154px;
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 1px;
        box-sizing: border-box;
        position: relative;
    }
</style>