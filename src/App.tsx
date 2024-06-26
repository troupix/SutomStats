import React, { useState } from 'react';
import './App.css';
import MiniDrawer from './components/Drawer';
import { LocationContext } from './context/LocationContext';
import RegisterGame from './components/RegisterGame';
import BatchUpdate from './components/BatchUpdate';
import BatchUpdateTxt from './components/BatchUpdateTxt';
import GameTable from './components/GameTable';
import Stats from './components/Stats';

function App() {
  const [location, setLocation] = useState<string>('');

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
        {
          (location === 'Stats' || location==='') &&
          <Stats />
        }

      </MiniDrawer>
    </LocationContext.Provider>
  );
}

export default App;
