import React, { createContext, useContext, useState } from 'react';



// Define the type of the context
interface LocationContextType {
    location: string;
    setLocation: React.Dispatch<React.SetStateAction<string>>;
}

// Define the LocationContext
export const LocationContext = createContext<LocationContextType>({location: '', setLocation: () => {}}as LocationContextType);


