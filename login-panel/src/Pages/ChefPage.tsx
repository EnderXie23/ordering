import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { Grid, Button, Card, CardContent, Typography, ListItemText, Container, Box, IconButton } from '@mui/material'
import axios from 'axios'
import { QueryMessage } from 'Plugins/ChefAPI/QueryMessage'
import { CompleteMessage } from 'Plugins/ChefAPI/CompleteMessage'
import { LogMessage } from 'Plugins/ChefAPI/LogMessage'
import { useChef } from './ChefContext';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';


interface Order {
    id: number;
    customer: string;
    dish: string;
    quantity: number;
    state: string;
}

function parseOrders(input: string): Order[] {
    const strings = input.split('\n')
    let orders: Order[] = []
    let currentCustomer: string = ''

    const waitingOrders: Order[] = []
    const otherOrders: Order[] = []
    let idCounter = 1

    strings.forEach((str, index) => {
        if (str.startsWith('Customer: ')) {
            currentCustomer = str.replace('Customer: ', '').trim()
            if (currentCustomer === '') currentCustomer = 'Anonymous'
        } else if (str.startsWith('Dish: ') && currentCustomer) {
            const dish = str.replace('Dish: ', '').trim()
            const quantityStr = strings[index + 1]
            const finishState = strings[index + 2]
            if (quantityStr.startsWith('Order Count: ')) {
                const quantity = parseInt(quantityStr.replace('Order Count: ', '').trim())
                const state = finishState.replace('State: ', '').trim()
                const order = {
                    id: idCounter++,
                    customer: currentCustomer,
                    dish: dish,
                    quantity: quantity,
                    state: state,
                }
                if (state === 'waiting') {
                    waitingOrders.push(order)
                } else {
                    otherOrders.push(order)
                }
            }
        }
    })

    // Combine waitingOrders and otherOrders, placing waitingOrders at the front
    orders = [...waitingOrders, ...otherOrders]

    // console.log(orders); // for output
    return orders
}

// TODO: use these two functions to realize two patterns of orders showing
// 按照 dish 分类
function groupByDish(orders: Order[]): Record<string, Order[]> {
    return orders.reduce((acc, order) => {
        if (!acc[order.dish]) {
            acc[order.dish] = []
        }
        acc[order.dish].push(order)
        return acc
    }, {} as Record<string, Order[]>)
}

// 按照 customer 分类
function groupByCustomer(orders: Order[]): Record<string, Order[]> {
    return orders.reduce((acc, order) => {
        if (!acc[order.customer]) {
            acc[order.customer] = []
        }
        acc[order.customer].push(order)
        return acc
    }, {} as Record<string, Order[]>)
}

const ChefPage: React.FC = () => {
    const history = useHistory()
    const [orders, setOrders] = useState<Order[]>([])
    const { chefName } = useChef();
    const [groupBy, setGroupBy] = useState<'dish' | 'customer'>('dish');

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

    const sendLogRequest = async (message: LogMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response.status)
            console.log(response.data)
            await handleQuery()
        } catch (error) {
            console.error('Error logging:', error)
        }
    }

    const handleComplete = async (order: Order, state: string) => {
        const completeMessage = new CompleteMessage(`${order.customer}\n${order.dish}\n${order.quantity}\n` + state)
        const logMessage = new LogMessage(chefName + `\n${order.customer}\n${order.dish}\n${order.quantity}\n` + state)
        if (state === '0') {
            console.log('Reject order:', order)
        } else if (state === '1') {
            console.log('Complete order:', order)
        } else {
            console.error('Invalid State')
            return
        }
        try {
            await sendCompleteRequest(completeMessage)
            await sendLogRequest(logMessage)
        } catch (error) {
            console.error('Error in handleComplete:', error)
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
            await sendQueryRequest(queryMessage) // Added await
        } catch (error) {
            console.error('Error in handleQuery:', error) // Added error handling
        }
    }

    useEffect(() => {
        handleQuery()
            .then(() => {
                // Handle any post-request actions here
            })
            .catch(error => {
                console.error('Error in handleComplete:', error) // Added error handling
            })
    }, [])

    const groupedOrders = groupBy === 'dish' ? groupByDish(orders) : groupByCustomer(orders);
    return (
        <Container style={{height: '70vh', width: '1000px'}}>
            <Box
                style={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'white', // 确保背景色与容器相同或根据需要设置
                    zIndex: 1000, // 确保标题部分在其他内容之上
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '10px', // 根据需要添加内边距
                    marginBottom: '20px', // 与下方内容保持一定距离
                }}
            >
            <Typography variant="h4">厨师页面</Typography>
                <Button variant="contained" onClick={() => setGroupBy(prev => prev === 'dish' ? 'customer' : 'dish')}>
                    {groupBy === 'dish' ? 'Group by Customer' : 'Group by Dish'}
                </Button>
            </Box>
            <Grid container rowSpacing={2} columnSpacing={2}>
                {Object.keys(groupedOrders).map((key) => (
                    <Grid item xs={12} sm={6} md={4}  key={key} style={{justifyContent:'space-around'}}>
                        <Card style={{ height: '300px', width:'300px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
                            <CardContent style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', overflowY: 'auto' }}>
                                <Typography variant="h6">
                                    {groupBy === 'dish' ? `Dish: ${key}` : `Customer: ${key}`}
                                </Typography>
                                {groupedOrders[key].map(order => (
                                    <Box key={order.id} my={1} display="flex" justifyContent="space-between" alignItems="center">
                                        <ListItemText
                                            primary={groupBy === 'dish' ? `from: ${order.customer}` : `· ${order.dish}`}
                                        />
                                        <IconButton onClick={() => handleComplete(order, "1")}>
                                            <CheckIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleComplete(order, "0")}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box
                display="flex"
                justifyContent="space-evenly"
                alignItems="center"
            >
                <Button variant="contained" color="primary" onClick={handleQuery} style={{ margin: '20px' }}>
                    刷新
                </Button>
                <Button color="secondary" onClick={() => {
                    history.push('/')
                }} style={{ margin: '20px' }}>
                    返回主页
                </Button>
            </Box>
        </Container>
    )
}

export default ChefPage
