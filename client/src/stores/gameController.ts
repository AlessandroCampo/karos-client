// stores/gameStore.ts
import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'
import { Player } from '@/classes/Player'
import { Card } from '@/classes/Card'
import { GameState, PlayerState, EventType } from 'shared/interfaces'
import { useMultiplayer } from '@/composables/useMultiplayer'
import { useSocket } from '@/composables/useSocket';
import { useRouter } from 'vue-router';
import { cardCanBePlayed } from '@shared/validations'
const router = useRouter();


export const useGameController = defineStore('game', () => {
    const { myPlayerId, opponentPlayerId, room, emitEvent } = useMultiplayer();
    const myPlayer = ref<Player | undefined>(undefined)
    const opponentPlayer = ref<Player | undefined>(undefined)
    const currentTurn = ref(0)

    const minions = ref<Card[]>([]);
    const gameState = ref<GameState>({
        players: {},
        turnPlayerId: '',
        turnNumber: 1,
        startingPlayerId: '',
        globalTurn: 1
    });
    const players = [myPlayer, opponentPlayer];

    const activePlayer = computed(() => {
        if (!gameState.value) return undefined;
        return [myPlayer.value, opponentPlayer.value].find(
            p => p?.id === gameState.value?.turnPlayerId
        ) as Player | undefined;
    });


    const isMyTurn = computed(() => gameState.value?.turnPlayerId == myPlayerId.value);
    const myPlayerState = ref<PlayerState | undefined>(undefined);
    const oppponentPlayerState = ref<PlayerState | undefined>(undefined);


    function startGame(state: GameState) {
        currentTurn.value = state.turnNumber;
        gameState.value = state;

        if (!myPlayerId.value || !opponentPlayerId.value) {
            throw new Error("Can't start the game")
        }

        myPlayerState.value = state.players[myPlayerId.value];
        oppponentPlayerState.value = state.players[opponentPlayerId.value];

        myPlayer.value = Player.fromState(myPlayerState.value, true, myPlayerId.value);
        opponentPlayer.value = Player.fromState(oppponentPlayerState.value, false, opponentPlayerId.value);

        myPlayer.value.opponent = opponentPlayer.value;
        opponentPlayer.value.opponent = myPlayer.value;



    }

    const playCard = (cardId: string) => {


        if (!gameState.value || !myPlayerId.value || !myPlayerState.value) {
            return
        };

        const validated = cardCanBePlayed(myPlayerState.value, cardId);
        console.log(validated);
        if (!validated.success) {
            return validated;
        }

        emitEvent('play-card', { cardId });
    };

    const directAttack = (cardId: string) => {
        emitEvent('direct-attack', { cardId });
    };

    const minionAttack = (attackingMinionId: string, defendingMinionId: string) => {
        emitEvent('minion-attack', { attackingMinionId, defendingMinionId });
    }

    function passTurn() {
        emitEvent('end-turn');
    }

    function changePosition(cardId: string) {
        emitEvent(
            'change-position', { cardId });
    }
    function manaBoost(cardId: string) {
        emitEvent(
            'mana-boost', { cardId });
    }



    const setGameState = (state: GameState) => {
        if (!gameState.value) {
            return;
        }
        gameState.value.turnNumber = state.turnNumber;
        gameState.value.turnPlayerId = state.turnPlayerId;
        gameState.value.globalTurn = state.globalTurn;
        console.log(
            'turnPlayerId:', gameState.value.turnPlayerId,
            'myPlayerId:', myPlayerId.value,
            'typeof turnPlayerId:', typeof gameState.value.turnPlayerId,
            'typeof myPlayerId:', typeof myPlayerId.value
        );


        if (!myPlayerId.value || !opponentPlayerId.value) return;

        const myState = state.players[myPlayerId.value];
        const oppState = state.players[opponentPlayerId.value];

        myPlayerState.value = myState;
        oppponentPlayerState.value = oppState;

        if (myPlayer.value) {
            myPlayer.value.updateFromState(myState);
        }

        if (opponentPlayer.value) {
            opponentPlayer.value.updateFromState(oppState);
        }
    };



    return {
        myPlayer,
        opponentPlayer,
        currentTurn,
        minions,
        activePlayer,
        isMyTurn,
        startGame,
        passTurn,
        players,
        playCard,
        setGameState,
        directAttack,
        minionAttack,
        changePosition,
        manaBoost

    }
})
