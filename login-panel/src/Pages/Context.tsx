// UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ContextType {
    username: string;
    setUsername: (username: string) => void;
}

const UserContext = createContext<ContextType | undefined>(undefined);

export const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [username, setUsername] = useState<string>('');

    return (
        <UserContext.Provider value={{ username, setUsername }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
