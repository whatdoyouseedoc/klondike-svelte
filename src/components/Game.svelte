<script lang="ts">
	import type { CardProps } from "../types";
	import Place from "./Place.svelte";
	import Stock from "./Stock.svelte";
	import { CARDS, CARD_MOVEMENT_DURATION, TEST_STACK_COMPLETE, TEST_STATE_1, TEST_STATE_2, TEST_STATE_3, TEST_STATE_COMPLETE, TEST_STATE_EMPTY } from '../const';
	import { randomizeDeck, canDrop, init, getRank, getCardIndexFromString, getRandomInt, animateMove } from '../utils';
	import Foundation from "./Foundation.svelte";
	import { onMount } from "svelte";

    let secretEndingActive = false;
    let player = 'иван';

    let state: Record<string, CardProps[]> = TEST_STATE_EMPTY;

    onMount(() => {
        resetState();
        // state = TEST_STATE_3;
        // state = TEST_STATE_EMPTY;
        // state = TEST_STATE_COMPLETE;

        const urlParams = new URLSearchParams(window.location.search);
        secretEndingActive = !!urlParams.get('secret-ending');

        if (urlParams.get('player')) {
            player = urlParams.get('player')?.split('').splice(0, 4).join('')!;
        }
    });

    function updateState(toPlaceId: string, fromPlaceId: string, cardIndex: number, delayed = false) {
        let temp: CardProps[];

        if (fromPlaceId === 'talon') {
            temp = state[fromPlaceId].splice(+cardIndex, 1);
        } else {
            temp = state[fromPlaceId].splice(+cardIndex);
        }

		state[toPlaceId].push(...temp);

        if (fromPlaceId.includes('pile') && state[fromPlaceId].length > 0) {
            state[fromPlaceId].at(-1)!.isOpen = true;
        }

		state = state;

        if (delayed) {
            const cardEl = document.getElementById(`foundation--${toPlaceId}`)?.children;
            // debugger;
        }

        setTimeout(() => {
            checkFinish();
        });
	}

    function checkFinish() {
        if (state['foundation-1'].length === 13 && state['foundation-2'].length === 13 && state['foundation-3'].length === 13 && state['foundation-4'].length === 13) {
            finish();        

            if (secretEndingActive) {
                setTimeout(secretEnding, 200 * 54);
            }
        }
    }

    function openCard(placeId: string, cardIndex: number) {
        if (state[placeId][cardIndex].isOpen) {
            return;
        }

        state[placeId][cardIndex].isOpen = true;
        state = state;
    }

    function resetState() {
        const cards = randomizeDeck(CARDS);

        for (let i = 0; i < 7; i++) {
            const pileKey = `pile-${i + 1}`;
            state[pileKey] = cards.splice(0, i + 1);
            state[pileKey].at(-1)!.isOpen = true;
        }

        state.talon = cards;
    }

    async function autoplay() {
        for (const fKey of ['foundation-1', 'foundation-2', 'foundation-3', 'foundation-4']) {
            const foundation = state[fKey];

            if (foundation.length === 0) {
                for (const pileKey of ['talon', 'pile-1', 'pile-2', 'pile-3', 'pile-4', 'pile-5', 'pile-6', 'pile-7']) {
                    const pile = state[pileKey];
                    const card = pileKey === 'talon' ? pile.filter(it => it.isOpen).at(0)! : pile.at(-1)!;
                    const cardIndex = pile.indexOf(card);

                    if (card && pile.length > 0 && getRank(card) === 1) {
                        const el = document.getElementById(`dz--${pileKey}--${cardIndex}--${card.id}`)!;
                        const target = document.getElementById(`foundation--${fKey}`)!;

                        await animateMove(el, target);
                        updateState(fKey, pileKey, cardIndex);

                        return;
                    }
                }
            } else {
                const lastCard = foundation.at(-1)!;

                for (const pileKey of ['talon', 'pile-1', 'pile-2', 'pile-3', 'pile-4', 'pile-5', 'pile-6', 'pile-7']) {
                    const pile = state[pileKey];
                    const card = pileKey === 'talon' ? pile.filter(it => it.isOpen).at(0)! : pile.at(-1)!;
                    const cardIndex = pile.indexOf(card);

                    if (card && pile.length > 0 && card.suit === lastCard.suit && getRank(card) === getRank(lastCard) + 1) {
                        const el = document.getElementById(`dz--${pileKey}--${cardIndex}--${card.id}`)!;
                        const target = document.getElementById(`foundation--${fKey}`)!;

                        await animateMove(el, target);
                        updateState(fKey, pileKey, cardIndex);

                        return;
                    }
                }
            }
        }
    
    }

    function getNextState(prevState: Record<string, CardProps[]>, toPlaceId: string, fromPlaceId: string, cardIndex: number, delayed = false) {
        let temp: CardProps[];
        const state = {...prevState};

        if (fromPlaceId === 'talon') {
            temp = state[fromPlaceId].splice(+cardIndex, 1);
        } else {
            temp = state[fromPlaceId].splice(+cardIndex);
        }

		state[toPlaceId].push(...temp);

        // if (fromPlaceId.includes('pile') && state[fromPlaceId].length > 0) {
        //     state[fromPlaceId].at(-1)!.isOpen = true;
        // }

        return state;

		// state = state;

        // setTimeout(() => {
        //     checkFinish();
        // });
	}

    function openPiles() {
        for (const pKey of ['pile-1', 'pile-2', 'pile-3', 'pile-4', 'pile-5', 'pile-6', 'pile-7'] as const) {
            if (state[pKey].at(-1) && state[pKey].at(-1)!.isOpen === false) {
                state[pKey].at(-1)!.isOpen = true;
            }
        }
    }

    function autoplay2() {
        let isDone = false;
        let nextState: Record<string, CardProps[]> | undefined = {...state};
        let finalState: Record<string, CardProps[]> = {...nextState};
        const animationQueue: {el: HTMLElement, target: HTMLElement}[] = [];

        while (!isDone) {
            nextState = findNextMove(state, animationQueue);

            if (nextState) {
                finalState = nextState;
            }

            if (nextState === undefined) {
                isDone = true;
            }
        }

        animationQueue.forEach(({el, target}, i) => {
            animateMove(el, target);
        });

        openPiles();

        setTimeout(() => {
            state = finalState;

            setTimeout(checkFinish);
        }, CARD_MOVEMENT_DURATION);
    }

    function findNextMove(state: Record<string, CardProps[]>, animationQueue: {el: HTMLElement, target: HTMLElement}[] = []) {
        for (const fKey of ['foundation-1', 'foundation-2', 'foundation-3', 'foundation-4']) {
            const foundation = state[fKey];

            if (foundation.length === 0) {
                for (const pileKey of ['talon', 'pile-1', 'pile-2', 'pile-3', 'pile-4', 'pile-5', 'pile-6', 'pile-7']) {
                    const pile = state[pileKey];
                    const card = pileKey === 'talon' ? pile.filter(it => it.isOpen).at(0)! : pile.at(-1)!;

                    const cardIndex = pile.indexOf(card);

                    if (card && card.isOpen && pile.length > 0 && getRank(card) === 1) {
                        // const el = document.getElementById(`dz--${pileKey}--${cardIndex}--${card.id}`)!;
                        const el = document.querySelector(`[id$=${card.id}`)! as HTMLElement;
                        const target = document.getElementById(`foundation--${fKey}`)!;

                        // await animateMove(el, target);
                        // updateState(fKey, pileKey, cardIndex);
                        // console.log({fKey, pileKey, cardIndex});
                        animationQueue.push({el, target});

                        return getNextState(state, fKey, pileKey, cardIndex);
                    }
                }
            } else {
                const lastCard = foundation.at(-1)!;

                for (const pileKey of ['talon', 'pile-1', 'pile-2', 'pile-3', 'pile-4', 'pile-5', 'pile-6', 'pile-7']) {
                    const pile = state[pileKey];
                    const card = pileKey === 'talon' ? pile.filter(it => it.isOpen).at(0)! : pile.at(-1)!;
                    const cardIndex = pile.indexOf(card);

                    if (card && card.isOpen && pile.length > 0 && card.suit === lastCard.suit && getRank(card) === getRank(lastCard) + 1) {
                        // const el = document.getElementById(`dz--${pileKey}--${cardIndex}--${card.id}`)!;
                        const el = document.querySelector(`[id$=${card.id}`)! as HTMLElement;
                        const target = document.getElementById(`foundation--${fKey}`)!;

                        // console.log({fKey, pileKey, cardIndex});
                        animationQueue.push({el, target});

                        return getNextState(state, fKey, pileKey, cardIndex);
                    }
                }
            }
        }

        return;
    }

    function finish() {
        let j = 0

        for (let i = 12; i >= 0; i--) {
            for (const fKey of ['foundation-1', 'foundation-2', 'foundation-3', 'foundation-4']) {
                const el = document.querySelectorAll(`#foundation--${fKey} > div`)[i] as HTMLElement;
                const cardBackEl = el.querySelector('.card-back') as HTMLElement;
                const cardFaceEl = el.querySelector('.card-face') as HTMLElement;

                setTimeout(() => {
                    const duration = `${getRandomInt(15, 25) / 10}s`
                    const xSign = Math.random() < 0.5 ? '-' : '';
                    const ySign = Math.random() < 0.5 ? '-' : '';
                    const zSign = Math.random() < 0.5 ? '-' : '';

                    el.style.transition = duration;
                    cardBackEl.style.transition = duration;
                    cardFaceEl.style.transition = duration;
                    cardBackEl.style.opacity = '0';
                    cardFaceEl.style.opacity = '0';
                    el.style.transform = `scale(${getRandomInt(4, 6)}) rotateZ(${zSign}${getRandomInt(270, 540)}deg) rotateX(${xSign}${getRandomInt(270, 540)}deg) rotateY(${ySign}${getRandomInt(270, 540)}deg)`;
                    el.style.transformStyle = 'preserve-3d';
                    
                }, 200 * j);

                j++;
            }
        }
    }

    function secretEnding() {
        const places = ['foundation--foundation-1', 'foundation--foundation-2', 'foundation--foundation-3', 'foundation--foundation-4', 'place--pile-1', 'place--pile-2', 'place--pile-3', 'place--pile-4', 'place--pile-5', 'place--pile-6', 'place--pile-7'];
        const message = `${player}ясделал`.split(''); 

        places.forEach((id, index) => {
            const el = document.createElement('div');
            el.style.position = 'absolute';
            el.style.top = '50%';
            el.style.left = '50%';
            el.style.transform = 'translate(-50%, -50%)';
            el.style.fontSize = '4rem';
            el.style.color = '#ddd';
            el.style.textTransform = 'uppercase';
            el.style.opacity = '0';
            el.style.transition = 'opacity .8s ease-in-out';
            el.appendChild(document.createTextNode(message[index]));
            document.getElementById(id)!.appendChild(el);

            setTimeout(() => {
                el.style.opacity = '1';
            }, 200 * index);
        });

        const el = document.createElement('img');
        el.src = '/src/static/pesik.png';
        el.style.maxHeight = '100%';
        el.style.marginTop = '80px';
        el.style.transition = '1s';

        document.getElementById('stock-circle')!.appendChild(el);
        setTimeout(() => {
            el.style.marginTop = '0px';
        }, 200 * 11);
    }
</script>

<!-- <button on:click={secretEnding}>Finish</button> -->
<section class="table">
	<div class="row">
		<Stock {state} {updateState} {openCard} />

        <div class="foundation-list">
            {#each ['foundation-1', 'foundation-2', 'foundation-3', 'foundation-4'] as placeId (placeId)}
                <Foundation {state} {placeId} {updateState} />
            {/each}
        </div>
	</div>
	<div class="row">
		{#each ['pile-1', 'pile-2', 'pile-3', 'pile-4', 'pile-5', 'pile-6', 'pile-7' ] as placeId (placeId)}
			<Place {state} {placeId} {updateState} {openCard} />
		{/each}
	</div>
</section>

<svelte:window on:contextmenu|preventDefault={autoplay2} />

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

        .foundation-list {
            display: flex;
            gap: 40px;
            margin-left: (104px + 40px) * 2;
        }
	}
</style>
