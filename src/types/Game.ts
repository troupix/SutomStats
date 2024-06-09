export interface Game {
    gameFullResult: string;
    gameId: string;
    gameScore: string;
    gameTime: number;
    numberOfReds?: number;
    numberOfYellows?: number;
    numberOfBlues?: number;
    player?: string;
}