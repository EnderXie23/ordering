import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import {
    Button,
    Typography,
    Box,
    ListItem,
    ListItemText,
    Paper,
    List,
    Radio, RadioGroup,
    Select, DialogTitle, DialogContent, DialogActions, Dialog, FormControl, FormControlLabel
} from '@mui/material'
import axios from 'axios'
import { AdminQueryMessage } from 'Plugins/AdminAPI/AdminQueryMessage'
import { QueryRejectLogMessage } from 'Plugins/AdminAPI/QueryRejectLogMessage'
import { CustomerQueryProfileMessage, CustomerChargeMessage } from 'Plugins/CustomerAPI/CustomerProfileMessage'
import backgroundImage from 'Images/background.png'
import { FinishState, getFinishStateName, ToString } from '../enums' // Import the enum and helper function

interface finishedOrder {
    chefName: string,
    customerName: string,
    dishName: string,
    quantity: number,
    price: number,
    state: FinishState,
    orderID: string,
    orderPart: string
}

interface LogInfo {
    orderid: string,
    orderPart: string,
    userName: string,
    chefName: string,
    dishName: string,
    quantity: string,
    price: string,
    takeaway: string,
    state:  { [key: string]: any },
    rating: string
}

function parseOrders(logInfos: LogInfo[]): finishedOrder[] {
    return logInfos
        .filter(logInfo => logInfo.chefName != 'admin')
        .map(logInfo => {
            const chefName= logInfo.chefName
            const customerName= logInfo.userName
            const dishName= logInfo.dishName
            const quantity= parseInt(logInfo.quantity)
            const price= parseFloat(logInfo.price)
            const stateKey = logInfo.state && Object.keys(logInfo.state)[0] // Extract key from finishState object
            const state = FinishState[stateKey as keyof typeof FinishState]
            const orderID= logInfo.orderid
            const orderPart=logInfo.orderPart
            return{chefName,customerName,dishName,quantity,price,state,orderID,orderPart}
        });
}

export function AdminOrderPage(){
    const history=useHistory()
    const [groupedOrdersByCustomer, setGroupedOrdersByCustomer] = useState<{ [customerName: string]: finishedOrder[] }>({});
    const [groupedOrdersByOrderID, setGroupedOrdersByOrderID] = useState<{ [orderID: string]: finishedOrder[] }>({});
    const [groupByCustomer, setGroupByCustomer] = useState(false); // State for grouping method
    const [income, setIncome] = useState(0); // State for total income
    // 0 for close, 1 for reason, 2 for refund
    const [dialogOpen, setDialogOpen] = useState(0);
    const [dialogContent, setDialogContent] = useState('');

    const groupOrdersByCustomer = (orders: finishedOrder[]) => {
        return orders.reduce((acc, order) => {
            const customerOrders = acc[order.customerName] || [];
            customerOrders.push(order);
            acc[order.customerName] = customerOrders;
            return acc;
        }, {} as { [customerName: string]: finishedOrder[] });
    };

    const groupOrdersByOrderID = (orders: finishedOrder[]) => {
        return orders.reduce((acc, order) => {
            const orderIDOrders = acc[order.orderID] || [];
            orderIDOrders.push(order);
            acc[order.orderID] = orderIDOrders;
            return acc;
        }, {} as { [orderID: string]: finishedOrder[] });
    };

    const sendAdminQuery = async (message: AdminQueryMessage) => {
        try{
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            const ordersArray = parseOrders(response.data)
            const groupedOrdersByCustomer = groupOrdersByCustomer(ordersArray);
            const groupedOrdersByOrderID = groupOrdersByOrderID(ordersArray);
            console.log(ordersArray)
            setGroupedOrdersByCustomer(groupedOrdersByCustomer);
            setGroupedOrdersByOrderID(groupedOrdersByOrderID);
            setIncome(ordersArray.filter(order => order.state !== FinishState.Rejected)
                .reduce((acc, order) => {
                    return acc + (order.price * order.quantity);
                }, 0));
        } catch (error){
            console.error('Error admin-querying:', error)
        }
    }

    const handleAdminQuery = async () => {
        const queryMessage = new AdminQueryMessage()
        try {
            await sendAdminQuery(queryMessage)
        } catch (error) {
            console.error('Error in handleAdminQuery:', error)
        }
    }

    const handleRejectLogQuery = async (dishName: string, orderID: string, orderPart: string) => {
        const rmessage = new QueryRejectLogMessage(dishName, orderID, orderPart);
        try{
            const response = await axios.post(rmessage.getURL(), JSON.stringify(rmessage), {
                headers: { 'Content-Type': 'application/json' },
            })
            return response.data;
        } catch (error){
            console.error('Error rejectLog-querying:', error);
            return "No reason found.";
        }
    }

    const handleRefund = async (order: finishedOrder) => {
        const pmessage = new CustomerQueryProfileMessage(order.customerName);
        try{
            const response = await axios.post(pmessage.getURL(), JSON.stringify(pmessage), {
                headers: { 'Content-Type': 'application/json' },
            })
            const _balance = response.data.balance;
            const cmessage = new CustomerChargeMessage(order.customerName, (_balance + order.price * order.quantity).toString());
            await axios.post(cmessage.getURL(), JSON.stringify(cmessage), {
                headers: { 'Content-Type': 'application/json' },
            })
            setDialogContent('已退款' + order.price * order.quantity + '元');
            setDialogOpen(2);
        } catch (error) {
            console.error('Error refunding:', error);
            setDialogContent('退款失败');
            setDialogOpen(2);
        }
    }

    useEffect(() => {
        handleAdminQuery()
            .catch(error => {
                console.error('Error in handleComplete:', error) // Added error handling
            })
    }, [])

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGroupByCustomer(event.target.value === 'true');
    };

    return (
        <div className='root' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Box className='cover' />
            <Box className='main-box' height='90%' minWidth='40%'>
                <Box marginBottom='16px'>
                    <Typography variant="h4" component="h1" align="center" sx={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem'
                    }}>
                        订单管理页面
                    </Typography>
                    <Typography variant="h4" component="h1" align="center" fontSize='1.5rem'>
                        总收入{income.toFixed(2)}元！
                    </Typography>
                </Box>
                <Box style={{
                    zIndex: 500,
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '10px'
                }}>
                    <FormControl component="fieldset">
                        <RadioGroup
                            aria-label="group-by"
                            name="group-by"
                            value={groupByCustomer.toString()}
                            onChange={handleRadioChange}
                            row
                        >
                            <FormControlLabel value="false" control={<Radio />} label="按订单ID分类" />
                            <FormControlLabel value="true" control={<Radio />} label="按顾客分类" />
                        </RadioGroup>
                    </FormControl>
                </Box>
                <Box style={{ maxHeight: '63vh', overflowY: 'auto' }}>
                    {groupByCustomer ? (
                        Object.entries(groupedOrdersByCustomer).map(([customerName, orders]) => (
                            <Paper key={customerName} style={{ margin: '20px', padding: '10px' }}>
                                <Typography variant="h6" fontFamily='Merriweather'>{customerName}</Typography>
                                <List>
                                    {orders.map((order, index) => (
                                        <ListItem key={index} divider>
                                            <ListItemText
                                                primary={`菜品名: ${order.dishName} x ${order.quantity}`}
                                                secondary={`价格: ${order.price} 状态: ${getFinishStateName(order.state)} 厨师: ${order.chefName}`}
                                                sx={{ color: ToString(order.state) === 'rejected' ? 'red' : 'inherit' }}
                                            />
                                            {order.state == 'rejected' &&(
                                                <Box>
                                                    <Button onClick={async () => {handleRefund(order)}}
                                                            color='error' sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                                                        退款
                                                    </Button>
                                                    <Button sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                                        onClick={async () => {
                                                        const reason = await handleRejectLogQuery(order.dishName, order.orderID, order.orderPart);
                                                        setDialogContent(reason);
                                                        setDialogOpen(1);
                                                    }}>
                                                        查看拒绝原因
                                                    </Button>
                                                </Box>)
                                            }
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        ))
                    ) : (
                        Object.entries(groupedOrdersByOrderID)
                            .sort(([a], [b]) => parseInt(b, 10) - parseInt(a, 10))
                            .map(([orderID, orders]) => (
                                <Paper key={orderID} style={{ margin: '20px', padding: '10px' }}>
                                    <Typography variant="h6" fontFamily='Merriweather'>
                                        Order ID: {orderID}, 总价: {orders
                                        .filter(order => order.state !== "rejected")
                                        .reduce((total, order) => total + (order.price * order.quantity), 0)}, 退款: {orders
                                        .filter(order => order.state == 'rejected')
                                        .reduce((tot, order) => tot + (order.price * order.quantity), 0)}
                                    </Typography>
                                    <List>
                                        {orders.map((order, index) => (
                                            <ListItem key={index} divider>
                                                <ListItemText
                                                    primary={`菜品名: ${order.dishName} x ${order.quantity}`}
                                                    secondary={`价格: ${order.price} 状态: ${getFinishStateName(order.state)} 厨师: ${order.chefName} 顾客: ${order.customerName}`}
                                                    sx={{ color: ToString(order.state) === 'rejected' ? 'red' : 'inherit' }}
                                                />
                                                {order.state == 'rejected' &&(
                                                    <Box>
                                                        <Button onClick={async () => {handleRefund(order)}}
                                                                color='error' sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                                                            退款
                                                        </Button>
                                                        <Button sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                                            onClick={async () => {
                                                            const reason = await handleRejectLogQuery(order.dishName, order.orderID, order.orderPart);
                                                            setDialogContent(reason);
                                                            setDialogOpen(1);
                                                        }}>
                                                            查看拒绝原因
                                                        </Button>
                                                    </Box>)
                                                }
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                        ))
                    )}
                </Box>
                <Box display="flex" flexDirection="column" alignItems="stretch" mt={1} className="button-container">
                    <Button variant="contained" className='button' onClick={handleAdminQuery}>
                        刷新
                    </Button>
                    <Box display="flex" mt={2} justifyContent="space-between" className="button-container">
                        <Button color="secondary" onClick={() => {history.push('/admin')}}
                                sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                            返回
                        </Button>
                        <Button color="secondary" onClick={() => {history.push('/')}}
                                sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                            主页
                        </Button>
                    </Box>
                </Box>
            {/*  Dialog box  */}
                <Dialog open={dialogOpen !== 0} sx={{
                    '& .MuiDialog-paper': {
                        width: '80%',
                        maxWidth: '500px',
                        padding: '1rem',
                    }
                }}>
                    <DialogTitle id="dialog" color="warning">
                        <Typography align="center" style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginBottom: '1rem'
                        }}>
                            {dialogOpen === 1 ? '拒绝原因' : '提示'}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Typography fontSize='1.5rem'>{dialogContent}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {setDialogOpen(0)}} color="primary"
                                sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                            确定
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
    )
}
