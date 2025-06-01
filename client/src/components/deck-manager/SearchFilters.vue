<template>
    <div class="bg-card rounded-lg p-4">
        <h2 class="text-xl font-bold mb-4">Search & Filter Cards</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Name -->
            <div class="space-y-2">
                <Label for="nameFilter">Card Name</Label>
                <Input id="nameFilter" v-model="filters.name" placeholder="Search by name..."
                    class="bg-white text-black" />
            </div>

            <!-- Color -->
            <div class="space-y-2">
                <Label>Color</Label>
                <Select v-model="filters.color">
                    <SelectTrigger class="bg-white text-black">
                        <SelectValue placeholder="Any color" />
                    </SelectTrigger>
                    <SelectContent class="bg-white text-black">
                        <SelectItem value="any-color">Any color</SelectItem>
                        <SelectItem v-for="color in cardColors" :key="color" :value="color">
                            {{ capitalize(color) }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <!-- Type 
                <div class="space-y-2">
                <Label>Type</Label>
                <Select v-model="localFilters.type" @update:modelValue="val => emitFilterChange('type', val)">
                    <SelectTrigger>
                        <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="any-type">Any type</SelectItem>
                        <SelectItem v-for="type in cardTypes" :key="type" :value="type">{{ type }}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            -->


            <!-- Attack
            <div class="space-y-2">
                <Label>Attack: {{ localFilters.minAttack }} - {{ localFilters.maxAttack }}</Label>
                <Slider :min="0" :max="10" :step="1" :value="[localFilters.minAttack, localFilters.maxAttack]"
                    @update:modelValue="val => emitRangeChange('Attack', val || [0])" />
            </div> 
            -->


            <!-- Defense
             <div class="space-y-2">
                <Label>Defense: {{ localFilters.minDefense }} - {{ localFilters.maxDefense }}</Label>
                <Slider :min="0" :max="10" :step="1" :value="[localFilters.minDefense, localFilters.maxDefense]"
                    @update:modelValue="val => emitRangeChange('Defense', val || [0])" />
            </div>
 
            -->

            <!-- Cost 
            <div class="space-y-2">
                <Label>Cost: {{ localFilters.minCost }} - {{ localFilters.maxCost }}</Label>
                <Slider :min="0" :max="10" :step="1" :value="[localFilters.minCost, localFilters.maxCost]"
                    @update:modelValue="val => emitRangeChange('Cost', val || [0])" />
            </div> 
            -->
            <div class="mt-4 flex justify-end">
                <Button variant="outline" @click="$emit('reset')">Reset Filters</Button>
            </div>

        </div>


    </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select, SelectTrigger, SelectContent, SelectItem, SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

import type { Filters } from '@/composables/useDeckBuilder'

const props = defineProps<{
    filters: Filters
    cardColors: string[]
}>()




function emitFilterChange(key: keyof Filters, value: any) {
    return;
    localFilters[key] = value
    emit('filter-change', key, value)
}

function emitRangeChange(stat: 'Attack' | 'Defense' | 'Cost', values: number[]) {
    emitFilterChange(`min${stat}` as keyof Filters, values[0])
    emitFilterChange(`max${stat}` as keyof Filters, values[1])
}

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}
</script>
