import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { useUser } from 'Pages/UserContext'
import { CustomerOrderMessage } from 'Plugins/CustomerAPI/CustomerOrderMessage'
import { OrderLogMessage } from 'Plugins/AdminAPI/OrderLogMessage'
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
import { Add, Remove } from '@mui/icons-material'
import { OrderIDMessage } from 'Plugins/AdminAPI/OrderIDMessage'
import CustomerSidebar from './CustomerSidebar/CustomerSidebar'
import { CustomerChargeMessage } from 'Plugins/CustomerAPI/CustomerProfileMessage'
import ChatPanel from 'Plugins/CommonUtils/ChatPanel'
import { DishQueryMessage } from 'Plugins/AdminAPI/AdminDishMessage'
import 'Pages/index.css'

type Dish = {
    name: string;
    path: string;
    price: string;
};

let dishes: Dish[] = [
    { name: 'Spaghetti Carbonara', path: 'spaghetti_carbonara.jpg', price: '125' },
    { name: 'Margherita Pizza', path: 'margherita_pizza.jpg', price: '100' },
    { name: 'Caesar Salad', path: 'caesar_salad.jpg', price: '25' },
    { name: 'Tiramisu', path: 'tiramisu.jpg', price: '50' },
]

interface LogInfo {
    orderid: string,
    orderPart: string,
    userName: string,
    chefName: string,
    dishName: string,
    quantity: string,
    price: string,
    takeaway: string,
    state: string,
    rating: string
}

const OrderingPage: React.FC = () => {
    const { name, OrderID, updateOrderID, OrderPart,
        incrementOrderPart, balance, setOrderedDishes, service } = useUser()
    const customerName = name.split('\n')[0]
    const nickName = name.split('\n')[1]
    const history = useHistory()

    const [orderCounts, setOrderCounts] = useState<{ [key: string]: number }>({})

    const parseDishes = (data: string): Dish[] => {
        return data.split('\n').map(line => {
            const [name, path, price] = line.split(',')
            return { name, path, price }
        })
    }

    const readDishesInfo = async () => {
        const qmessage = new DishQueryMessage()
        try {
            const response = await axios.post(qmessage.getURL(), JSON.stringify(qmessage), {
                headers: { 'Content-Type': 'application/json' },
            })
            dishes = parseDishes(response.data)
        } catch (error) {
            console.error('Error querying dishes:', error)
        }
    }

    const calculateTotalCost = () => {
        return dishes.reduce((total, dish) => {
            const count = orderCounts[dish.name] || 0
            return total + count * parseFloat(dish.price)
        }, 0).toFixed(2)
    }

    const handleCountChange = (dishName: string, count: number) => {
        if (count < 0)
            return
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
            .map(([dishName, count]) => [dishName, count.toString(), dishes.find(dish => dish.name === dishName)?.price, takeout])
        // Send each order separately
        orders.forEach(order => {
            const log: LogInfo = {
                orderid: OrderID,
                orderPart: OrderPart,
                userName: customerName,
                chefName: '',
                dishName: order[0],
                quantity: order[1],
                price: order[2],
                takeaway: order[3],
                state: '3',
                rating: '0'
            }
            const logMessage = new OrderLogMessage(log)
            try {
                sendOrderLogRequest(logMessage)
            } catch (error) {
                console.error('Error in handleLog:', error)
            }
        })
    }

    const sendOrderIDRequest = async (message: OrderIDMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response.status)
            console.log("Setting OrderID to: ", response.data)
            updateOrderID(response.data)
            incrementOrderPart()
        } catch (error) {
            console.error('Error querying order:', error)
        }
    }

    const sendChargeRequest = async (amount: string) => {
        const cmessage = new CustomerChargeMessage(name.split('\n')[0], (balance - Number(parseFloat(amount))).toString())
        try {
            const response = await axios.post(cmessage.getURL(), JSON.stringify(cmessage), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log('charge -' + amount)
            console.log(response.data)
        } catch (error) {
            console.error('Error querying order:', error)
        }
    }

    const handleOrderID = async () => {
        if (OrderID=='') {
            const queryMessage = new OrderIDMessage('0')
            try {
                await sendOrderIDRequest(queryMessage)
            } catch (error) {
                console.error('Error in handleQuery:', error)
            }
        }
    }

    const getImagePath = (path: string): string => {
        try {
            return require(`../../Images/${path}`).default
        } catch (error) {
            return require(`../../Images/default.jpg`).default
        }
    }

    useEffect(() => {
        readDishesInfo()
        handleOrderID()
            .catch(error => {
                console.error('Error in handleComplete:', error)
            })
    }, [])
    const takeout = service.toString();

    const handleSubmit = () => {
        if (Number(parseFloat(calculateTotalCost())) > balance) {
            alert('You have not enough money!')
            return
        }

        const orders = Object.entries(orderCounts)
            .filter(([, count]) => count > 0)
            .map(([dishName, count]) => [dishName, count.toString(), dishes.find(dish => dish.name === dishName)?.price, takeout])
        if (orders.length >0){
            console.log('Customer:', customerName)
            console.log('Orders:', orders)
            console.log('OrderParts:', OrderPart)
            const orderMessage = new CustomerOrderMessage(customerName, OrderID, OrderPart, orders.map(order => order.join(',')).join(';'))
            sendChargeRequest(calculateTotalCost())
            handleOrderLog().then()
            sendOrderRequest(orderMessage)
            const formattedOrders = orders.map(order => ({
                name: order[0],
                path: dishes.find(d => d.name === order[0]).path,
                count: parseInt(order[1], 10),
                orderPart: OrderPart
            }))
            setOrderedDishes(formattedOrders)
            incrementOrderPart()
        }
        history.push('/order-summary')
    }

    return (
        <div className="content-wrap">
            <Container sx={{
                height: '100vh',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                    width: '12px',
                },
                '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: '10px',
                    border: '3px solid #f1f1f1',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#555',
                },
            }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" gutterBottom>
                        欢迎，{nickName}！请在下面点菜：
                    </Typography>
                    <CustomerSidebar />
                </Box>
                <Grid container spacing={4}>
                    {dishes.map((dish) => (
                        <Grid item xs={12} sm={6} md={4} key={dish.name}>
                            <Card style={{ maxWidth: '250px', height: '300px', justifyContent: 'center' }}>
                                <CardMedia component="img" height="140" src={getImagePath(dish.path)} alt={dish.name} />
                                <CardContent>
                                    <Typography variant="h5">{dish.name}</Typography>
                                    <Box display="flex" alignItems="center">
                                        <IconButton
                                            onClick={() => handleCountChange(dish.name, (orderCounts[dish.name] || 0) - 1)}>
                                            <Remove />
                                        </IconButton>
                                        <Typography variant="body1">{orderCounts[dish.name] || 0}</Typography>
                                        <IconButton
                                            onClick={() => handleCountChange(dish.name, (orderCounts[dish.name] || 0) + 1)}>
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
                <Box display="flex" justifyContent="center" alignItems="center" mt={4} marginBottom={2}>
                    <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6" color="primary" alignItems="center">
                            您的余额: <span style={{ fontWeight: 'bold', color: '#227aff' }}>{balance} 元</span>
                        </Typography>
                        <Typography variant="h6" color="primary" alignItems="center">
                            总价: <span
                            style={{ fontWeight: 'bold', color: '#ff5722' }}>{calculateTotalCost()} 元</span>
                        </Typography>
                    </Paper>
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    marginBottom={2}
                >
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        提交订单
                    </Button>
                    <Button color="secondary" onClick={() => {
                        history.push('/')
                    }}>
                        返回主页
                    </Button>
                </Box>
            </Container>
            <ChatPanel />
        </div>
    )
}

export default OrderingPage
