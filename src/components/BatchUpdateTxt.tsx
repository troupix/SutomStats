import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Game } from '../types/Game';
import { registerGame } from '../utils/api';
import { text } from 'stream/consumers';

interface Status{
    status: string;
    gameId: string;
    player?: string;
}

const BatchUpdateTxt: React.FC = () => {
    const [textData, setTextData] = useState<any>(null);
    const [updateStatus, setUpdateStatus] = useState<Status[]>([]);
    const handleFileRead = (e: ProgressEvent<FileReader>) => {
        const content = e.target?.result;
        if (content) {
            try {
                const newStatus: Status[] = updateStatus.map((status) => status);
                // const test = content.replace(/\d\d\/\d\d\/\d\d\d\d, \d\d:\d\d/, '');
                const parsedData = content.toString().replace(/\d\d\/\d\d\/\d\d\d\d, \d\d:\d\d/g,'[newSms]').split('[newSms]').map((txt => 
                    {
                        return {
                            text: txt.includes('Maximilien:') ? txt.split('Maximilien:')[1] : txt.split('Marie-alix Aubry:')[1],
                            messageDirection: txt.includes('Maximilien:') ? 'OUTGOING' : 'INCOMING'
                        }
                    }
                ));
                const gameData: Game[] = [];
                parsedData.filter((item:any) => item.text && item.text.includes('#SUTOM')).forEach((item:any) => {
                    const gameTime =item.text.match(/((\d{2})h)*(\d{2}):(\d{2})/)?.[0];
                    console.log(gameTime);
                    const [hours, minutes, seconds] = gameTime && gameTime.includes("h") ? [gameTime.split('h')[0], gameTime.split('h')[1].split(':')[0], gameTime.split(':')[1]] : ['00', gameTime?.split(':')[0] || '00', gameTime?.split(':')[0] || '00'];
                    const game: Game = {
                        gameFullResult: item.text,
                        gameId: item.text.match(/#(\d+)/)?.[0] || '',
                        gameScore: item.text.match(/(\d+)\/6/)?.[0].split('')[0] || '-',
                        gameTime: parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds),
                        numberOfBlues: parseInt(item.text.match(/🟦/g)?.length?.toString() || '0'),
                        numberOfReds: parseInt(item.text.match(/🟥/g)?.length?.toString() || '0'),
                        numberOfYellows: parseInt(item.text.match(/🟡/g)?.length?.toString() || '0'),
                        player: item.messageDirection === 'OUTGOING' ? 'Max' : 'Malie',
                    };
                    
                    newStatus.push({status: 'Not started', gameId: game.gameId, player: item.messageDirection === 'OUTGOING' ? 'Max' : 'Malie'});

                    gameData.push(game);
                }
                );
                setTextData(gameData);
                setUpdateStatus(newStatus);
            } catch (error) {
                console.error('Error parsing JSON file:', error);
            }
        }
    };

    const BatchSave = async() => {
        for (const game of textData) {
            const newStatus: Status[] = updateStatus.map((status) => status);
            const statusIndex = newStatus.findIndex((status) => status.gameId === game.gameId && status.player === game.player);
            newStatus[statusIndex].status = 'In progress';
            setUpdateStatus(newStatus);
            try {
            const response = await registerGame(game)
            newStatus[statusIndex].status = 'Success';
            setUpdateStatus(newStatus);
            }
            catch (error) {
                newStatus[statusIndex].status = 'Failed';
                setUpdateStatus(newStatus);
            }
        }
    };


    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = handleFileRead;
            reader.readAsText(selectedFile);
        }
    };

    return (
        <div>
            <input type="file" accept=".txt" onChange={handleFileInputChange} />
            <Button variant="contained" color="primary" onClick={BatchSave}>Batch Save</Button>
            {textData ? (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Game ID</TableCell>
                            <TableCell>Player</TableCell>
                            <TableCell>Game Score</TableCell>
                            <TableCell>Game Time</TableCell>
                            <TableCell>Number of Reds</TableCell>
                            <TableCell>Number of Yellows</TableCell>
                            <TableCell>Number of Blues</TableCell>
                            <TableCell>Update Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {textData.map((game: Game) => (
                            <TableRow key={game.gameId}>
                                <TableCell>{game.gameId}</TableCell>
                                <TableCell>{game.player}</TableCell>
                                <TableCell>{game.gameScore}</TableCell>
                                <TableCell>{game.gameTime}</TableCell>
                                <TableCell>{game.numberOfReds}</TableCell>
                                <TableCell>{game.numberOfYellows}</TableCell>
                                <TableCell>{game.numberOfBlues}</TableCell>
                                <TableCell>{updateStatus.find((status) => status.gameId === game.gameId && status.player === game.player)?.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
            ) : (
                <Typography variant="body1">No file selected</Typography>
            )}
        </div>
    );
};

export default BatchUpdateTxt;