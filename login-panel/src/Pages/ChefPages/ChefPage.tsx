import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { Grid, Button, Card, CardHeader ,CardContent, Typography, ListItemText, Container, Box, IconButton } from '@mui/material'
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'
import { QueryMessage } from 'Plugins/ChefAPI/QueryMessage'
import { CompleteMessage } from 'Plugins/ChefAPI/CompleteMessage'
import { LogMessage } from 'Plugins/ChefAPI/LogMessage'
import { useChef } from '../ChefContext';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';


interface Order {
    id: number;
    customer: string;
    dish: string;
    quantity: number;
    state: string;
}

function parseOrders(input: string): { waitingOrders: Order[], otherOrders: Order[] } {
    const strings = input.split('\n')
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

    // console.log(orders); // for output
    return {waitingOrders, otherOrders}
}

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
            setOrders(parseOrders(response.data).waitingOrders)
            //console.log(parseOrders(response.data).waitingOrders)
            //console.log(orders)
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

    const useStyles = makeStyles((theme) => ({
        container: {
            height: '80vh',
            width: '1000px',
        },
        grid: {
            overflowY: 'auto',
        },
        box: {
            position: 'sticky',
            top: 0,
            backgroundColor: 'white', // 确保背景色与容器相同或根据需要设置
            zIndex: 1000, // 确保标题部分在其他内容之上
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '10px', // 根据需要添加内边距
            marginBottom: '20px', // 与下方内容保持一定距离
        },
        actionBox: {
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        card: {
            height: '300px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginBottom: theme.spacing(1),
        },
        cardContent: {
            width: '90%',
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
        },
    }));
    const classes = useStyles();

    const groupedOrders = groupBy === 'dish' ? groupByDish(orders) : groupByCustomer(orders);
    return (
        <Container className={classes.container}>
            <Box className={classes.box}>
            <Typography variant="h4">厨师{ chefName }，您好！</Typography>
                <Button variant="contained" onClick={() => setGroupBy(prev => prev === 'dish' ? 'customer' : 'dish')}>
                    {groupBy === 'dish' ? '按顾客分类' : '按菜品分类'}
                </Button>
            </Box>
            {Object.keys(groupedOrders).length === 0 ? (
                <Box className={classes.grid} display="flex" alignItems="center" justifyContent="center" height="400px" width="1000px">
                    <Typography variant="h6" align="center">No orders available</Typography>
                </Box>
            ) : (
                <Grid container rowSpacing={2} columnSpacing={2} className={classes.grid}>
                    {Object.keys(groupedOrders).map((key) => (
                        <Grid item xs={12} sm={6} md={4} key={key}>
                            <Card className={classes.card}>
                                <CardHeader title={groupBy === 'dish' ? `Dish: ${key}` : `Customer: ${key}`} />
                                <CardContent className={classes.cardContent}>
                                    {groupedOrders[key]
                                        .filter((order) => order.state === 'waiting')
                                        .map((order) => (
                                            <Box key={order.id} my={1} display="flex" justifyContent="stretch" alignItems="center">
                                                <ListItemText
                                                    primary={groupBy === 'dish' ? `from: ${order.customer} x${order.quantity}` : `· ${order.dish} x${order.quantity}`}
                                                />
                                                <Box className={classes.actionBox}>
                                                    <IconButton onClick={() => handleComplete(order, '1')}>
                                                        <CheckIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleComplete(order, '0')}>
                                                        <CloseIcon />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        ))}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    {Object.keys(groupedOrders).length < 3 &&
                        [...Array(3 - Object.keys(groupedOrders).length)].map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} key={`empty-${index}`}>
                                <Card
                                    style={{
                                        height: '300px',
                                        width: '300px',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-evenly',
                                        alignItems: 'left',
                                        marginBottom: 4,
                                        visibility: 'hidden',
                                    }}
                                />
                            </Grid>
                        ))}
                </Grid>
            )}
            <Box className={classes.box}>
                <Button variant="contained" color="primary" onClick={handleQuery} style={{ margin: '20px' }}>
                    刷新
                </Button>
                <Button color="secondary" onClick={() => history.push('/')} style={{ margin: '20px' }}>
                    返回主页
                </Button>
            </Box>
        </Container>
    )
}

export default ChefPage
