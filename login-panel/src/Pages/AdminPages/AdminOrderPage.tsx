import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Button, Typography, Container, Box, ListItem, ListItemText, Paper } from '@mui/material'
import axios from 'axios'
import { AdminQueryMessage } from 'Plugins/AdminAPI/AdminQueryMessage'
import { List } from 'antd'
import { makeStyles } from '@material-ui/core/styles'

interface finishedOrder{
    chefName: string,
    customerName: string,
    dishName: string,
    quantity: number,
    state: string
}

export function AdminOrderPage(){
    const history=useHistory()
    const [finishedOrders, setFinishedOrders] = useState<finishedOrder[]>([])
    const [groupedOrders, setGroupedOrders] = useState<{ [customerName: string]: finishedOrder[] }>({});

    const parseOrders = (data: string): finishedOrder[] => {
        return data.trim().split('\n').map(order => {
            const orderParts = order.split(',');
            const chefName = orderParts[0].split(':')[1].trim();
            const customerName = orderParts[1].split(':')[1].trim();
            const dishName = orderParts[2].split(':')[1].trim();
            const quantity = parseInt(orderParts[3].split(':')[1].trim(), 10);
            const state = orderParts[4].split(':')[1].trim();

            return {
                chefName,
                customerName,
                dishName,
                quantity,
                state
            };
        });
    };

    const groupOrdersByCustomer = (orders: finishedOrder[]) => {
        return orders.reduce((acc, order) => {
            const customerOrders = acc[order.customerName] || [];
            customerOrders.push(order);
            acc[order.customerName] = customerOrders;
            return acc;
        }, {} as { [customerName: string]: finishedOrder[] });
    };

    const sendAdminQuery = async (message: AdminQueryMessage) => {
        try{
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response.status)
            console.log(response.data)
            const ordersArray = parseOrders(response.data)
            const groupedOrders = groupOrdersByCustomer(ordersArray)
            setFinishedOrders(ordersArray)
            setGroupedOrders(groupedOrders)
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

    useEffect(() => {
        handleAdminQuery()
        .then(() => {

        })
        .catch(error => {
            console.error('Error in handleComplete:', error) // Added error handling
        })
    }, [])

    return (
        <Container style={{ maxHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box style = {{position: 'sticky',
                top: 0,
                backgroundColor: 'white', // 确保背景色与容器相同或根据需要设置
                zIndex: 1000, // 确保标题部分在其他内容之上
                display: 'flex',
                justifyContent: 'center',
                padding: '20px', // 根据需要添加内边距
                margin: '10px', // 与下方内容保持一定距离
            }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    订单管理页面
                </Typography>
            </Box>
            <Box>
                {Object.entries(groupedOrders).map(([customerName, orders]) => (
                    <Paper key={customerName} style={{ margin: '20px', padding: '10px'}}>
                        <Typography variant="h6">{customerName}</Typography>
                        <List>
                            {orders.map((order, index) => (
                                <ListItem key={index} divider>
                                    <ListItemText
                                        primary={`Dish: ${order.dishName} x ${order.quantity}`}
                                        secondary={`State: ${order.state} Chef: ${order.chefName}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                ))}
            </Box>
            <Box display="flex" flexDirection="column" alignItems="stretch" mt={2} className="button-container">
                <Button color="primary" onClick={handleAdminQuery}>
                    刷新
                </Button>
                <Box display="flex" mt={2} className="button-container">
                    <Button color="secondary" onClick={() => {history.push('/admin')}}>
                        返回
                    </Button>
                    <Button color="secondary" onClick={() => {history.push('/')}}>
                        主页
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}
