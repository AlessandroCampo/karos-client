export const sleep = (seconds: number): Promise<void> => {
    return new Promise((res) => setTimeout(res, seconds * 1000));
};

// utils/playerId.ts
export const getOrCreatePlayerId = () => {
    const key = 'player-id'
    let playerId = localStorage.getItem(key)
    if (!playerId) {
        playerId = crypto.randomUUID()
        localStorage.setItem(key, playerId)
    }
    return playerId
}
