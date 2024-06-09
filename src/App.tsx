import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import MiniDrawer from './components/Drawer';
import { LocationContext } from './context/LocationContext';
import RegisterGame from './components/RegisterGame';
import BatchUpdate from './components/BatchUpdate';
import BatchUpdateTxt from './components/BatchUpdateTxt';
import GameTable from './components/GameTable';

function App() {
  const [location, setLocation] = React.useState<string>('');

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      <MiniDrawer >
        <h1>{location}</h1>
        {location === 'Register game' && (
          <RegisterGame />
        )}
        {
          window.location.toString().includes('localhost') && location === 'Batch Upgrade sms' && (
            <BatchUpdate />
          )
        }
                {
          window.location.toString().includes('localhost') && location === 'Batch Upgrade txt' && (
            <BatchUpdateTxt />
          )
        }
        {
          location === 'Full game table' &&
          <GameTable />
        }

      </MiniDrawer>
    </LocationContext.Provider>
  );
}

export default App;
