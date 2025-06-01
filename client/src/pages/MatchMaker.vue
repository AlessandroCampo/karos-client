<template>
    <div class="component-name bg-black h-screen flex gap-6 items-center justify-center flex-col">
        <QueueButton />
        <Button class="w-[150px]">
            <RouterLink to="/create-deck">Create Deck</RouterLink>
        </Button>


    </div>
</template>

<script setup lang="ts">
import QueueButton from '@/components/misc/QueueButton.vue';
import { BACKEND_URL } from '@/composables/useSocket';
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';

onMounted(() => {
})
</script>

<style scoped>
/* Scoped styles for the component */
</style>