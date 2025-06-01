<template>
  <div v-if="socketInit">
    <Sonner />
    <router-view />
  </div>
</template>


<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import { BACKEND_URL, initSocket } from './composables/useSocket';
import Sonner from './components/ui/sonner/Sonner.vue';
import 'vue-sonner/style.css'
import { getOrCreatePlayerId } from './utils';
const socketInit = ref(false);

onBeforeMount(() => {


  initSocket();
  socketInit.value = true;

})

onMounted(() => {
})

</script>