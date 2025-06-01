// composables/useDeckBuilder.ts
import { ref, computed, type Ref } from 'vue'
import type { Card } from '@shared/Card'
import { CardParams } from '@shared/interfaces'

export interface Filters {
    name: string
    minAttack: number
    maxAttack: number
    minDefense: number
    maxDefense: number
    minCost: number
    maxCost: number
    color: string
    type: string
}

export function useDeckBuilder(allCards: Ref<CardParams[]>) {
    const filters = ref<Filters>({
        name: '',
        minAttack: 0,
        maxAttack: 10,
        minDefense: 0,
        maxDefense: 10,
        minCost: 0,
        maxCost: 10,
        color: '',
        type: '',
    })

    const cardTypes = computed(() =>
        [...new Set(allCards.value.map(c => c.type))]
    )

    const cardColors = computed(() =>
        [...new Set(allCards.value.map(c => c.color))]
    )


    const filteredCards = computed(() =>
        allCards.value.filter(card =>
            (!filters.value.name || card.name.toLowerCase().includes(filters.value.name.toLowerCase())) &&
            (card.attack ?? 0) >= filters.value.minAttack &&
            (card.attack ?? 0) <= filters.value.maxAttack &&
            (card.defense ?? 0) >= filters.value.minDefense &&
            (card.defense ?? 0) <= filters.value.maxDefense &&
            (card.cost ?? 0) >= filters.value.minCost &&
            (card.cost ?? 0) <= filters.value.maxCost &&
            (!filters.value.color || filters.value.color === 'any-color' || card.color === filters.value.color) &&
            (!filters.value.type || filters.value.type === 'any-type' || card.type === filters.value.type)
        )
    )

    const handleFilterChange = <K extends keyof Filters>(key: K, value: Filters[K]) => {
        filters.value[key] = value
    }


    const handleResetFilters = () => {
        filters.value = {
            name: '',
            minAttack: 0,
            maxAttack: 10,
            minDefense: 0,
            maxDefense: 10,
            minCost: 0,
            maxCost: 10,
            color: '',
            type: '',
        }
    }

    return {
        filters,
        filteredCards,
        cardTypes,
        cardColors,
        handleFilterChange,
        handleResetFilters
    }
}
