import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { Button, Card, CardContent, Typography, List, ListItem, ListItemText, Container } from '@mui/material';
import axios from 'axios'
import { QueryMessage } from 'Plugins/ChefAPI/QueryMessage'

interface Order {
    id: string;
    customerName: string;
    items: { dishName: string, quantity: number }[];
}

function parseOrders(input: string): Order[] {
    const strings = input.split('\n');
    const ordersMap: { [customerName: string]: { dishName: string, quantity: number }[] } = {};

    let currentCustomer: string = '';

    strings.forEach(str => {
        if (str.startsWith('Customer: ')) {
            currentCustomer = str.replace('Customer: ', '').trim();
            if (currentCustomer == '')
                currentCustomer = 'Anonymous'
            if (!ordersMap[currentCustomer]) {
                ordersMap[currentCustomer] = [];
            }
        } else if (str.startsWith('Dish: ') && currentCustomer) {
            const dish = str.replace('Dish: ', '').trim();
            const quantityStr = strings[strings.indexOf(str) + 1];
            if (quantityStr.startsWith('Order Count: ')) {
                const quantity = parseInt(quantityStr.replace('Order Count: ', '').trim());
                ordersMap[currentCustomer].push({ dishName: dish, quantity: quantity });
            }
        }
    });

    return Object.entries(ordersMap).map(([customerName, items], index) => ({
        id: (index + 1).toString(),
        customerName: customerName,
        items: items
    }));
}

const ChefPage: React.FC = () => {
    const history = useHistory()
    const [orders, setOrders] = useState<Order[]>([])

    const sendQueryRequest = async (message: QueryMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response.status)
            console.log(response.data)
            setOrders(parseOrders(response.data))
        } catch (error) {
            console.error('Error querying order:', error)
        }
    }

    const handleQuery = () =>{
        const queryMessage = new QueryMessage('chef')
        sendQueryRequest(queryMessage)
    }

    useEffect(() => {
        handleQuery()
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Chef Page
            </Typography>
            {orders.map(order => (
                <Card key={order.id} style={{ marginBottom: '20px' }}>
                    <CardContent>
                        <Typography variant="h5">
                            Order for {order.customerName}
                        </Typography>
                        <List>
                            {order.items.map((item, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={`${item.dishName} x ${item.quantity}`} />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            ))}
            <Button variant="contained" color="primary" onClick={handleQuery} style={{ marginBottom: '20px' }}>
                刷新
            </Button>
            <Button variant="contained" color="primary" onClick={() => {setTimeout(() => {history.push('/')}, 500)}} style={{ marginBottom: '20px' }}>
                返回主页
            </Button>
        </Container>
    )
}

export default ChefPage
