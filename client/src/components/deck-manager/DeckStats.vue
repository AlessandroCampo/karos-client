<template>
    <div class="bg-card rounded-lg p-4">
        <h2 class="text-xl font-bold mb-4">Deck Statistics</h2>

        <div class="text-sm mb-4">
            <span class="font-semibold">Total Cards:</span> {{ stats.totalCards }}
        </div>

        <div class="text-sm mb-2">
            <span class="font-semibold">Average Cost:</span> {{ stats.averageCost.toFixed(1) }}
        </div>

        <Separator class="my-4" />

        <h3 class="text-md font-semibold mb-2">Color Distribution</h3>
        <div class="space-y-2 mb-4">
            <div v-for="color in colors" :key="color" class="space-y-1">
                <div class="flex justify-between text-xs">
                    <span class="capitalize">{{ color }}</span>
                    <span>{{ stats.colorDistribution[color] || 0 }} cards</span>
                </div>
                <Progress :value="maxColorCount > 0 ? ((stats.colorDistribution[color] || 0) / maxColorCount) * 100 : 0"
                    class="h-2 bg-card" />
            </div>
        </div>

        <Separator class="my-4" />

        <h3 class="text-md font-semibold mb-2">Type Distribution</h3>
        <div class="space-y-2 mb-4">
            <div v-for="type in types" :key="type" class="space-y-1">
                <div class="flex justify-between text-xs">
                    <span>{{ type }}</span>
                    <span>{{ stats.typeDistribution[type] || 0 }} cards</span>
                </div>
                <Progress :value="maxTypeCount > 0 ? ((stats.typeDistribution[type] || 0) / maxTypeCount) * 100 : 0"
                    class="h-2 bg-card" />
            </div>
        </div>

        <Separator class="my-4" />

        <h3 class="text-md font-semibold mb-2">Cost Curve</h3>
        <div class="grid grid-cols-8 gap-1">
            <div v-for="cost in costs" :key="cost" class="flex flex-col items-center">
                <div class="h-24 w-full flex items-end justify-center">
                    <div class="w-8 bg-primary bg-opacity-70 rounded-t" :style="{
                        height: maxCostCount > 0 ? `${((stats.costDistribution[cost] || 0) / maxCostCount) * 100}%` : '0%'
                    }"></div>
                </div>
                <div class="text-xs mt-1">{{ cost }}</div>
                <div class="text-xs text-gray-500">
                    {{ stats.costDistribution[cost] || 0 }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
//import { calculateDeckStats } from '@/helpers/deckUtils';
import type { Card } from '@shared/Card'

interface DeckStatsProps {
    deck: {
        name: string
        cards: Card[]
    }
}

const props = defineProps<DeckStatsProps>()

const stats = calculateDeckStats({
    ...props.deck,
    id: '',
    createdAt: new Date(),
    updatedAt: new Date()
})

const colors = computed(() => Object.keys(stats.colorDistribution).sort())
const types = computed(() => Object.keys(stats.typeDistribution).sort())
const costs = ['0', '1', '2', '3', '4', '5', '6', '7+']

const maxColorCount = Math.max(...Object.values(stats.colorDistribution))
const maxTypeCount = Math.max(...Object.values(stats.typeDistribution))
const maxCostCount = Math.max(...Object.values(stats.costDistribution))
</script>
