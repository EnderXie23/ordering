// UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
    name: string;
    setName: (newName: string) => void;
    balance: number;
    setBalance: (newBalance: number) => void;
    orderedDishes: { name: string, path: string, count: number }[];
    setOrderedDishes: (dishes: { name: string, path: string, count: number }[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [name, setName] = useState<string>('');
    const [balance, setBalance] = useState<number>(0.0);
    const [orderedDishes, setOrderedDishes] =
        useState<{ name: string, path: string, count: number }[]>([]);

    const mergeOrderedDishes = (newDishes: { name: string, path: string, count: number }[]) => {
        setOrderedDishes(prevDishes => {
            const dishMap = new Map(prevDishes.map(dish => [dish.name, { ...dish }]));
            newDishes.forEach(dish => {
                if (dishMap.has(dish.name)) {
                    const existingDish = dishMap.get(dish.name)!;
                    dishMap.set(dish.name, {
                        ...existingDish,
                        count: existingDish.count + dish.count,
                    });
                } else {
                    dishMap.set(dish.name, { ...dish });
                }
            });
            return Array.from(dishMap.values());
        });
    };

    return (
        <UserContext.Provider value={{ name, setName, balance, setBalance, orderedDishes, setOrderedDishes:mergeOrderedDishes }}>
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
