import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Collapse, List, Button, Container, ListItem, ListItemText, Box, ListSubheader } from '@mui/material'
import { AdminQueryMessage } from 'Plugins/AdminAPI/AdminQueryMessage'
import '../index.css'
import axios from 'axios'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

interface finishedOrder {
    chefName: string,
    customerName: string,
    dishName: string,
    quantity: number,
    price: number,
    state: string,
    rating: number,
}

interface ChefInfo {
    total: number;
    done: number;
    rejected: number;
    rating: number;
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
        }))
}

export function ChefRatingPage() {
    const history = useHistory()
    const [groupedOrders, setGroupedOrders] = useState<{ [chefName: string]: finishedOrder[] }>({})
    const [chefCounts, setChefCounts] = useState<{ [chefName: string]: ChefInfo }>({})
    const [open, setOpen] = useState<{ [chefName: string]: boolean }>({})

    const groupOrdersByChef = (orders: finishedOrder[]) => {
        return orders.reduce((acc, order) => {
            const customerOrders = acc[order.chefName] || []
            customerOrders.push(order)
            acc[order.chefName] = customerOrders
            return acc
        }, {} as { [chefName: string]: finishedOrder[] })
    }

    const calculateChefRating = (logInfos: LogInfo[]) => {
        const chefData: { [key: string]: { total: number; done: number; rejected: number; ratings: number[] } } = {}
        logInfos.forEach(log => {
            const chef = log.chefName
            const rating = parseFloat(log.rating)
            if (!chefData[chef]) {
                chefData[chef] = { total: 0, done: 0, rejected: 0, ratings: [] }
            }
            chefData[chef].total += 1
            if (log.state === 'completed') {
                chefData[chef].done += 1
            } else if (log.state === 'rejected') {
                chefData[chef].rejected += 1
            }
            if (rating != 0) {
                chefData[chef].ratings.push(rating)
            }
        })
        const updatedChefCounts: { [chefName: string]: ChefInfo } = {}
        for (const chef in chefData) {
            const data = chefData[chef]
            const sumRatings = data.ratings.reduce((acc, rating) => acc + rating, 0)
            const averageRating = data.ratings.length > 0 ? sumRatings / data.ratings.length : 0
            updatedChefCounts[chef] = {
                total: data.total,
                done: data.done,
                rejected: data.rejected,
                rating: averageRating,
            }
        }
        setChefCounts(updatedChefCounts)
    }

    const sendAdminQuery = async (message: AdminQueryMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            const ordersArray = parseOrders(response.data)
            const groupedOrders = groupOrdersByChef(ordersArray)
            setGroupedOrders(groupedOrders)
            calculateChefRating(response.data)
            console.log(ordersArray)
        } catch (error) {
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

    const handleClick = (chef: string) => {
        setOpen(prevOpen => ({ ...prevOpen, [chef]: !prevOpen[chef] }))
    }

    useEffect(() => {
        const counts: { [chefName: string]: ChefInfo } = {}
        for (const chef in groupedOrders) {
            const orders = groupedOrders[chef]
            counts[chef] = {
                total: orders.reduce((acc, order) => acc + order.quantity, 0),
                done: orders.reduce((acc, order) => acc + (order.state === 'done' ? order.quantity : 0), 0),
                rejected: orders.reduce((acc, order) => acc + (order.state === 'rejected' ? order.quantity : 0), 0),
                rating: 0,
            }
        }
        setChefCounts(counts)
    }, [groupedOrders])

    useEffect(() => {
        handleAdminQuery()
            .catch(error => {
                console.error('Error in handleComplete:', error) // Added error handling
            })
    }, [])

    return (
        <Container
            sx={{
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
            }}
        >
            <List
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Chefs and Their Completed Dishes
                    </ListSubheader>
                }
                style={{ width: '70vw', maxWidth: '1000px' }}
            >
                {Object.keys(chefCounts).filter(chef => chef != '')
                    .map((chef) => (
                        <React.Fragment key={chef}>
                            <ListItem button onClick={() => handleClick(chef)}>
                                <ListItemText
                                    primary={`${chef}: ${chefCounts[chef].total} dishes, Ave. Rating: ` + (chefCounts[chef].rating === 0 ? 'N/A' : chefCounts[chef].rating.toFixed(2))}
                                    secondary={`Done: ${chefCounts[chef].done}, Rejected: ${chefCounts[chef].rejected}`}
                                />
                                {open[chef] ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={open[chef]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {groupedOrders[chef].map((order, index) => (
                                        <ListItem key={index} sx={{ pl: 4 }}>
                                            <ListItemText
                                                primary={`${order.dishName}: ${order.quantity}`}
                                                secondary={`State: ${order.state}, Customer: ${order.customerName}`}
                                                sx={{ color: order.state === 'rejected' ? 'red' : 'inherit' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </React.Fragment>
                    ))}
            </List>
            <Box display="flex" mt={2} className="button-container">
                <Button color="secondary" onClick={() => {
                    history.push('/admin')
                }}>
                    返回
                </Button>
                <Button color="secondary" onClick={() => {
                    history.push('/')
                }}>
                    主页
                </Button>
            </Box>
        </Container>
    )
}
