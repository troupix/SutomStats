import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Game } from '../types/Game';
import { getAllGames } from '../utils/api';



const GameTable: React.FC = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [gameIds, setGameIds] = useState<string[]>([]);

    useEffect(() => {
        getAllGames().then((data: Game[]) => {
            console.log(data);
            setGames(data);
            setGameIds(Array.from(new Set(data.map((game) => game.gameId))));
        });
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table >
                <TableHead >
                    <TableRow >
                        <TableCell sx={{borderRight:'1px solid rgb(224 224 224)'}}></TableCell>
                        <TableCell sx={{textAlign:'center', borderRight:'1px solid rgb(224 224 224)'}} colSpan={5} >Max</TableCell>
                        <TableCell sx={{textAlign:'center'}} colSpan={5}>Malie</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{borderRight:'1px solid rgb(224 224 224)'}}>ID</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>🟥</TableCell>
                        <TableCell>🟦</TableCell>
                        <TableCell sx={{borderRight:'1px solid rgb(224 224 224)'}}>🟡</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>🟥</TableCell>
                        <TableCell>🟦</TableCell>
                        <TableCell>🟡</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {gameIds.map((id) => (
                        <TableRow key={id}>
                            <TableCell sx={{borderRight:'1px solid rgb(224 224 224)', background: !games.find((game) => game.gameId === id && game.player === 'Max') ||  !games.find((game) => game.gameId === id && game.player === 'Malie') ? 'red' : 'white'}}>{id}</TableCell>
                            <TableCell>{games.find((game) => game.gameId === id && game.player === 'Max')?.gameScore}</TableCell>
                            <TableCell>{games.find((game) => game.gameId === id && game.player === 'Max')?.gameTime}</TableCell>
                            <TableCell>{games.find((game) => game.gameId === id && game.player === 'Max')?.numberOfReds}</TableCell>
                            <TableCell>{games.find((game) => game.gameId === id && game.player === 'Max')?.numberOfBlues}</TableCell>
                            <TableCell sx={{borderRight:'1px solid rgb(224 224 224)'}}>{games.find((game) => game.gameId === id && game.player === 'Max')?.numberOfYellows}</TableCell>
                            <TableCell>{games.find((game) => game.gameId === id && game.player === 'Malie')?.gameScore}</TableCell>
                            <TableCell>{games.find((game) => game.gameId === id && game.player === 'Malie')?.gameTime}</TableCell>
                            <TableCell>{games.find((game) => game.gameId === id && game.player === 'Malie')?.numberOfReds}</TableCell>
                            <TableCell>{games.find((game) => game.gameId === id && game.player === 'Malie')?.numberOfBlues}</TableCell>
                            <TableCell>{games.find((game) => game.gameId === id && game.player === 'Malie')?.numberOfYellows}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default GameTable;