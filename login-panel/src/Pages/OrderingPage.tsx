import React, { useState } from 'react'
import { useLocation, useHistory } from 'react-router'
import { useUser } from 'Pages/UserContext'

type Dish = {
    name: string;
    photoUrl: string;
};

type Props = {
    customerName: string;
    dishes: Dish[];
    onSubmit: (customerName: string, orders: [string, string][]) => void;
};

const OrderingPage: React.FC<Props> = ({ dishes, onSubmit }) => {
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
        onSubmit(customerName, orders as [string, string][])
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
