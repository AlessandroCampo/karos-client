<template>
    <div class="bg-card rounded-lg p-4">
        <h2 class="text-xl font-bold mb-4">Your Decks</h2>

        <div v-if="decks.length === 0" class="text-center py-8 text-gray-400">
            <p>You haven't created any decks yet.</p>
            <p class="mt-2">Create your first deck to see it here!</p>
        </div>

        <div v-else class="space-y-6">
            <div v-for="month in months" :key="month" class="space-y-2">
                <h3 class="text-sm font-semibold text-gray-400">{{ month }}</h3>
                <div class="space-y-2">
                    <div v-for="deck in decksByMonth[month]" :key="deck.id"
                        class="bg-background rounded-md p-3 hover:bg-secondary/50 transition-colors">
                        <div class="flex justify-between items-center">
                            <div>
                                <h4 class="font-medium">{{ deck.name }}</h4>
                                <div class="flex text-xs text-gray-400 mt-1 space-x-4">
                                    <span>{{ deck.cards.length }} cards</span>
                                    <span>Updated {{ formatRelativeTime(deck.updatedAt) }}</span>
                                </div>
                            </div>
                            <div class="flex space-x-2">
                                <Button variant="ghost" size="sm" @click="() => onEditDeck(deck)" class="h-8 w-8 p-0">
                                    <Edit size="16" />
                                </Button>
                                <Button variant="ghost" size="sm" @click="() => onDeleteDeck(deck.id)"
                                    class="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-500">
                                    <Trash size="16" />
                                </Button>
                            </div>
                        </div>

                        <div class="flex mt-2 space-x-1">
                            <div v-for="color in Array.from(new Set(deck.cards.map(c => c.color))).sort()" :key="color"
                                class="w-4 h-4 rounded-full" :class="`bg-tcg-${color}`" :title="capitalize(color)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import type { Deck } from '@/utils/cardData'
import { Button } from '@/components/ui/button'
import { Edit, Trash } from 'lucide-vue-next'

const props = defineProps<{
    decks: Deck[]
    onEditDeck: (deck: Deck) => void
    onDeleteDeck: (deckId: string) => void
}>()

const decksByMonth = computed(() => {
    return props.decks.reduce<Record<string, Deck[]>>((acc, deck) => {
        const month = new Date(deck.createdAt).toLocaleString('default', {
            month: 'long',
            year: 'numeric'
        })
        if (!acc[month]) acc[month] = []
        acc[month].push(deck)
        return acc
    }, {})
})

const months = computed(() => {
    return Object.keys(decksByMonth.value).sort((a, b) => {
        const dateA = new Date(decksByMonth.value[a][0].createdAt)
        const dateB = new Date(decksByMonth.value[b][0].createdAt)
        return dateB.getTime() - dateA.getTime()
    })
})

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatRelativeTime(date: Date | string) {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
}
</script>
