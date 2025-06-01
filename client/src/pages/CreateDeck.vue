<template>
    <div class="min-h-screen bg-background text-foreground" v-if="allCards.length">

        <main class="container max-w-7xl mx-auto px-4">
            <div v-if="deckBuilder && deckBuilder.filters && deckBuilder.cardColors" class="h-[150px]">
                <SearchFilters :filters="deckBuilder.filters" :cardColors="deckBuilder.cardColors" />

            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">


                <div class="lg:col-span-2 space-y-6 h-full">
                    <CardGrid :cards="filteredCards" @@card-added="handleCardAdded" />
                </div>

                <!-- Right column -->
                <div class="space-y-6">
                    <Tabs default-value="builder">
                        <TabsList class="grid grid-cols-3 mb-4">
                            <TabsTrigger value="builder">Builder</TabsTrigger>
                            <!-- 
                              <TabsTrigger value="stats">Stats</TabsTrigger>
                            -->

                            <TabsTrigger value="decks">My Decks</TabsTrigger>
                        </TabsList>

                        <TabsContent value="builder">
                            <DeckBuilder :decklist="currentDeck.decklist" :isEditMode="isEditMode"
                                :cardsTotal="cardsTotal" @@deck-saved="handleSaveDeck" @clear-deck="handleClearDeck"
                                @deck-name-change="setDeckName" @@card-trashed="handleCardTrashed"
                                :deck="currentDeck" />
                        </TabsContent>



                        <!-- 
                              <TabsContent value="stats">
                            <DeckStats :deck="{ name: deckName, cards: currentDeck }" />
                        </TabsContent>
                        <TabsContent value="decks">
                            <DeckList :decks="decks" @edit-deck="handleEditDeck" @delete-deck="handleDeleteDeck" />
                        </TabsContent>
                        -->

                    </Tabs>
                </div>
            </div>
        </main>

        <!-- Card detail dialog 
              <Dialog :open="!!selectedCard" @update:open="() => setSelectedCard(null)">
            <DialogContent v-if="selectedCard">
                <div class="p-4">
                    <DialogHeader>
                        <DialogTitle>{{ selectedCard.name }}</DialogTitle>
                        <DialogDescription>{{ selectedCard.type }} </DialogDescription>
                    </DialogHeader>

                    <div class="mt-4 flex justify-center">
                        <img :src="selectedCard.image_url" :alt="selectedCard.name"
                            class="w-full max-w-xs rounded-md" />
                    </div>

                    <div class="mt-4 text-sm">
                        <p>{{ selectedCard.effectText }}</p>
                    </div>

                    <div class="mt-4 flex justify-between text-sm">
                        <div>Attack: {{ selectedCard.attack }}</div>
                        <div>Defense: {{ selectedCard.defense }}</div>
                        <div>Cost: {{ selectedCard.cost }}</div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        -->

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import CardGrid from '@/components/deck-manager/CardGrid.vue'
import SearchFilters from '@/components/deck-manager/SearchFilters.vue'
import DeckBuilder from '@/components/deck-manager/DeckBuilder.vue';
import { useAxios } from '@/composables/useAxios';
//import DeckList from '@/components/deck-manager/DeckList.vue'
//import DeckStats from '@/components/deck-manager/DeckStats.vue'
import { Card } from '@shared/Card'
import { createDeck } from '@/helpers/deckUtils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from 'vue-sonner'
import { useDeckBuilder } from '@/composables/useDeckBuilder'
import { CardParams, Deck, DecklistCard, } from '@shared/interfaces'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import axios from 'axios'
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
import { BACKEND_URL } from '@/composables/useSocket';
import { gameRules } from '@shared/gameRules';
import { getOrCreatePlayerId } from '@/utils';
import DecklistCardItem from '@/components/deck-manager/DecklistCardItem.vue';

const saveDeckRequest = useAxios();

const allCards = ref<CardParams[]>([])


const emptyDeck: Deck = {
    name: '',
    decklist: [],
    playerId: getOrCreatePlayerId()
}

const deckBuilder = ref<ReturnType<typeof useDeckBuilder> | null>(null)
const decks = ref<Deck[]>([])
const currentDeck = ref<Deck>(emptyDeck);
const isEditMode = ref(false)
const selectedCard = ref<CardParams | null>(null)


onMounted(async () => {

    const cards = await useAxios().request({
        route: '/cards',
    });

    allCards.value = cards;


    deckBuilder.value = useDeckBuilder(allCards);
    const savedDeck = await useAxios().request({
        route: '/decklist',
    });

    console.log(savedDeck);


    if (savedDeck) {
        currentDeck.value.decklist = JSON.parse(savedDeck.cards);
        currentDeck.value.name = savedDeck.name;
    }
    //decks.value = loadDecksFromStorage()
})

const cardsTotal = computed(() => {
    return currentDeck.value.decklist.reduce((acc, el) => {
        return acc += el.quantity;
    }, 0)
})

const filteredCards = computed(() => {
    if (!deckBuilder.value?.filters) return allCards.value;
    return deckBuilder.value.filteredCards;

    const nameFilter = deckBuilder.value.filters.name?.toLowerCase();

    return allCards.value.filter((c: CardParams) => {
        // If nameFilter is empty/null/undefined, don't filter by name
        if (!nameFilter) return true;
        return c.name.toLowerCase().includes(nameFilter);
    });
});

const colorsInDeck = computed(() => {
    const colorSet = new Set<string>();

    currentDeck.value.decklist.forEach(item => {
        colorSet.add(item.card.color);
    });

    return Array.from(colorSet);
});

const handleCardAdded = (card: CardParams) => {

    if (cardsTotal.value >= gameRules.MAX_DECK_SIZE) {
        return toast('Deck is full', {
            description: `You can't add more than 40 cards to your deck`
        })
    }

    if (colorsInDeck.value.length >= 2 && !colorsInDeck.value.includes(card.color)) {
        return toast('Max 2 colors allowed', {
            description: `You cannot add more cards of different colors in your deck`
        })
    }

    const cardInList = currentDeck.value.decklist.find((listCard: DecklistCard) => listCard.card.templateId === card.templateId);


    if (cardInList && cardInList.quantity < gameRules.MAX_COPIES_IN_DECK) {
        return cardInList.quantity++;
    }

    if (cardInList && cardInList.quantity >= gameRules.MAX_COPIES_IN_DECK) {
        return toast('Max quantity reached', {
            description: `You can't add more copies of ${card.name} to your deck`
        })
    }

    return currentDeck.value.decklist.push({
        quantity: 1,
        card
    })
}

const handleCardTrashed = (dlCard: DecklistCard) => {

    const cardInDeck = currentDeck.value.decklist.find((c: DecklistCard) => c.card.templateId == dlCard.card.templateId);

    console.log(cardInDeck);
    if (!cardInDeck) return;

    if (cardInDeck.quantity > 1) {
        return cardInDeck.quantity--;
    }

    return currentDeck.value.decklist = currentDeck.value.decklist.filter((c: DecklistCard) => c.card.templateId !== dlCard.card.templateId);
}



function handleCardClick(card: Card) {
    return;
    if (!currentDeck.value.some((c: Card) => c.templateId === card.templateId)) {
        currentDeck.value.push(card)
    } else {
        toast({
            title: 'Card already in deck',
            description: 'This card is already in your current deck.'
        })
    }
    selectedCard.value = card
}

function setDeckName(name: string) {
    currentDeck.value.name = name
}

function setSelectedCard(card: Card | null) {
    selectedCard.value = card
}

async function handleSaveDeck() {

    if (!currentDeck.value.name) {
        return toast('Give your deck a name before saving it!')
    }

    if (cardsTotal.value < gameRules.MIN_DECK_SIZE) {
        return toast('Not enough cards', {
            description: `You need at least 40 cards to save your deck`
        })
    }

    const data = await saveDeckRequest.request({ route: 'decklist', method: 'post', data: { deck: currentDeck.value } });

    if (data) {
        toast('Deck saved corretly')
        return console.log(data);
    }



    if (isEditMode.value && currentDeckId.value) {
        const updatedDecks = decks.value.map((deck: Deck) =>
            deck.id === currentDeckId.value ? { ...deck, name, cards, updatedAt: new Date() } : deck
        )
        decks.value = updatedDecks
        //saveDecksToStorage(updatedDecks)
    } else {
        const newDeck = createDeck(name, cards)
        decks.value = [...decks.value, newDeck]
        currentDeckId.value = newDeck.id
        isEditMode.value = true
        //saveDecksToStorage(decks.value)
    }
}

function handleClearDeck() {
    currentDeck.value.decklist = []
    currentDeck.value.name = 'New Deck'
    isEditMode.value = false
}

function handleEditDeck(deck: Deck) {
    return;
    currentDeck.value = deck.cards
    deckName.value = deck.name
    isEditMode.value = true
    currentDeckId.value = deck.id
}

function handleDeleteDeck(deckId: string) {
    return;
    decks.value = decks.value.filter((deck: Deck) => deck.id !== deckId)
    //saveDecksToStorage(decks.value)
    if (currentDeckId.value === deckId) {
        handleClearDeck()
    }
    toast({
        title: 'Deck deleted',
        description: 'The deck has been deleted.'
    })
}
</script>

<style scoped></style>
