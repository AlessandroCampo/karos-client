import { Card } from "@shared/Card";
import { CardParams, DecklistCard, Deck } from "@shared/interfaces";







/*LINK - 
    export const calculateDeckStats = (deck: Deck) => {
    const totalCards = deck.cards.length;
    const colorDistribution = deck.cards.reduce((acc, card) => {
        acc[card.color] = (acc[card.color] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const typeDistribution = deck.cards.reduce((acc, card) => {
        acc[card.type] = (acc[card.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const costDistribution = deck.cards.reduce((acc, card) => {
        const costBracket = card.cost >= 7 ? '7+' : card.cost.toString();
        acc[costBracket] = (acc[costBracket] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const averageCost = totalCards > 0
        ? deck.cards.reduce((sum, card) => sum + card.cost, 0) / totalCards
        : 0;

    return {
        totalCards,
        colorDistribution,
        typeDistribution,
        costDistribution,
        averageCost
    };
};

*/


export const createDeck = (name: string, decklist: DecklistCard[] = []): Deck => {
    const now = new Date();
    return {
        id: `deck-${Date.now()}`,
        name,
        decklist,
        createdAt: now,
        updatedAt: now
    };
};