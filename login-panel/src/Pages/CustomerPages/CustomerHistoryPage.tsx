import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
    Button,
    Typography,
    Container,
    Box,
    ListItem,
    ListItemText,
    Paper,
    List,
} from '@mui/material'
import axios from 'axios'
import { CustomerHistoryMessage } from 'Plugins/CustomerAPI/CustomerHistoryMessage'
import { useUser } from 'Pages/UserContext'

interface OrderHistory {
    orderID: string
    orderPart: string
    dishName: string,
    quantity: number,
    price: number,
    state: string
}

export function CustomerHistoryPage() {
    const history = useHistory()
    const [finishedOrders, setFinishedOrders] = useState<OrderHistory[]>([])
    const [groupedOrdersByOrderID, setGroupedOrdersByOrderID] = useState<{ [orderID: string]: OrderHistory[] }>({});
    const { name, orderedDishes, OrderID,OrderPart } = useUser();
    const parseOrders = (data: string): OrderHistory[] => {
        return data.trim().split('\n').map(order => {
            const orderParts = order.split(',');
            const getValue = (part: string) => part.split(':')[1].trim().replace(/^Some\(|\)$/g, ''); // Clean the value
            const orderID = getValue(orderParts[0]);
            const orderPart = getValue(orderParts[1]);
            const dishName = getValue(orderParts[2]);
            const quantity = parseInt(getValue(orderParts[3]), 10);
            const price = parseInt(getValue(orderParts[4]), 10);
            const state = getValue(orderParts[5]);

            return {
                orderID,
                orderPart,
                dishName,
                quantity,
                price,
                state
            };
        });
    };

    const groupOrdersByOrderID = (orders: OrderHistory[]) => {
        return orders.reduce((acc, order) => {
            const orderIDOrders = acc[order.orderID] || [];
            orderIDOrders.push(order);
            acc[order.orderID] = orderIDOrders;
            return acc;
        }, {} as { [orderID: string]: OrderHistory[] });
    };

    const sendCustomerHistory = async (message: CustomerHistoryMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response.status)
            console.log(response.data)
            const ordersArray = parseOrders(response.data)
            const groupedOrdersByOrderID = groupOrdersByOrderID(ordersArray);
            setFinishedOrders(ordersArray);
            setGroupedOrdersByOrderID(groupedOrdersByOrderID);
        } catch (error) {
            console.error('Error admin-querying:', error)
        }
    }

    const handleCustomerHistory = async () => {
        const queryMessage = new CustomerHistoryMessage(name)
        try {
            await sendCustomerHistory(queryMessage)
        } catch (error) {
            console.error('Error in handleAdminQuery:', error)
        }
    }

    useEffect(() => {
        handleCustomerHistory()
            .catch(error => {
                console.error('Error in handleComplete:', error) // Added error handling
            })
    }, [])

    return (
        <Container style={{
            maxHeight: '100vh',
        }}>
            <Box style={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'white',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'center',
                padding: '20px',
                margin: '10px',
            }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    订单管理页面
                </Typography>
            </Box>
            <Box style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {Object.entries(groupedOrdersByOrderID).sort(([a], [b]) => b.localeCompare(a)).map(([orderID, orders]) => (
                    <Paper key={orderID} style={{ margin: '20px', padding: '10px' }}>
                        <Typography variant="h6">Order ID: {orderID}</Typography>
                        <List>
                            {orders.map((order, index) => (
                                <ListItem key={index} divider>
                                    <ListItemText
                                        primary={`Dish: ${order.dishName} x ${order.quantity}`}
                                        secondary={`Price: ${order.price} State: ${order.state}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                ))}
            </Box>
            <Box display="flex" flexDirection="column" alignItems="stretch" mt={2} className="button-container">
                <Button color="primary" onClick={handleCustomerHistory}>
                    刷新
                </Button>
                <Box display="flex" mt={2} className="button-container">
                    <Button color="secondary" onClick={() => { history.push('/admin') }}>
                        返回
                    </Button>
                    <Button color="secondary" onClick={() => { history.push('/') }}>
                        主页
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}
