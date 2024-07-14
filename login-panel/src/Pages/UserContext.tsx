// UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
    name: string;
    setName: (newName: string) => void;
    OrderID: string;
    updateOrderID: (newOrderID: string) => void;
    OrderPart:string
    incrementOrderPart: () => void;
    balance: number;
    setBalance: (newBalance: number) => void;

    orderedDishes: { name: string, path: string, count: number, orderPart:string }[];
    setOrderedDishes: (dishes: { name: string, path: string, count: number, orderPart:string }[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [name, setName] = useState<string>('');
    const [OrderID, SetOrderID] = useState<string>('');
    const [OrderPart, SetOrderPart] = useState<string>('0');
    const [balance, setBalance] = useState<number>(0.0);
    const [orderedDishes, setOrderedDishes] =
        useState<{ name: string, path: string, count: number, orderPart:string }[]>([]);

    const updateOrderID = (newOrderID: string) => {
        SetOrderID(newOrderID);
    };

    const incrementOrderPart = () => {
        SetOrderPart(prevOrderPart => (parseInt(prevOrderPart) + 1).toString());
    };

    const mergeOrderedDishes = (newDishes: { name: string, path: string, count: number, orderPart: string }[]) => {
        setOrderedDishes(prevDishes => {
            // Create a map to track dishes using both name and orderPart as a key
            const dishMap = new Map<string, { name: string, path: string, count: number, orderPart: string }>();

            // Add previous dishes to the map
            prevDishes.forEach(dish => {
                const key = `${dish.name}-${dish.orderPart}`;
                dishMap.set(key, { ...dish });
            });

            // Process new dishes
            newDishes.forEach(dish => {
                const key = `${dish.name}-${dish.orderPart}`;
                if (dishMap.has(key)) {
                    const existingDish = dishMap.get(key)!;
                    dishMap.set(key, {
                        ...existingDish,
                        count: existingDish.count + dish.count,
                    });
                } else {
                    dishMap.set(key, { ...dish });
                }
            });

            // Convert map values back to an array
            return Array.from(dishMap.values());
        });
    };

    return (
        <UserContext.Provider value={{ name, setName,balance, setBalance, OrderID,updateOrderID, OrderPart, incrementOrderPart, orderedDishes, setOrderedDishes:mergeOrderedDishes }}>
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
