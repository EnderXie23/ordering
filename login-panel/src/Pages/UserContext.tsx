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

    orderedDishes: { name: string, path: string, count: number }[];
    setOrderedDishes: (dishes: { name: string, path: string, count: number }[]) => void;
    service: number;
    setService: (newServiceType: number) => void;
    serviceTypeInfo: string;
    setServiceTypeInfo: (newServiceTypeInfo: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [name, setName] = useState<string>('');
    const [OrderID, SetOrderID] = useState<string>('');
    const [OrderPart, SetOrderPart] = useState<string>('0');
    const [balance, setBalance] = useState<number>(0.0);
    const [orderedDishes, setOrderedDishes] =
        useState<{ name: string, path: string, count: number }[]>([]);
    const [service, setService] = useState<number>(0);
    const [serviceTypeInfo, setServiceTypeInfo] = useState<string>('');

    const updateOrderID = (newOrderID: string) => {
        SetOrderID(newOrderID);
    };

    const incrementOrderPart = () => {
        SetOrderPart(prevOrderPart => (parseInt(prevOrderPart) + 1).toString());
    };

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
        <UserContext.Provider value={{ name, setName,balance, setBalance,
        OrderID,updateOrderID, OrderPart, incrementOrderPart, orderedDishes, setOrderedDishes:mergeOrderedDishes,
        service, setService, serviceTypeInfo ,setServiceTypeInfo}}>
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
