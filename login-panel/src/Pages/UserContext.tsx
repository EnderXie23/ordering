// UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
    name: string;
    setName: (nickname: string) => void;
    orderedDishes: { name: string, count: number }[];
    setOrderedDishes: (dishes: { name: string, count: number }[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [name, setName] = useState<string>('');
    const [orderedDishes, setOrderedDishes] = useState<{ name: string, count: number }[]>([]);

    const mergeOrderedDishes = (newDishes: { name: string, count: number }[]) => {
        setOrderedDishes(prevDishes => {
            const dishMap = new Map(prevDishes.map(dish => [dish.name, dish.count]));
            newDishes.forEach(dish => {
                if (dishMap.has(dish.name)) {
                    dishMap.set(dish.name, dishMap.get(dish.name)! + dish.count);
                } else {
                    dishMap.set(dish.name, dish.count);
                }
            });
            return Array.from(dishMap, ([name, count]) => ({ name, count }));
        });
    };

    return (
        <UserContext.Provider value={{ name, setName, orderedDishes, setOrderedDishes:mergeOrderedDishes }}>
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
