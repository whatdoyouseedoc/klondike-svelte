export type CardSuit = 'heart' | 'diamond' | 'club' | 'spade';

export type CardRank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export type CardProps = {
    id: string;
    suit: CardSuit;
    rank: CardRank;
    isOpen?: boolean;
}

export type PlaceProps = {
    id: string;
    cards: CardProps[] | [];
}
