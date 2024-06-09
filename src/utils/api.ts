import axios from 'axios';
import { Game } from '../types/Game';

const api = axios.create({
    baseURL: 'https://maliemaxtitus.fr/api/sutom/',
});

export const registerGame = async (game: Game) => {
    try {
        const response = await api.post('save', game);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getAllGames = async () => {
    try {
        const response = await api.get('');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}