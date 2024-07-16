import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import {
    Button,
    Typography,
    Container,
    Box,
    ListItem,
    ListItemText,
    Paper,
    List,
    FormControlLabel,
    Switch } from '@mui/material'
import axios from 'axios'
import { AdminQueryMessage } from 'Plugins/AdminAPI/AdminQueryMessage'
import { QueryRejectLogMessage } from 'Plugins/AdminAPI/QueryRejectLogMessage'

interface finishedOrder{
    chefName: string,
    customerName: string,
    dishName: string,
    quantity: number,
    price: number,
    state: string
    orderID: string
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
    state: string,
    rating: string
}

function parseOrders(logInfos: LogInfo[]): finishedOrder[] {
    return logInfos
        .filter(logInfo => logInfo.chefName != 'admin')
        .map(logInfo => ({
            chefName: logInfo.chefName,
            customerName: logInfo.userName,
            dishName: logInfo.dishName,
            quantity: parseInt(logInfo.quantity),
            price: parseFloat(logInfo.price),
            state: logInfo.state,
            rating: parseFloat(logInfo.rating),
            orderID: logInfo.orderid,
            orderPart: logInfo.orderPart
        }));
}

export function AdminOrderPage(){
    const history=useHistory()
    const [groupedOrdersByCustomer, setGroupedOrdersByCustomer] = useState<{ [customerName: string]: finishedOrder[] }>({});
    const [groupedOrdersByOrderID, setGroupedOrdersByOrderID] = useState<{ [orderID: string]: finishedOrder[] }>({});
    const [groupByCustomer, setGroupByCustomer] = useState(false); // State for grouping method
    const [income, setIncome] = useState(0); // State for total income

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
            setIncome(ordersArray.filter(order => order.state !== 'rejected')
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

    useEffect(() => {
        handleAdminQuery()
        .catch(error => {
            console.error('Error in handleComplete:', error) // Added error handling
        })
    }, [])

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGroupByCustomer(event.target.checked);
    };

    return (
        <Container style={{
            maxHeight: '100vh',
        }}>
            <Box style = {{position: 'sticky',
                top: 0,
                backgroundColor: 'white', // 确保背景色与容器相同或根据需要设置
                zIndex: 1000, // 确保标题部分在其他内容之上
                display: 'flex',
                justifyContent: 'center',
                padding: '20px', // 根据需要添加内边距
                margin: '10px', // 与下方内容保持一定距离
            }}>
                <Typography variant="h4" component="h1" align="center">
                    订单管理页面：总收入{income.toFixed(2)}元！
                </Typography>
            </Box>
            <Box style={{
                position: 'sticky',
                top: 40, // Adjust based on your header height
                zIndex: 500,
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'center',
                padding: '10px'
            }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={groupByCustomer}
                            onChange={handleSwitchChange}
                            name="groupByCustomer"
                            color="primary"
                        />
                    }
                    label="Group by Customer"
                />
            </Box>
            <Box style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {groupByCustomer ? (
                    Object.entries(groupedOrdersByCustomer).map(([customerName, orders]) => (
                        <Paper key={customerName} style={{ margin: '20px', padding: '10px' }}>
                            <Typography variant="h6">{customerName}</Typography>
                            <List>
                                {orders.map((order, index) => (
                                    <ListItem key={index} divider>
                                        <ListItemText
                                            primary={`Dish: ${order.dishName} x ${order.quantity}`}
                                            secondary={`Price: ${order.price} State: ${order.state} Chef: ${order.chefName}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    ))
                ) : (
                    Object.entries(groupedOrdersByOrderID).sort(([a], [b]) => b.localeCompare(a)).map(([orderID, orders]) => (
                        <Paper key={orderID} style={{ margin: '20px', padding: '10px' }}>
                            <Typography variant="h6">Order ID: {orderID}, 总价: {orders
                                .filter(order => order.state !== "rejected")
                                .reduce((total, order) => total + (order.price * order.quantity), 0)}, 退款: {orders
                                .filter(order => order.state == 'rejected')
                                .reduce((tot, order) => tot + (order.price * order.quantity), 0)}
                            </Typography>
                            <List>
                                {orders.map((order, index) => (
                                    <ListItem key={index} divider>
                                        <ListItemText
                                            primary={`Dish: ${order.dishName} x ${order.quantity}`}
                                            secondary={`Price: ${order.price} State: ${order.state} Chef: ${order.chefName} Customer: ${order.customerName}`}
                                            sx={{ color: order.state === 'rejected' ? 'red' : 'inherit' }}
                                        />
                                        {order.state == 'rejected' &&
                                            <Button onClick={async () => {
                                                const reason = await handleRejectLogQuery(order.dishName, order.orderID, order.orderPart);
                                                alert(reason);
                                            }}>查看退款原因</Button>
                                        }
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    ))
                )}
            </Box>
            <Box display="flex" flexDirection="column" alignItems="stretch" mt={1} className="button-container">
                <Button color="primary" onClick={handleAdminQuery}>
                    刷新
                </Button>
                <Box display="flex" mt={1} className="button-container">
                    <Button color="secondary" onClick={() => {history.push('/admin')}}>
                        返回上一级
                    </Button>
                    <Button color="secondary" onClick={() => {history.push('/')}}>
                        主页
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}
