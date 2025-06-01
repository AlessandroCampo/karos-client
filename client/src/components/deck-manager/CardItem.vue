<template>
    <div ref="cardRef"
        class="container-style container card-item-cont relative isolate w-full h-full transition-transform will-change-transform [aspect-ratio:2/3] rounded-lg overflow-hidden border border-slate-800"
        draggable="true">
        <div class="grid h-full w-full">
            <div class="grid size-full">
                <div class="size-full bg-slate-950 relative">
                    <img :src="cardTemplate" alt="card artwork" class="object-cover w-full h-full absolute z-0" />

                    <img :src="'/artworks/' + card.templateId + '.jpg'" alt="card artwork"
                        class="object-cover w-full h-full z-10" />

                    <div class="card-name">
                        <h2>{{ card.name }}</h2>
                    </div>

                    <div class="stat cost">{{ card.cost }}</div>
                    <div class="stat atk">{{ card.attack }}</div>
                    <div class="stat def">{{ card.defense }}</div>

                    <div class="text text-black">
                        <div class="mb-2 mx-auto px-2 keyword-container">
                            {{ card.keywords.join(', ') }}
                        </div>
                        <div>
                            {{ card.effectText }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CardParams } from '@shared/interfaces'
import minionTemplate from '@/assets/images/cards/card-template.png'
import spellTemplate from '@/assets/images/cards/spell-template.png'

interface CardItemProps {
    card: CardParams
}

const props = defineProps<CardItemProps>()
const cardRef = ref<HTMLElement | null>(null)

const cardTemplate = computed(() =>
    props.card.type === 'MINION' ? minionTemplate : spellTemplate
)



</script>

<style scoped>
.container-style {
    aspect-ratio: 2 / 3;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid #1e293b;
    width: 140px;
    height: 195px;
}

.card-name {
    position: absolute;
    top: 4px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-weight: bold;
    text-transform: uppercase;
    width: 55px;
    white-space: nowrap;
    overflow-x: hidden;
    text-align: center;
    font-size: 0.5rem;
    z-index: 20;
}

.stat {
    position: absolute;
    color: white;
    font-weight: bold;
    font-size: 0.8rem;
    z-index: 20;
}

.cost {
    top: 5px;
    left: 8px;
}

.atk {
    bottom: 6px;
    left: 6px;
}

.def {
    bottom: 6px;
    right: 6px;
}

.text {
    position: absolute;
    bottom: 20px;
    width: 80%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.6rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    padding-block: 0.5rem;
    border-radius: 0.5rem;
    z-index: 20;
    font-weight: bold;
}

.keyword-container {
    background-color: rgba(255, 255, 255, 0.7);
    font-weight: bold;
}
</style>
