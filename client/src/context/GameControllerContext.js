// context/GameControllerContext.js
import React, { createContext, useContext } from 'react';
import gameController from '../pages/Game/gamelogic/gameController'; // Import the instance

// Create the Context
const GameControllerContext = createContext();

// Create a Provider Component
export const GameControllerProvider = ({ children }) => {
    return (
        <GameControllerContext.Provider value={gameController}>
            {children}
        </GameControllerContext.Provider>
    );
};

// Custom Hook to Use the Context
export const useGameController = () => {
    return useContext(GameControllerContext);
};
