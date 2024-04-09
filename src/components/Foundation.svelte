<script lang="ts">
	import { dropZonehighlight } from "../const";
	import { selectedCard } from "../stores";
	import type { CardProps } from "../types";
	import { canDrop, getPlaceIdFromString, highlightOff, highlightOn } from "../utils";
	import Card from "./Card.svelte";

    export let state: Record<string, CardProps[]>;
    export let placeId: string;
    export let updateState: any;

    let selectedCardValue: CardProps;

    selectedCard.subscribe((value: CardProps) => {
        selectedCardValue = value;
    });

    function onDragOver(e: DragEvent) {
        if (!canDrop(selectedCardValue, placeId, state)) {
            return;
        }

        highlightOn(e.target as HTMLElement);
    }

    function onDragLeave(e: DragEvent) {
        highlightOff(e.target as HTMLElement);
    }

    function onDrop(e: DragEvent) {
        if (!canDrop(selectedCardValue, placeId, state)) {
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
    id={`foundation--${placeId}`}
    class="dropzone"
    draggable="false"
    on:dragover|preventDefault={onDragOver}
    on:dragleave={onDragLeave}
    on:drop={onDrop}
>
    {#each state[placeId] as card, index}
        <Card
            {state}
            placeId={placeId}
            cardIndex={index}
            updateState={updateState}
            openCard={() => {}}
        />
    {/each}
</div>

<style lang="scss">
    .dropzone {
        width: 100px;
        height: 150px;
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 1px;
        position: relative;

        // &:before {
        //     content: "A";
        //     color: #ddd;
        //     font-size: 3rem;
        //     position: absolute;
        //     top: 50%;
        //     left: 50%;
        //     transform: translate(-50%, -50%);

        // }

		// @for $i from 5 through 8 {
		//     & > div:nth-child(#{$i}) {
		//         margin-top: 2px !important;
		//         margin-left: 2px !important;				
		//     }
		// }

		// @for $i from 9 through 13 {
		//     & > div:nth-child(#{$i}) {
		//         margin-top: 4px !important;
		//         margin-left: 4px !important;				
		//     }
		// }
    }
</style>