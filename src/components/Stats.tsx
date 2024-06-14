import React, { useEffect } from 'react';

import { Card, CardContent, Grid, Typography } from '@mui/material';
import { Game } from '../types/Game';
import { getAllGames } from '../utils/api';
import { BarChart } from '@mui/x-charts/BarChart';

const Stats: React.FC = () => {

    const [games, setGames] = React.useState<Game[]>([]);
    const [gameIds, setGameIds] = React.useState<string[]>([]);

    useEffect(() => {
        if (games.length === 0) {
            getAllGames().then((games) => {
                setGameIds(Array.from(new Set(games.map((game: Game) => game.gameId as string))));
                setGames(games);
            });
        }
    }
        , [games.length]);

    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time - hours * 3600) / 60);
        const seconds = (time - hours * 3600 - minutes * 60).toFixed(0);
        return `${hours}h${minutes}m${seconds}s`;
    }

    const getWins = (timed:boolean) => {
        const res = { max: 0, malie: 0, draw: 0};
        if (timed) {
            gameIds.forEach((id: string) => {
                const max = games.find((game: Game) => game.gameId === id && game.player === 'Max');
                const malie = games.find((game: Game) => game.gameId === id && game.player === 'Malie');
                if (max && malie) {
                    if(max.gameScore > malie.gameScore) {
                        res.max++;
                    } else if (max.gameScore < malie.gameScore) {
                        res.malie++;
                    } else if (max.gameScore === malie.gameScore) {
                        if (max.gameTime < malie.gameTime) {
                            res.max++;
                        } else if (max.gameTime > malie.gameTime) {
                            res.malie++;
                        } else {
                            res.draw++;
                        }
                    }
                }
            });
        } else {
            gameIds.forEach((id: string) => {
                const max = games.find((game: Game) => game.gameId === id && game.player === 'Max');
                const malie = games.find((game: Game) => game.gameId === id && game.player === 'Malie');
                if (max && malie) {
                    if(max.gameScore > malie.gameScore) {
                        res.max++;
                    } else if (max.gameScore < malie.gameScore) {
                        res.malie++;
                    } else if (max.gameScore === malie.gameScore) {
                        res.draw++;
                    }
                }
            });
        }
        return res;
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Card>
                    <CardContent sx={{ flexDirection: 'column' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Typography variant="body1">Total games: {gameIds.length}</Typography>
                                <Typography variant="body1">Total game played by both player: {gameIds.filter((id: string) => games.find((game: Game) => game.gameId === id && game.player === 'Max') && games.find((game: Game) => game.gameId === id && game.player === 'Malie')).length}</Typography>
                                <Typography variant="body1">Total game played by Max: {gameIds.filter((id: string) => games.find((game: Game) => game.gameId === id && game.player === 'Max')).length}</Typography>
                                <Typography variant="body1">Total game played by Malie: {gameIds.filter((id: string) => games.find((game: Game) => game.gameId === id && game.player === 'Malie')).length}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="body1">Total of time registered: {formatTime(games.reduce((a, c) => a + c.gameTime, 0))}</Typography>
                                <Typography variant="body1" sx={{ marginLeft: '15px' }}>Mean per game: {formatTime((games.filter((game) => game.gameTime !== 0).reduce((a, c) => a + c.gameTime, 0) / games.filter((game) => game.gameTime !== 0).length))}</Typography>
                                <Typography variant="body1" sx={{ marginLeft: '15px' }}>Max: {formatTime(games.filter((game) => game.player === 'Max').reduce((a, c) => a + c.gameTime, 0))}</Typography>
                                <Typography variant="body1" sx={{ marginLeft: '15px' }}>Malie: {formatTime(games.filter((game) => game.player === 'Malie').reduce((a, c) => a + c.gameTime, 0))}</Typography>

                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="body1">Total of letter played: {games?.reduce((a, c) => a + c.numberOfBlues + c.numberOfReds + c.numberOfYellows, 0) || 0}</Typography>
                                <Typography variant="body1" sx={{ marginLeft: '15px' }}>With 🟦: {games?.reduce((a, c) => a + c.numberOfBlues, 0) || 0}</Typography>
                                <Typography variant="body1" sx={{ marginLeft: '15px' }}>With 🟡: {games?.reduce((a, c) => a + c.numberOfYellows, 0) || 0}</Typography>
                                <Typography variant="body1" sx={{ marginLeft: '15px' }}>With 🟥: {games?.reduce((a, c) => a + c.numberOfReds, 0) || 0}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={4}>
                <Card sx={{ minWidth: '100%' }}>
                    <CardContent sx={{ height: '40vh' }}>
                        <Typography variant="h6">Scores</Typography>
                        <BarChart
                            series={[{ data: [games.filter(game => game.player === 'Max' && game.gameScore === '1').length, games.filter(game => game.player === 'Max' && game.gameScore === '2').length, games.filter(game => game.player === 'Max' && game.gameScore === '3').length, games.filter(game => game.player === 'Max' && game.gameScore === '4').length, games.filter(game => game.player === 'Max' && game.gameScore === '5').length, games.filter(game => game.player === 'Max' && game.gameScore === '6').length, games.filter(game => game.player === 'Max' && game.gameScore === '-').length], type: 'bar', label: 'Max' },
                            { data: [games.filter(game => game.player === 'Malie' && game.gameScore === '1').length, games.filter(game => game.player === 'Malie' && game.gameScore === '2').length, games.filter(game => game.player === 'Malie' && game.gameScore === '3').length, games.filter(game => game.player === 'Malie' && game.gameScore === '4').length, games.filter(game => game.player === 'Malie' && game.gameScore === '5').length, games.filter(game => game.player === 'Malie' && game.gameScore === '6').length, games.filter(game => game.player === 'Malie' && game.gameScore === '-').length], type: 'bar', label: 'Malie' }]}
                            yAxis={[{ scaleType: 'band', data: [1, 2, 3, 4, 5, 6, '-'] }]}
                            layout='horizontal'
                            bottomAxis={null}
                            barLabel="value"

                        >
                        </BarChart>

                    </CardContent>
                </Card>
                
            </Grid>
            <Grid item xs={12}>
                    <Card sx={{ minWidth: '100%' }}>
                        <CardContent sx={{ height: '40vh' }}>
                            <Typography variant="h6">Wins</Typography>
                            <Typography variant="body1">Based on moves only</Typography>
                            <Typography variant="body1">Max: {getWins(false).max}</Typography>
                            <Typography variant="body1">Malie: {getWins(false).malie}</Typography>
                            <Typography variant="body1">Draw: {getWins(false).draw}</Typography>
                            <Typography variant="body1">Based on time and moves</Typography>
                            <Typography variant="body1">Max: {getWins(true).max}</Typography>
                            <Typography variant="body1">Malie: {getWins(true).malie}</Typography>
                            <Typography variant="body1">Draw: {getWins(true).draw}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
        </Grid>
    );
};

export default Stats;