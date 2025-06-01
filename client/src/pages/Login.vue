<template>
    <div class="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div class="w-full max-w-sm space-y-6">
            <h1 class="text-2xl font-semibold text-center">Login</h1>
            <form @submit.prevent="handleLogin" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium">Player Name</label>
                    <input type="text" v-model.number="playerName" required
                        class="w-full p-2 rounded border border-border bg-background" />
                    <p class="text-red-500 text-sm text-start" v-if="errors.length">{{ errors[0] }}</p>
                </div>
                <button type="submit" class="w-full py-2 px-4 bg-primary text-white rounded hover:bg-primary/90">
                    Login
                </button>

            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAxios } from '@/composables/useAxios'
import { myRouter } from '@/router';

const playerName = ref<string>('');
const error = ref('')


const { request, errors, loading } = useAxios();

const handleLogin = async () => {
    try {

        const response = await request({
            route: '/auth',
            method: "post",
            data: { playerName: playerName.value },

        });
        const token = response.token
        localStorage.setItem('jwt', token)
        myRouter.push('/')
    } catch (err) {
        error.value = 'Login failed. Check your player ID.'
    }
}
</script>
