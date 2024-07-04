import React, { useState } from 'react'
import { useLocation, useHistory } from 'react-router'
import { useUser } from 'Pages/UserContext'

type Dish = {
    name: string;
    photoUrl: string;
};

const dishes = [
    //{ name: 'Spaghetti Carbonara', photoUrl: '/images/spaghetti_carbonara.jpg' },
    //{ name: 'Margherita Pizza', photoUrl: '/images/margherita_pizza.jpg' },
    //{ name: 'Caesar Salad', photoUrl: '/images/caesar_salad.jpg' },
    //{ name: 'Tiramisu', photoUrl: '/images/tiramisu.jpg' },
    { name: 'Spaghetti Carbonara', photoUrl: 'tjn.jpg' },
    { name: 'Margherita Pizza', photoUrl: '/images/margherita_pizza.jpg' },
    { name: 'Caesar Salad', photoUrl: '/images/caesar_salad.jpg' },
    { name: 'Tiramisu', photoUrl: '/images/tiramisu.jpg' },
];

const OrderingPage: React.FC = () => {
    const {username} = useUser();
    const customerName = username
    const history = useHistory();

    const [orderCounts, setOrderCounts] = useState<{ [key: string]: number }>({})

    const handleCountChange = (dishName: string, count: number) => {
        setOrderCounts({
            ...orderCounts,
            [dishName]: count,
        })
    }

    const handleSubmit = () => {
        const orders = Object.entries(orderCounts).map(([dishName, count]) => [dishName, count.toString()])
        console.log('Customer:', customerName);
        console.log('Orders:', orders);
    }

    return (
        <div>
            <h1>Welcome, {customerName}! Place your order below:</h1>
            <div className="dishes">
                {dishes.map((dish) => (
                    <div key={dish.name} className="dish">
                        <img src={dish.photoUrl} alt={dish.name} />
                        <h2>{dish.name}</h2>
                        <div>
                            <button onClick={() => handleCountChange(dish.name, (orderCounts[dish.name] || 0) - 1)}>-
                            </button>
                            <span>{orderCounts[dish.name] || 0}</span>
                            <button onClick={() => handleCountChange(dish.name, (orderCounts[dish.name] || 0) + 1)}>+
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={handleSubmit}>Submit Order</button>
            <button onClick={() => history.push('/')}>
                Return
            </button>
        </div>
    )
}

export default OrderingPage
