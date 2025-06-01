<template>
    <div class="bg-card rounded-lg p-4">
        <div class="flex flex-col space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-bold">Your Deck</h2>
                <div class="flex space-x-2">
                    <Button variant="destructive" size="sm" @click="onClearDeck" :disabled="decklist.length === 0"
                        class="flex items-center">
                        <Trash class="mr-1" :size="16" /> Clear
                    </Button>
                </div>
            </div>

            <div class="flex items-center space-x-2">
                <Input v-model="deck.name" placeholder="Enter deck name..." />
                <Button @click="handleSaveDeck">
                    <div class="flex items-center gap-2">
                        <Save :size="16" /> Save
                    </div>

                </Button>
            </div>
            <div class="ps-2">
                <div class="text-sm text-gray-400">{{ cardsTotal }} cards in deck</div>
            </div>
            <div class="deck-area border">
                <div v-if="decklist.length > 0" class="space-y-4">


                    <div class="decklist">
                        <div v-for="listItem in sortedDecklist" :key="listItem.card.templateId" class="relative group">
                            <DecklistCardItem :deckCard="listItem" />

                            <button
                                class="absolute top-0 right-0 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash :size="12" class="text-white" @click="emits('@cardTrashed', listItem)" />
                            </button>


                        </div>
                    </div>
                </div>
                <div v-else class="flex flex-col items-center justify-center h-full py-12 text-gray-400">
                    <Plus class="mb-2 animate-pulse" :size="48" />
                    <p>Click on the card to add it to your deck</p>
                </div>
            </div>



        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { Card } from '@shared/Card'
import CardItem from './CardItem.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, Trash, Plus } from 'lucide-vue-next'
import { CardParams, Deck, DecklistCard } from '@shared/interfaces'
import DecklistCardItem from './DecklistCardItem.vue'


const props = defineProps<{
    decklist: DecklistCard[]
    onClearDeck: () => void
    deck: Deck,
    isEditMode: boolean,
    cardsTotal: number
}>();

const emits = defineEmits(['@deckSaved', '@cardTrashed']);


const colorOrder = ['RED', 'BLACK', 'BLUE', 'GREEN', 'YELLOW', 'HIDDEN'];

const sortedDecklist = computed(() => {
    return [...props.decklist].sort((a, b) => {
        const colorA = colorOrder.indexOf(a.card.color);
        const colorB = colorOrder.indexOf(b.card.color);

        if (colorA !== colorB) {
            return colorB - colorA;
        }

        return a.card.name.localeCompare(b.card.name);
    });
});






const isDraggingOver = ref(false)

const cardsByColor = computed(() => {
    return [];
    return props.cards.reduce<Record<string, Card[]>>((acc, card) => {
        if (!acc[card.color]) acc[card.color] = []
        acc[card.color].push(card)
        return acc
    }, {})
})

const sortedColors = computed(() => Object.keys(cardsByColor.value).sort())



const handleSaveDeck = () => emits('@deckSaved');

function handleRemoveCard(cardToRemove: CardParams) {
    return;
    const updatedCards = props.cards.filter(card => card.id !== cardToRemove.id)
    props.onSaveDeck(deckNameLocal.value, updatedCards)
}


</script>


<style scoped>
.deck-area {
    min-height: 200px;
    max-height: calc(40px * 10);
    overflow-y: auto;
}
</style>