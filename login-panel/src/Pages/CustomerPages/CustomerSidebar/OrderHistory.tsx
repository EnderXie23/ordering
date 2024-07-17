import React, { useState, useEffect } from 'react'
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
import { FinishState, getFinishStateName } from '../../enums' // Import the enum and helper function

import { makeStyles } from '@material-ui/core'

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
}))

interface OrderHistory {
    orderID: string
    orderPart: string
    dishName: string,
    quantity: number,
    price: number,
    state: FinishState
}

interface UserHistory {
    orderID: string
    orderPart: string
    dishName: string,
    quantity: number,
    price: number,
    finishState: { [key: string]: any } // Raw state from JSON as an object
}

interface HistoryProps {
    open: boolean;
    onClose: () => void;
}

const CustomerHistory: React.FC<HistoryProps> = ({ open, onClose }) => {
    const [finishedOrders, setFinishedOrders] = useState<OrderHistory[]>([])
    const [groupedOrdersByOrderID, setGroupedOrdersByOrderID] = useState<{ [orderID: string]: OrderHistory[] }>({})
    const { name } = useUser()

    const parseOrders = (data: UserHistory[]): OrderHistory[] => {
        return data.map(order => {
            const orderID = order.orderID
            const orderPart = order.orderPart
            const dishName = order.dishName
            const quantity = order.quantity
            const price = order.price
            const stateKey = order.finishState && Object.keys(order.finishState)[0] // Extract key from finishState object
            const state = FinishState[stateKey as keyof typeof FinishState]
            return {
                orderID,
                orderPart,
                dishName,
                quantity,
                price,
                state,
            }
        })
    }

    const groupOrdersByOrderID = (orders: OrderHistory[]) => {
        return orders.reduce((acc, order) => {
            const orderIDOrders = acc[order.orderID] || []
            orderIDOrders.push(order)
            acc[order.orderID] = orderIDOrders
            return acc
        }, {} as { [orderID: string]: OrderHistory[] })
    }

    const sendCustomerHistory = async (message: CustomerHistoryMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            const ordersArray = parseOrders(response.data)
            const groupedOrdersByOrderID = groupOrdersByOrderID(ordersArray)
            setFinishedOrders(ordersArray)
            setGroupedOrdersByOrderID(groupedOrdersByOrderID)
        } catch (error) {
            console.error('Error admin-querying:', error)
        }
    }

    const handleCustomerHistory = async () => {
        const customerName = name.split('\n')[0]
        const queryMessage = new CustomerHistoryMessage(customerName)
        try {
            await sendCustomerHistory(queryMessage)
        } catch (error) {
            console.error('Error in handleAdminQuery:', error)
        }
    }

    const handleCustomerHistoryClose = () => {
        onClose()
    }

    useEffect(() => {
        if (open) {
            handleCustomerHistory()
                .catch(error => {
                    console.error('Error in handleComplete:', error) // Added error handling
                })
        }
    }, [open])

    const classes = useStyles()

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogContent>
                <Box className={classes.stickyHeader}>
                    <Typography variant="h4" component="h1" align="center" gutterBottom sx={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem',
                    }}>
                        历史订单
                    </Typography>
                </Box>
                <Box style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {Object.entries(groupedOrdersByOrderID)
                        .sort(([a], [b]) => parseInt(b, 10) - parseInt(a, 10))
                        .map(([orderID, orders]) => (
                            <Paper key={orderID} className={classes.paper}>
                                <Typography variant="h6" style={{ fontFamily: 'Merriweather', fontWeight: 'bold' }}>
                                    订单号: {orderID}
                                </Typography>
                                <List>
                                    {orders.map((order, index) => (
                                        <ListItem key={index} divider>
                                            <ListItemText style={{ margin: 0, whiteSpace: 'pre' }}
                                                          primary={
                                                              <Typography component="span"
                                                                          style={{ fontFamily: 'Merriweather' }}>
                                                                  {`菜品名: ${order.dishName} x ${order.quantity}`}
                                                              </Typography>
                                                          }
                                                          secondary={`价格: ${order.price}元     状态: ${getFinishStateName(order.state)}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        ))}
                </Box>
                <Box className={classes.buttonContainer}>
                    <Button color="primary" onClick={handleCustomerHistory}
                            sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                        刷新
                    </Button>
                    <Button onClick={onClose} color="secondary" sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                        关闭
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}
export default CustomerHistory
