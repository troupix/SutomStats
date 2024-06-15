import React, { useEffect } from 'react';
import { formatTime } from '../utils/utils';
import { Card, CardContent, Grid, Switch, Typography } from '@mui/material';
import { Game } from '../types/Game';
import { getAllGames } from '../utils/api';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Padding } from '@mui/icons-material';
import { LineChart } from '@mui/x-charts/LineChart';

const Stats: React.FC = () => {

    const [games, setGames] = React.useState<Game[]>([]);
    const [gameIds, setGameIds] = React.useState<string[]>([]);
    const [timed, setTimed] = React.useState<boolean>(true);
    const gamePlayedByBoth = gameIds.filter((id: string) => games.find((game: Game) => game.gameId === id && game.player === 'Max') && games.find((game: Game) => game.gameId === id && game.player === 'Malie'));
    console.log(gamePlayedByBoth.sort((a,b) => parseInt(a.slice(1)) - parseInt(b.slice(1))));
    console.log(gamePlayedByBoth.map((id) => parseInt(games.find((game) => game.gameId === id && game.player === 'Max')?.gameScore || '0')));
    useEffect(() => {
        if (games.length === 0) {
            getAllGames().then((games) => {
                setGameIds(Array.from(new Set(games.map((game: Game) => game.gameId as string))));
                setGames(games);
            });
        }
    }
        , [games.length]);

    const getWins = (timed: boolean) => {
        const res = { max: 0, malie: 0, draw: 0 };
        if (timed) {
            gameIds.forEach((id: string) => {
                const max = games.find((game: Game) => game.gameId === id && game.player === 'Max');
                const malie = games.find((game: Game) => game.gameId === id && game.player === 'Malie');
                if (max && malie) {
                    if (max.gameScore > malie.gameScore) {
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
                    if (max.gameScore > malie.gameScore) {
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
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent sx={{ flexDirection: 'column' }}>
                                <Typography variant="body1">Total games: {gameIds.length}</Typography>
                                <Typography variant="body1" sx={{ marginLeft: '15px' }}>Total game played by both player: {gameIds.filter((id: string) => games.find((game: Game) => game.gameId === id && game.player === 'Max') && games.find((game: Game) => game.gameId === id && game.player === 'Malie')).length}</Typography>
                                <Typography variant="body1" sx={{ marginLeft: '15px' }}>Total game played by Max: {gameIds.filter((id: string) => games.find((game: Game) => game.gameId === id && game.player === 'Max')).length}</Typography>
                                <Typography variant="body1" sx={{ marginLeft: '15px' }}>Total game played by Malie: {gameIds.filter((id: string) => games.find((game: Game) => game.gameId === id && game.player === 'Malie')).length}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent sx={{ flexDirection: 'column' }}>
                                <Typography variant="body1">Total of time registered: {formatTime(games.reduce((a, c) => a + c.gameTime, 0))}</Typography>
                                <Typography variant="body1" sx={{ marginLeft: '15px' }}>Mean per game: {formatTime((games.filter((game) => game.gameTime !== 0).reduce((a, c) => a + c.gameTime, 0) / games.filter((game) => game.gameTime !== 0).length))}</Typography>
                                <Typography variant="body1" sx={{ marginLeft: '15px' }}>Max: {formatTime(games.filter((game) => game.player === 'Max').reduce((a, c) => a + c.gameTime, 0))}</Typography>
                                <Typography variant="body1" sx={{ marginLeft: '15px' }}>Malie: {formatTime(games.filter((game) => game.player === 'Malie').reduce((a, c) => a + c.gameTime, 0))}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent sx={{ flexDirection: 'column' }}>
                                <Typography variant="body1">Total of letter played: {games?.reduce((a, c) => a + c.numberOfBlues + c.numberOfReds + c.numberOfYellows, 0) || 0}</Typography>
                                <Typography variant="body1" sx={{ marginLeft: '15px' }}>With 🟦: {games?.reduce((a, c) => a + c.numberOfBlues, 0) || 0}</Typography>
                                <Typography variant="body1" sx={{ marginLeft: '15px' }}>With 🟡: {games?.reduce((a, c) => a + c.numberOfYellows, 0) || 0}</Typography>
                                <Typography variant="body1" sx={{ marginLeft: '15px' }}>With 🟥: {games?.reduce((a, c) => a + c.numberOfReds, 0) || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>


            </Grid>
            <Grid item xs={12} md={4}>
                <Card sx={{ minWidth: '100%' }}>
                    <CardContent sx={{ height: '40vh' }}>
                        <Typography variant="h6" sx={{ marginLeft: "15px" }}>Scores</Typography>
                        <BarChart
                            colors={['#21b2ef', '#f94c4a']}
                            series={[{ data: [games.filter(game => game.player === 'Max' && game.gameScore === '1').length, games.filter(game => game.player === 'Max' && game.gameScore === '2').length, games.filter(game => game.player === 'Max' && game.gameScore === '3').length, games.filter(game => game.player === 'Max' && game.gameScore === '4').length, games.filter(game => game.player === 'Max' && game.gameScore === '5').length, games.filter(game => game.player === 'Max' && game.gameScore === '6').length, games.filter(game => game.player === 'Max' && game.gameScore === '-').length], type: 'bar', label: 'Max' },
                            { data: [games.filter(game => game.player === 'Malie' && game.gameScore === '1').length, games.filter(game => game.player === 'Malie' && game.gameScore === '2').length, games.filter(game => game.player === 'Malie' && game.gameScore === '3').length, games.filter(game => game.player === 'Malie' && game.gameScore === '4').length, games.filter(game => game.player === 'Malie' && game.gameScore === '5').length, games.filter(game => game.player === 'Malie' && game.gameScore === '6').length, games.filter(game => game.player === 'Malie' && game.gameScore === '-').length], type: 'bar', label: 'Malie' }]}
                            yAxis={[{ scaleType: 'band', data: ["1", "2", "3", "4", "5", "6", '-'] }]}
                            margin={{ right: -40, left: 20, top: 0, bottom: 60 }}
                            layout='horizontal'
                            bottomAxis={null}
                            barLabel={"value"}
                            slotProps={{
                                barLabel: { style: { fill: 'black', fontSize: '0.70em' } },
                                legend: { direction: 'row', position: { vertical: 'bottom', horizontal: 'left' }, padding: { bottom: 30, left: 70 }, itemMarkHeight: 15, itemMarkWidth: 15, labelStyle: { fill: 'black', fontSize: '0.80em' } },
                            }}
                        >
                        </BarChart>

                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card sx={{ minWidth: '100%' }}>
                    <CardContent sx={{ height: '40vh' }}>
                        <Typography variant="h6">Wins</Typography>
                        <Typography sx={{ marginLeft: '15px' }}>
                            timed<Switch
                                value={timed}
                                onChange={() => setTimed(!timed)}
                                defaultChecked
                            />
                        </Typography>
                        <PieChart
                            colors={['#21b2ef', '#fcda58', '#f94c4a']}
                            height={250}
                            series={[{
                                data: [
                                    { id: 'max', value: getWins(timed).max, label: 'Max' },
                                    { id: 'draw', value: getWins(timed).draw, label: 'Draw' },
                                    { id: 'malie', value: getWins(timed).malie, label: 'Malie' },
                                ],
                                arcLabel: 'value',
                                innerRadius: 50,
                                outerRadius: 80,

                                startAngle: -90,
                                endAngle: 90,
                                cx: 140,
                            }

                            ]}
                            slotProps={{
                                legend: { direction: 'row', position: { vertical: 'bottom', horizontal: 'left' }, padding: { bottom: 60, left: 55, right: -10 }, itemMarkHeight: 15, itemMarkWidth: 15, labelStyle: { fill: 'black', fontSize: '0.80em' } },
                                pieArcLabel: { style: { fill: 'black', fontSize: '0.80em' } },


                            }}

                        />

                    </CardContent>
                </Card>
            </Grid>
            {/* <Grid item xs={12} md={4}>
                <Card sx={{ minWidth: '100%' }}>
                    <CardContent sx={{ height: '40vh' }}>
                        <LineChart
                        xAxis={
                            [
                                {data:gamePlayedByBoth.map((id) => id.slice(1))
                            }
                        ]
                    }
                    series={[
                        {data:gamePlayedByBoth.map((id) => parseInt(games.find((game) => game.gameId === id && game.player === 'Max')?.gameScore || '0')), type: 'line', label: 'Max'},
                        // {data:gamePlayedByBoth.map((id) => parseInt(games.find((game) => game.gameId === id && game.player === 'Malie')?.gameScore || '0')), type: 'line', label: 'Malie'}
                    ]}

                        />
                        </CardContent>
                    </Card>
            </Grid> */}
        </Grid>
    );
};

export default Stats;