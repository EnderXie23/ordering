import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { useUser } from 'Pages/UserContext';
import { CustomerOrderMessage } from 'Plugins/CustomerAPI/CustomerOrderMessage'
import axios from 'axios'
import {
    Container,
    Typography,
    Box,
    Button,
    IconButton,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Paper,
} from '@mui/material'
import { Add, Remove } from '@mui/icons-material';
import { OrderIDMessage } from 'Plugins/AdminAPI/OrderIDMessage'
import CustomerSidebar from './CustomerSidebar/CustomerSidebar'
import { CustomerChargeMessage } from 'Plugins/CustomerAPI/CustomerProfileMessage'
import { LogMessage } from 'Plugins/ChefAPI/LogMessage'
import { DishQueryMessage } from 'Plugins/AdminAPI/AdminDishMessage'

type Dish = {
    name: string;
    path: string;
    price: string;
};

//const image = require.context('../../Images', true, /\.jpg$/);
//const imagePath = image.keys().map(path => path.split('/')[1]);

let dishes: Dish[] = [
    { name: 'Spaghetti Carbonara', path: 'spaghetti_carbonara.jpg', price: '125' },
    { name: 'Margherita Pizza', path: 'margherita_pizza.jpg', price: '100' },
    { name: 'Caesar Salad', path: 'caesar_salad.jpg', price: '25' },
    { name: 'Tiramisu', path: 'tiramisu.jpg', price: '50' },
];

const OrderingPage: React.FC = () => {
    const { name, balance , setOrderedDishes } = useUser();
    const customerName = name.split('\n')[1];
    const history = useHistory();

    const [orderCounts, setOrderCounts] = useState<{ [key: string]: number }>({});

    const parseDishes = (data: string): Dish[] => {
        return data.split('\n').map(line => {
            const [name, path, price] = line.split(',');
            return { name, path, price };
        });
    };

    const readDishesInfo = async () => {
        const qmessage = new DishQueryMessage();
        try {
            const response = await axios.post(qmessage.getURL(), JSON.stringify(qmessage), {
                headers: { 'Content-Type': 'application/json' },
            });
            dishes = parseDishes(response.data);
        } catch (error) {
            console.error('Error querying dishes:', error);
        }
    }

    const calculateTotalCost = () => {
        return dishes.reduce((total, dish) => {
            const count = orderCounts[dish.name] || 0;
            return total + count * parseFloat(dish.price);
        }, 0).toFixed(2);
    };

    const handleCountChange = (dishName: string, count: number) => {
        if (count < 0)
            return;
        setOrderCounts({
            ...orderCounts,
            [dishName]: count,
        });
    };

    const sendOrderRequest = async (message: CustomerOrderMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response.status)
            console.log(response.data)
        } catch (error) {
            console.error('Error submitting order:', error)
        }
    }

    const [orderID, setOrderID] = useState<string | null>(null);

    const sendOrderIDRequest = async (message: OrderIDMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(response.status);
            console.log(response.data);
            const { orderId } = response.data; // Assuming orderId is part of the response data
            setOrderID(orderId);
        } catch (error) {
            console.error('Error querying order:', error);
        }
    };

    const sendChargeRequest = async (amount: string) => {
        const cmessage = new CustomerChargeMessage(name.split('\n')[0], (balance - Number(parseFloat(amount))).toString());
        try {
            const response = await axios.post(cmessage.getURL(), JSON.stringify(cmessage), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log("charge -" + amount);
            console.log(response.data);
        } catch (error) {
            console.error('Error querying order:', error);
        }
    }

    const handleOrderID = async () => {
        const queryMessage = new OrderIDMessage('0'); // Adjust this to your actual service
        try {
            await sendOrderIDRequest(queryMessage);
        } catch (error) {
            console.error('Error in handleQuery:', error);
        }
    };

    useEffect(() => {
        readDishesInfo()
        handleOrderID()
            .catch(error => {
                console.error('Error in handleComplete:', error);
            });
    }, []);
    // TODO: Implement takeout
    const takeout = "false"

    const handleSubmit = () => {
        if (Number(parseFloat(calculateTotalCost())) > balance) {
            alert("You have not enough money!");
            return;
        }

        const orders = Object.entries(orderCounts)
            .filter(([, count]) => count > 0)
            .map(([dishName, count]) => [dishName, count.toString(), takeout])
        console.log('Customer:', customerName)
        console.log('Orders:', orders)
        const orderMessage = new CustomerOrderMessage(customerName, orders.map(order => order.join(',')).join(';'))
        const orderMessage2 = new CustomerOrderMessage(orderID, orders.map(order => order.join(',')).join(';'))
        sendOrderRequest(orderMessage)
        sendChargeRequest(calculateTotalCost())
        const formattedOrders = orders.map(order => ({
            name: order[0],
            path: dishes.find(d => d.name === order[0]).path,
            count: parseInt(order[1], 10)
        }));
        setOrderedDishes(formattedOrders);
        history.push('/order-summary');
    }

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom>
                    欢迎，{customerName}！请在下面点菜：
                </Typography>
                <CustomerSidebar />
            </Box>
            <Grid container spacing={4}>
                {dishes.map((dish) => (
                    <Grid item xs={12} sm={6} md={4} key={dish.name}>
                        <Card style={{maxWidth: '250px', height: '300px'}}>
                            <CardMedia component="img" height="140" src= {require('../../Images/' + dish.path).default} alt={dish.name} />
                            <CardContent>
                                <Typography variant="h5">{dish.name}</Typography>
                                <Box display="flex" alignItems="center">
                                    <IconButton onClick={() => handleCountChange(dish.name, (orderCounts[dish.name] || 0) - 1)}>
                                        <Remove />
                                    </IconButton>
                                    <Typography variant="body1">{orderCounts[dish.name] || 0}</Typography>
                                    <IconButton onClick={() => handleCountChange(dish.name, (orderCounts[dish.name] || 0) + 1)}>
                                        <Add />
                                    </IconButton>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Typography variant="body1">价格：{dish.price}元</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
                <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
                    <Typography variant="h6" color="primary" alignItems="center">
                        您的余额: <span style={{ fontWeight: 'bold', color: '#227aff' }}>{balance} 元</span>
                    </Typography>
                    <Typography variant="h6" color="primary" alignItems="center">
                        总价: <span style={{ fontWeight: 'bold', color: '#ff5722' }}>{calculateTotalCost()} 元</span>
                    </Typography>
                </Paper>
            </Box>
            <Box
                display = "flex"
                justifyContent="center"
                alignItems="center"
            >
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    提交订单
                </Button>
                <Button color="secondary" onClick={() => {history.push('/')}}>
                    返回主页
                </Button>
            </Box>
        </Container>
    );
};

export default OrderingPage;
