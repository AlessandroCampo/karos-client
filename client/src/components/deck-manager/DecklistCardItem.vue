<template>
    <div class="flex items-center justify-between pe-2  shadow-sm text-white h-10 wrapper" :class="colorClasses">
        <!-- Card Image Preview -->
        <figure class="w-1/3 h-full flex-shrink-0 overflow-hidden   bg-white/20 mr-2">
            <img :src="`/artworks/${deckCard.card.templateId}.jpg`" alt="card preview"
                class="object-cover w-full h-full" />
        </figure>

        <!-- Card Name & Cost -->
        <div class="flex-1 min-w-0 overflow-hidden">
            <div class="text-sm font-bold truncate">{{ deckCard.card.name }}</div>
            <div class="text-xs text-white/80">Cost: {{ deckCard.card.cost }}</div>
        </div>

        <!-- Quantity -->

        <div class="ml-2 text-xs bg-white text-black px-2 py-1 rounded-full font-semibold">
            x{{ deckCard.quantity }}
        </div>
    </div>
</template>

<script setup lang="ts">

import { DecklistCard } from '@shared/interfaces';
import { computed } from 'vue';
import { Trash } from 'lucide-vue-next'

const props = defineProps<{
    deckCard: DecklistCard
}>()

const emits = defineEmits(['@cardTrashed']);

const colorClasses = computed(() => {
    switch (props.deckCard.card.color) {
        case 'RED':
            return 'bg-red-500'
        case 'BLUE':
        case 'BLACK':
            return 'bg-black'
        case 'BLUE':
            return 'bg-blue-500'
        case 'GREEN':
            return 'bg-green-500'
        case 'YELLOW':
            return 'bg-yellow-500'
        case 'HIDDEN':
        default:
            return 'bg-gray-400'
    }
})
</script>

<style scoped>
.wrapper {
    border: 1px solid white;
    user-select: none;
}



figure img {
    object-fit: cover;
    object-position: center 25%;
}
</style>
