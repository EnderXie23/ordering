import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import {
    Grid,
    Button,
    Card,
    CardHeader,
    CardContent,
    Typography,
    ListItemText,
    Container,
    Box,
    IconButton,
    FormControl
} from '@mui/material'
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'
import { QueryMessage } from 'Plugins/ChefAPI/QueryMessage'
import { CompleteMessage } from 'Plugins/ChefAPI/CompleteMessage'
import { useChef } from '../ChefContext';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Select } from 'antd'

interface Order {
    customer: string;
    dish: string;
    quantity: number;
    orderID: number;
    orderPart: number;
    state: string;
}

interface OrderDesp {
    customerName: string;
    chefName: string;
    dishName: string;
    orderCount: string;
    state: string;
    orderID: string;
    orderPart: string;
}

function parseOrder(orderDesps: OrderDesp[]): Order[] {
    return orderDesps
        .filter(orderDesp => orderDesp.state === 'processing')
        .map(orderDesp => ({
        customer: orderDesp.customerName,
        dish: orderDesp.dishName,
        quantity: parseInt(orderDesp.orderCount, 10),
        orderID: parseInt(orderDesp.orderID, 10),
        orderPart: parseInt(orderDesp.orderPart, 10),
        state: orderDesp.state
    }));
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

function groupByOrderID(orders: Order[]): Record<string, Order[]> {
    return orders.reduce((acc, order) => {
        if (!acc[order.orderID.toString()]) {
            acc[order.orderID.toString()] = []
        }
        acc[order.orderID.toString()].push(order)
        return acc
    }, {} as Record<string, Order[]>)
}

const ChefPage: React.FC = () => {
    const history = useHistory()
    const [orders, setOrders] = useState<Order[]>([])
    const { chefName } = useChef();
    const [groupBy, setGroupBy] = useState<'dish' | 'customer' | 'orderID'>('dish');

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
        const orderDesp: OrderDesp = {
            customerName: order.customer,
            chefName: chefName,
            dishName: order.dish,
            orderCount: order.quantity.toString(),
            state: state,
            orderID: order.orderID.toString(),
            orderPart: order.orderPart.toString(),
        }
        const completeMessage = new CompleteMessage(orderDesp);
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
        } catch (error) {
            console.error('Error in handleComplete:', error)
        }
    }

    const sendQueryRequest = async (message: QueryMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response.data)
            setOrders(parseOrder(response.data))
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
            .catch(error => {
                console.error('Error in handleQuery:', error) // Added error handling
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

    const groupedOrders : Record<string, Order[]> = groupBy === 'dish' ? groupByDish(orders) : groupBy === 'customer' ? groupByCustomer(orders) : groupByOrderID(orders)

    return (
        <Container className={classes.container}>
            <Box className={classes.box}>
            <Typography variant="h4">厨师{ chefName }，您好！</Typography>
                <FormControl variant="outlined" style={{ width: '150px' }}>
                    <Select
                        value={groupBy}
                        onChange={(value) => setGroupBy(value as 'dish' | 'customer' | 'orderID')}
                    >
                        <Select.Option value="dish">按菜品分类</Select.Option>
                        <Select.Option value="customer">按顾客分类</Select.Option>
                        <Select.Option value="orderID">按订单ID分类</Select.Option>
                    </Select>
                </FormControl>
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
                                <CardHeader title={groupBy === 'dish' ? `Dish: ${key}` : groupBy === 'customer' ? `Customer: ${key}` : `OrderID: ${key}`} />
                                <CardContent className={classes.cardContent}>
                                    {groupedOrders[key]
                                        .map((order) => (
                                            <Box my={1} display="flex" justifyContent="stretch" alignItems="center" key={order.orderID + '-' + order.orderPart}>
                                                <ListItemText
                                                    primary={groupBy === 'dish' ? `from: ${order.customer} x${order.quantity}` : `· ${order.dish} x${order.quantity}`}
                                                    secondary={(groupBy === 'orderID' ? `Customer: ${order.customer}` : `OrderID: ${order.orderID}`) + `, OrderPart: ${order.orderPart}`}
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
