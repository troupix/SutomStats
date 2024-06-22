import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Game } from '../types/Game';
import { registerGame } from '../utils/api';


const RegisterGame: React.FC = () => {
    const [game, setGame] = useState<Game>({
        gameFullResult: '',
        gameId: '',
        gameScore: '-',
        gameTime: 0,
        numberOfReds: 0,
        numberOfYellows: 0,
        numberOfBlues: 0,
        player: 'Max'
    });
    const [gameHours, setGameHours] = useState<string>('00');
    const [gameMinutes, setGameMinutes] = useState<string>('00');
    const [gameSeconds, setGameSeconds] = useState<string>('00');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setGame((prevGame:Game) => ({
            ...prevGame,
            [name]: value,
        }));
    };

    const checkGameIsWellFilled = (game: Game) => {
        console.log(game);
        if (game.gameFullResult === '' && !game.gameFullResult.includes('#SUTOM')) return false;
        if (game.gameId === '') return false;
        if (game.gameScore === '') return false;
        // if (game.numberOfReds === 0) return false;
        // if (game.numberOfYellows === 0) return false;
        // if (game.numberOfBlues === 0) return false;
        if (game.player === '') return false;
        return true;
    }

    const handleGameScoreChange = (event: React.ChangeEvent<{ value: string }>) => {
        const { value } = event.target;
        setGame((prevGame:Game) => ({
            ...prevGame,
            gameScore: value,
        }));
    }

    useEffect(() => {
        if (game.gameFullResult !== '') {
            const gameTime = game.gameFullResult.match(/((\d{2})h)*(\d{2}):(\d{2})/)?.[0];
            const [hours, minutes, seconds] = gameTime && gameTime.includes("h") ? [gameTime.split('h')[0], gameTime.split('h')[1].split(':')[0], gameTime.split(':')[1]] : ['00', gameTime?.split(':')[0] || '00', gameTime?.split(':')[1] || '00'];
            console.log(gameTime);
            setGame((prevGame:Game) => ({
                ...prevGame,
                gameId: game.gameFullResult.match(/#(\d+)/)?.[0] || '',
                gameScore: game.gameFullResult.match(/(\d+)\/6/)?.[0].split('')[0] || '-',
                numberOfBlues: parseInt(game.gameFullResult.match(/🟦/g)?.length?.toString() || '0'),
                numberOfReds: parseInt(game.gameFullResult.match(/🟥/g)?.length?.toString() || '0'),
                numberOfYellows: parseInt(game.gameFullResult.match(/🟡/g)?.length?.toString() || '0'),
                gameTime: parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds),
            }));
            setGameHours(hours);
            setGameMinutes(minutes);
            setGameSeconds(seconds);
        }
    }, [game.gameFullResult]);

    useEffect(() => {
        const formattedGameTime = parseInt(gameHours) * 3600 + parseInt(gameMinutes) * 60 + parseInt(gameSeconds);
        setGame((prevGame: Game) => ({
            ...prevGame,
            gameTime: formattedGameTime,
        }));

    }, [gameHours, gameMinutes, gameSeconds]);

    const handleplayerChange = (event: React.ChangeEvent<{ value: string }>) => {
        const { value } = event.target;
        setGame((prevGame:Game) => ({
            ...prevGame,
            player: value,
        }));
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!checkGameIsWellFilled(game)) {
            alert('Please fill all the fields');
            return;
        }
        registerGame(game);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    multiline
                    rows={10}
                    type="text"
                    id="gameFullResult"
                    name="gameFullResult"
                    label="Paste your result here" // Add the label prop here
                    value={game.gameFullResult}
                    onChange={handleInputChange}
                    error={game.gameFullResult !== '' && !checkGameIsWellFilled(game)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                {game.gameFullResult !== '' && !checkGameIsWellFilled(game) && <Typography variant="caption" color="error">Your result does not have all information</Typography>}


            </Grid>
            <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <FormControl fullWidth>
                        <InputLabel id="player">Player</InputLabel>
                        <Select
                            fullWidth
                            label="Player"
                            name='player'
                            id='player'
                            defaultValue='Max'
                            value={game.player}
                            onChange={handleplayerChange as (event: SelectChangeEvent<string>) => void}
                        >
                            <MenuItem value="Max">Max</MenuItem>
                            <MenuItem value="Malie">Malie</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <TextField
                        disabled
                        fullWidth
                        type="text"
                        id="gameId"
                        name="gameId"
                        label="Game number" // Add the label prop here
                        value={game.gameId}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <FormControl fullWidth>
                        <InputLabel id="gameScore">Game score</InputLabel>
                        <Select disabled fullWidth label="Game genre" name='gameScore' id='gameScore' value={game.gameScore} onChange={handleGameScoreChange as (event: SelectChangeEvent<string>) => void}>
                            <MenuItem value="-">-/6</MenuItem>
                            <MenuItem value="1">1/6</MenuItem>
                            <MenuItem value="2">2/6</MenuItem>
                            <MenuItem value="3">3/6</MenuItem>
                            <MenuItem value="4">4/6</MenuItem>
                            <MenuItem value="5">5/6</MenuItem>
                            <MenuItem value="6">6/6</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ display: 'inline-flex', flexDirection: 'row', alignItems: 'center' }}>
                    <TextField
                        disabled
                        type="text"
                        id="gameTime"
                        name="gameTime"
                        label="Game time" // Add the label prop here
                        value={gameHours}
                        onChange={(e) => setGameHours(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />h
                    <TextField
                        disabled
                        type="text"
                        id="gameTime"
                        name="gameTime"
                        value={gameMinutes}
                        onChange={(e) => setGameMinutes(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />:
                    <TextField
                        disabled
                        type="text"
                        id="gameTime"
                        name="gameTime"
                        value={gameSeconds}
                        onChange={(e) => setGameSeconds(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <TextField
                        disabled
                        fullWidth
                        type="text"
                        id="test"
                        name="test"
                        label="Number of 🟥" // Add the label prop here
                        value={game.numberOfReds}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />🟥
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <TextField
                        disabled
                        fullWidth
                        type="text"
                        id="test"
                        name="test"
                        label="Number of 🟡" // Add the label prop here
                        value={game.numberOfYellows}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />🟡
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <TextField
                        disabled
                        fullWidth
                        type="text"
                        id="test"
                        name="test"
                        label="Number of 🟦" // Add the label prop here
                        value={game.numberOfBlues}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />🟦
                </Box>
            </Grid>
            <Grid item xs={12} sx={{textAlign:'center'}}>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={handleSubmit}
                >
                    Save
                </Button>
            </Grid>
        </Grid >
    );
};

export default RegisterGame;