import { CARD_MOVEMENT_DURATION, suitLetterMap } from "./const";
import type { CardProps, CardRank, CardSuit, PlaceProps } from "./types";

export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function randomizeDeck(cards: CardProps[]): CardProps[] {
    return cards.sort(() => Math.random() - 0.5);
}

export function getSuitColor(card: CardProps): string {
    return card.suit === 'heart' || card.suit === 'diamond' ? 'red' : 'black';
}

export function getRank(card: CardProps): number {
    switch (card.rank) {
        case 'A': return 1;
        case '2': return 2;
        case '3': return 3;
        case '4': return 4;
        case '5': return 5;
        case '6': return 6;
        case '7': return 7;
        case '8': return 8;
        case '9': return 9;
        case '10': return 10;
        case 'J': return 11;
        case 'Q': return 12;
        case 'K': return 13;
    }
}

export function canDrop(card: CardProps, placeId: string, state: Record<string, CardProps[]>): boolean {
    const place = state[placeId];
    const lastCard = place.at(-1);

    if (placeId.includes('foundation')) {
        if (!lastCard && card.rank === 'A') {
            return true;
        }
    
        if (!lastCard && card.rank !== 'A') {
            return false;
        }

        if (lastCard!.suit === card.suit && getRank(lastCard!) === getRank(card) - 1) {
            return true;
        }
        
        return false;
    }

    if (!lastCard && card.rank === 'K') {
        return true;
    }

    if (!lastCard && card.rank !== 'K') {
        return false;
    }

    if (getSuitColor(lastCard!) !== getSuitColor(card) && getRank(lastCard!) === getRank(card) + 1) {
        return true;
    }
    
    return false;
}

export function init(cards: CardProps[], places: PlaceProps[]): void {
    for (let i = 0; i < places.length; i++) {
        // for test places
        // for (let i = 0; i < 4; i++) {
        for (let j = 0; j < i + 1; j++) {
            const card = cards.pop();

            // if (i === places.length - 1) {
            //     card.isOpen = true;
            // }

            // places[j].cards = [...places[j].cards, card!];
            // console.log(card);
            // places[j].cards.push(card!);
        }
    }

}

export function parseCardById(id: string): CardProps {
    const [suitLetter, rank] = id.split('-');
    const suit = suitLetterMap[suitLetter as keyof typeof suitLetterMap] as CardSuit;

    return { suit, rank: rank as CardRank, id };
}

export function getCardIdFromString(str: string): string | undefined {
    return str.split('--').at(-1);
}

export function getPlaceIdFromString(str: string): string | undefined {
    return str.split('--').at(1);
}

export function getCardIndexFromString(str: string): string | undefined {
    return str.split('--').at(2);
}

export function highlightOn(el: HTMLElement): void {
    const purple = 'rgba(165, 55, 253, 1)';
    const red = 'rgba(242, 38, 19, 1)';

    el.style.boxShadow = `0 0 18px 8px ${red}`;
}

export function highlightOff(el: HTMLElement): void {
    if (el?.style) {
        el.style.boxShadow = 'none';
    }
}

export function calcDestVector(element: HTMLElement, target: HTMLElement): {x: number, y: number} {
    const rect = element.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const paddingTop = parseInt(getComputedStyle(target).getPropertyValue('padding-top'));
    const paddingLeft = parseInt(getComputedStyle(target).getPropertyValue('padding-left'));
    const borderWidth = parseInt(getComputedStyle(target).getPropertyValue('border-width'));

    return {
        x: targetRect.left + paddingLeft + borderWidth - rect.left,
        y: targetRect.top + paddingTop + borderWidth - rect.top
    };
}

export async function animateMove(el: HTMLElement, target: HTMLElement) {
    return new Promise((resolve) => {
        const dest = calcDestVector(el, target);
        el.style.transition = `transform ${CARD_MOVEMENT_DURATION / 1000}s`;
        el.style.transform = `translate(${dest.x}px, ${dest.y}px)`;
    
        setTimeout(() => {
            // updateState(fKey, placeId, cardIndex);
            resolve('done');
        }, CARD_MOVEMENT_DURATION);
    });
}
