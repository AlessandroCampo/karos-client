<template>
    <div class="component-name">
        <Button class="w-[150px]" @click="joinQueue">{{ isWaiting ? 'Waiting for opponent...' : 'Join queue'
        }}</Button>
    </div>
</template>

<script setup lang="ts">
import { useSocket } from '@/composables/useSocket';
import { useMultiplayer } from '@/composables/useMultiplayer';
import { getOrCreatePlayerId } from '@/utils';

const { isWaiting } = useMultiplayer();


const { emit, on } = useSocket();

const joinQueue = () => {
    emit('joinQueue', { clientId: getOrCreatePlayerId() });
}
</script>

<style scoped>
/* Scoped styles for the component */
</style>