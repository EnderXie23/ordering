import React, {useState, useEffect} from 'react';
import { useUser } from 'Pages/UserContext'

import {
    Button,
    Typography,
    Box,
    ListItem,
    ListItemText,
    Paper,
    List, Dialog, DialogContent, DialogActions,
} from '@mui/material'
import axios from 'axios'
import { CustomerHistoryMessage } from 'Plugins/CustomerAPI/CustomerHistoryMessage'


interface OrderHistory {
    orderID: string
    orderPart: string
    dishName: string,
    quantity: number,
    price: number,
    state: string
}
interface HistoryProps {
    open:boolean;
    onClose:() => void;
}
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing(3),
        textAlign: 'center',
    },
    stickyHeader: {
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        zIndex: 1000,
        padding: theme.spacing(2),
        margin: theme.spacing(1),
    },
    paper: {
        margin: theme.spacing(2),
        padding: theme.spacing(2),
    },
    buttonContainer: {
        marginTop: theme.spacing(2),
        display: 'flex',
        justifyContent: 'space-between',
    },
}));
interface UserHistory{
    orderID: string
    orderPart: string
    dishName: string,
    quantity: number,
    price: number,
    state: string
}

const CustomerHistory:React.FC<HistoryProps>=({open,onClose})=>{
    const [finishedOrders, setFinishedOrders] = useState<OrderHistory[]>([])
    const [groupedOrdersByOrderID, setGroupedOrdersByOrderID] = useState<{ [orderID: string]: OrderHistory[] }>({});
    const { name } = useUser();
    const parseOrders = (data: UserHistory[]): OrderHistory[] => {
        return data.map(order => {
            const orderID = order.orderID
            const orderPart = order.orderPart
            const dishName = order.dishName
            const quantity = order.quantity
            const price = order.price
            const state = order.state
            console.log('Parsed order:', { orderID, orderPart, dishName, quantity, price, state });
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
        console.log(name)
        const customerName = name.split('\n')[0]
        const queryMessage = new CustomerHistoryMessage(customerName)
        try {
            await sendCustomerHistory(queryMessage)
        } catch (error) {
            console.error('Error in handleAdminQuery:', error)
        }
    }

    const handleCustomerHistoryClose = () => {
        onClose();
    }

    useEffect(() => {
        if(open){
            handleCustomerHistory()
                .catch(error => {
                    console.error('Error in handleComplete:', error) // Added error handling
                })
        }
    }, [open])

    const classes = useStyles();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogContent>
                <Box className={classes.stickyHeader}>
                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                        历史订单
                    </Typography>
                </Box>
                <Box style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {Object.entries(groupedOrdersByOrderID).sort(([a], [b]) => b.localeCompare(a)).map(([orderID, orders]) => (
                        <Paper key={orderID} className={classes.paper}>
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
                <Box className={classes.buttonContainer}>
                    <Button color="primary" onClick={handleCustomerHistory}>
                        刷新
                    </Button>
                    <Box>
                        <Button color="secondary">返回</Button>
                        <Button color="secondary">主页</Button>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    关闭
                </Button>
            </DialogActions>
        </Dialog>
    );
}
    export default CustomerHistory;