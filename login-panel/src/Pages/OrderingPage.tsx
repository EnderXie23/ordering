import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { useUser } from 'Pages/UserContext'
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
} from '@mui/material'
import { Add, Remove } from '@mui/icons-material'

const dishes = [
    { name: 'Spaghetti Carbonara', photoUrl: './Images/spaghetti_carbonara.jpg' },
    { name: 'Margherita Pizza', photoUrl: './Images/margherita_pizza.jpg' },
    { name: 'Caesar Salad', photoUrl: './Images/caesar_salad.jpg' },
    { name: 'Tiramisu', photoUrl: './Images/tiramisu.jpg' },
]

const OrderingPage: React.FC = () => {
    const { username } = useUser()
    const customerName = username
    const history = useHistory()

    const [orderCounts, setOrderCounts] = useState<{ [key: string]: number }>({})

    const handleCountChange = (dishName: string, count: number) => {
        setOrderCounts({
            ...orderCounts,
            [dishName]: count,
        })
    }

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
            <Typography variant="h4" align="center" gutterBottom>
                Welcome, {customerName}! Place your order below:
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {dishes.map((dish) => (
                    <Grid item key={dish.name} xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={dish.photoUrl}
                                alt={dish.name}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {dish.name}
                                </Typography>
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <IconButton
                                        onClick={() => handleCountChange(dish.name, (orderCounts[dish.name] || 0) - 1)}>
                                        <Remove />
                                    </IconButton>
                                    <Typography variant="h6" mx={2}>
                                        {orderCounts[dish.name] || 0}
                                    </Typography>
                                    <IconButton
                                        onClick={() => handleCountChange(dish.name, (orderCounts[dish.name] || 0) + 1)}>
                                        <Add />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box display="flex" justifyContent="center" mt={4}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit Order
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => history.push('/')}>
                    Return
                </Button>
            </Box>
        </Container>
    )
}

export default OrderingPage
