import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { useUser } from 'Pages/UserContext';
import { CustomerOrderMessage } from 'Plugins/CustomerAPI/CustomerOrderMessage'
import { OrderLogMessage } from 'Plugins/AdminAPI/OrderLogMessage'
import axios from 'axios'
import { Container, Typography, Box, Button, IconButton, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { OrderIDMessage } from 'Plugins/AdminAPI/OrderIDMessage'
import CustomerSidebar from './CustomerSidebar/CustomerSidebar'
import { LogMessage } from 'Plugins/ChefAPI/LogMessage'

type Dish = {
    name: string;
    path: string;
};

//const image = require.context('../../Images', true, /\.jpg$/);
//const imagePath = image.keys().map(path => path.split('/')[1]);

const dishes: Dish[] = [
    { name: 'Spaghetti Carbonara', path: 'spaghetti_carbonara.jpg' },
    { name: 'Margherita Pizza', path: 'margherita_pizza.jpg' },
    { name: 'Caesar Salad', path: 'caesar_salad.jpg' },
    { name: 'Tiramisu', path: 'tiramisu.jpg' },
];

const OrderingPage: React.FC = () => {
    const { name,OrderID, updateOrderID,incrementOrderPart, setOrderedDishes } = useUser();
    const customerName = name.split('\n')[1];
    const history = useHistory();

    const [orderCounts, setOrderCounts] = useState<{ [key: string]: number }>({});

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

    const sendOrderLogRequest = async (message: OrderLogMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response.status)
            console.log(response.data)
        } catch (error) {
            console.error('Error logging:', error)
        }
    }

    const handleOrderLog = async () => {
        const orders = Object.entries(orderCounts)
            .filter(([, count]) => count > 0)
            .map(([dishName, count]) => [dishName, count.toString(), takeout]);
        // Send each order separately
        orders.forEach(order => {
            const log = `Customer: ${customerName}\nOrderID: ${OrderID}\nStatus: 0\n` +order.join('\n')
            const singleOrderLogMessage = new OrderLogMessage(log);
            try {
                sendOrderLogRequest(singleOrderLogMessage)
            } catch (error) {
                console.error('Error in handleLog:', error);
            }
        });

    };

    const sendOrderIDRequest = async (message: OrderIDMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(response.status);
            console.log(response.data);
            const { orderId } = response.data; // Assuming orderId is part of the response data
            updateOrderID(response.data)
            incrementOrderPart()
            setOrderID(orderId);
            console.log("OrderID3:", response.data);
        } catch (error) {
            console.error('Error querying order:', error);
        }
    };

    const handleOrderID = async () => {
        const queryMessage = new OrderIDMessage('0'); // Adjust this to your actual service
        try {
            await sendOrderIDRequest(queryMessage);
        } catch (error) {
            console.error('Error in handleQuery:', error);
        }
    };

    useEffect(() => {
        handleOrderID()
            .then(() => {
            })
            .catch(error => {
                console.error('Error in handleComplete:', error);
            });
    }, []);
    // TODO: Implement takeout
    const takeout = "false"

    const handleSubmit = () => {
        const orders = Object.entries(orderCounts)
            .filter(([, count]) => count > 0)
            .map(([dishName, count]) => [dishName, count.toString(), takeout])
        console.log('Customer:', customerName)
        console.log('Orders:', orders)
        console.log('OrderID:', OrderID)
        const orderMessage = new CustomerOrderMessage(customerName, OrderID,"0", orders.map(order => order.join(',')).join(';'))
        handleOrderLog().then()
        sendOrderRequest(orderMessage).then()
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
                <CustomerSidebar/>
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
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
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
