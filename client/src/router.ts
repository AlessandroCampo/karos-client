import { createWebHistory, createRouter } from 'vue-router';
import CreateCard from './pages/CreateCard.vue';
import MatchMaker from './pages/MatchMaker.vue';
import EndGame from './pages/EndGame.vue';
import GameContainer from './GameContainer.vue';
import CreateDeck from './pages/CreateDeck.vue';
import Login from './pages/Login.vue';

const routes = [
    { path: '/', component: MatchMaker, meta: { requiresAuth: true } },
    { path: '/game', component: GameContainer, name: 'game', meta: { requiresAuth: true } },
    { path: '/game-over/:outcome', component: EndGame, name: 'game-over', props: true, meta: { requiresAuth: true } },
    { path: '/create-card', component: CreateCard, meta: { requiresAuth: true } },
    { path: '/create-deck', component: CreateDeck, meta: { requiresAuth: true } },
    { path: '/login', component: Login },
];

export const myRouter = createRouter({
    history: createWebHistory(),
    routes,
});
