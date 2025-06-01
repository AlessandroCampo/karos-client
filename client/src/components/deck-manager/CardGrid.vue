<template>
    <div class="card-grid-scroll">
        <CardItem :card="card" v-for="card in cards" :key="card.templateId" @click="addToDeck(card)" />

        <div v-if="cards.length === 0" class="col-span-full text-center py-12 text-gray-400">
            No cards match your current filters.
        </div>
    </div>
</template>

<script setup lang="ts">

import CardItem from './CardItem.vue'
import { CardParams } from '@shared/interfaces';

const props = defineProps<{ cards: CardParams[] }>();

const emits = defineEmits(['@cardAdded']);

const addToDeck = (card: CardParams) => {
    emits('@cardAdded', card);
}


</script>

<style scoped>
.card-grid-scroll {
    height: calc(100dvh - 150px);
    overflow-y: auto;
    overflow-x: hidden;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.75rem;
    padding: 0.5rem;
}




.floating-drag {
    pointer-events: none;
    user-select: none;
}
</style>
