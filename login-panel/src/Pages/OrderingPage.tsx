import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useUser } from 'Pages/UserContext';
import { CustomerOrderMessage } from 'Plugins/CustomerAPI/CustomerOrderMessage'
import axios from 'axios'
import { Container, Typography, Box, Button, IconButton, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
// eslint-disable-next-line import/no-unresolved
import fuxuanImage from '../images/fuxuan.jpg'

type Dish = {
    name: string;
};

const dishes: Dish[] = [
    { name: 'Spaghetti Carbonara'},
    { name: 'Margherita Pizza'},
    { name: 'Caesar Salad'},
    { name: 'Tiramisu'},
];

const OrderingPage: React.FC = () => {
    const { username } = useUser();
    const customerName = username;
    const history = useHistory();

    const [orderCounts, setOrderCounts] = useState<{ [key: string]: number }>({});

    const handleCountChange = (dishName: string, count: number) => {
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

    const handleSubmit = () => {
    const orders = Object.entries(orderCounts)
    .filter(([, count]) => count > 0)
            .map(([dishName, count]) => [dishName, count.toString()])
        console.log('Customer:', customerName)
        console.log('Orders:', orders)
        const orderMessage = new CustomerOrderMessage(customerName, orders.map(order => order.join(',')).join(';'))
        sendOrderRequest(orderMessage)
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                欢迎，{customerName}！请在下面点菜：
            </Typography>
            <Grid container spacing={4}>
                {dishes.map((dish) => (
                    <Grid item xs={12} sm={6} md={4} key={dish.name}>
                        <Card>
                            <CardMedia component="img" height="140" image={fuxuanImage} alt={dish.name} />
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
            <Box mt={4}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    提交订单
                </Button>
                <Button color="secondary" onClick={() => history.push('/')}>
                    返回主页
                </Button>
            </Box>
        </Container>
    );
};

export default OrderingPage;
