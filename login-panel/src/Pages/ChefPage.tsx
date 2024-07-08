import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { Grid, Button, Card, CardContent, Typography, ListItemText, Container, Box } from '@mui/material'
import axios from 'axios'
import { QueryMessage } from 'Plugins/ChefAPI/QueryMessage'
import { CompleteMessage } from 'Plugins/ChefAPI/CompleteMessage'

interface Order {
    id: number;
    customer: string;
    dish: string;
    quantity: number;
    state: string;
}

//parse the order to Order type list
function parseOrders(input: string): Order[] {
    const strings = input.split('\n');
    let orders: Order[] = [];
    let currentCustomer: string = '';

    const waitingOrders: Order[] = [];
    const otherOrders: Order[] = [];
    let idCounter = 1;

    strings.forEach((str, index) => {
        if (str.startsWith('Customer: ')) {
            currentCustomer = str.replace('Customer: ', '').trim();
            if (currentCustomer === '') currentCustomer = 'Anonymous';
        } else if (str.startsWith('Dish: ') && currentCustomer) {
            const dish = str.replace('Dish: ', '').trim();
            const quantityStr = strings[index + 1];
            const finishState = strings[index + 2];
            if (quantityStr.startsWith('Order Count: ')) {
                const quantity = parseInt(quantityStr.replace('Order Count: ', '').trim());
                const state = finishState.replace('State: ', '').trim();
                const order = {
                    id: idCounter++,
                    customer: currentCustomer,
                    dish: dish,
                    quantity: quantity,
                    state: state
                };
                if (state === 'waiting') {
                    waitingOrders.push(order);
                } else {
                    otherOrders.push(order);
                }
            }
        }
    });

    // Combine waitingOrders and otherOrders, placing waitingOrders at the front
    orders = [...waitingOrders, ...otherOrders];

    // console.log(orders); // for output
    return orders;
}

// TODO: use these two functions to realize two patterns of orders showing
// 按照 dish 分类
function groupByDish(orders: Order[]): Record<string, Order[]> {
    return orders.reduce((acc, order) => {
        if (!acc[order.dish]) {
            acc[order.dish] = [];
        }
        acc[order.dish].push(order);
        return acc;
    }, {} as Record<string, Order[]>);
}

// 按照 customer 分类
function groupByCustomer(orders: Order[]): Record<string, Order[]> {
    return orders.reduce((acc, order) => {
        if (!acc[order.customer]) {
            acc[order.customer] = [];
        }
        acc[order.customer].push(order);
        return acc;
    }, {} as Record<string, Order[]>);
}

const ChefPage: React.FC = () => {
    const history = useHistory()
    const [orders, setOrders] = useState<Order[]>([])

    const sendCompleteRequest = async (message: CompleteMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response.status)
            console.log(response.data)
            await handleQuery()
        } catch (error) {
            console.error('Error completing order:', error)
        }
    }

    const handleComplete = async (order: Order, state: string) => {
        const completeMessage = new CompleteMessage(`${order.customer}\n${order.dish}\n${order.quantity}\n` + state)
        if (state === "0") {
            console.log('Reject order:', order)
        } else if (state === "1") {
            console.log('Complete order:', order)
        } else {
            console.error('Invalid State')
            return
        }
        try {
            await sendCompleteRequest(completeMessage);
        } catch (error) {
            console.error('Error in handleComplete:', error);
        }
    }

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

    const handleQuery = async () => {
        const queryMessage = new QueryMessage('chef')
        try {
            await sendQueryRequest(queryMessage); // Added await
        } catch (error) {
            console.error('Error in handleQuery:', error); // Added error handling
        }
    }

    useEffect(() => {
        handleQuery()
            .then(() => {
            // Handle any post-request actions here
        })
            .catch(error => {
                console.error('Error in handleComplete:', error); // Added error handling
            });
    }, []);

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                厨师页面
            </Typography>
            <Grid container spacing={2}>
                {orders.map(order => (
                    <Grid item xs={12} sm={6} md={3} key={order.id} style={{minWidth: '250px', display: 'flex' }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5">
                                    {order.customer}的点餐：
                                </Typography>
                                <ListItemText primary={`${order.dish} x ${order.quantity}`} />
                                <ListItemText primary={`状态：${order.state}`} />
                            </CardContent>
                            {order.state == "waiting" && (
                                <Grid container spacing={1} justifyContent="center" alignItems="center">
                                    <Grid item>
                                        <Button variant="contained" color="primary" onClick={() => handleComplete(order, "1")} style={{ marginBottom: '20px' }}>
                                            完成
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" onClick={() => handleComplete(order, "0")} style={{ backgroundColor: '#ff6666', marginBottom: '20px'}}>
                                            拒绝
                                        </Button>
                                    </Grid>
                                </Grid>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box
                display = "flex"
                justifyContent="space-evenly"
                alignItems="center"
            >
                <Button variant="contained" color="primary" onClick={handleQuery} style={{ margin: '20px' }}>
                    刷新
                </Button>
                <Button color="secondary" onClick={() => {history.push('/')}} style={{ margin: '20px' }}>
                    返回主页
                </Button>
            </Box>
        </Container>
    )
}

export default ChefPage
