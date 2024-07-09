import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChefContextType {
    chefName: string;
    setChefName: (chefName: string) => void;
}

const ChefContext = createContext<ChefContextType | undefined>(undefined);

export const ChefProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [chefName, setChefName] = useState<string>('');

    return (
        <ChefContext.Provider value={{ chefName, setChefName }}>
            {children}
        </ChefContext.Provider>
    );
};

export const useChef = () => {
    const context = useContext(ChefContext);
    if (!context) {
        throw new Error('useChef must be used within a ChefProvider');
    }
    return context;
};