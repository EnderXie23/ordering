import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import {
    Collapse,
    List,
    Button,
    Container,
    ListItem,
    ListItemText,
    Box,
    ListSubheader,
    Typography,
} from '@mui/material'
import { AdminQueryMessage } from 'Plugins/AdminAPI/AdminQueryMessage'
import '../index.css'
import axios from 'axios'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import backgroundImage from 'Images/background.png'
import { FinishState } from 'Pages/enums'

interface finishedOrder {
    chefName: string,
    customerName: string,
    dishName: string,
    quantity: number,
    price: number,
    state: FinishState,
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
    state: { [key: string]: any },
    rating: string
}


function parseOrders(logInfos: LogInfo[]): finishedOrder[] {
    return logInfos
        .filter(logInfo => logInfo.chefName != 'admin')
        .map(logInfo => {
            const chefName=logInfo.chefName
            const customerName= logInfo.userName
            const dishName= logInfo.dishName
            const quantity= parseInt(logInfo.quantity)
            const price= parseFloat(logInfo.price)
            const stateKey = logInfo.state && Object.keys(logInfo.state)[0] // Extract key from finishState object
            const state = FinishState[stateKey as keyof typeof FinishState]
            const rating= parseFloat(logInfo.rating)
            return{chefName,customerName,dishName,quantity,price,state,rating}
        });
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

    const calculateChefRating = (logInfos: finishedOrder[]) => {
        const chefData: { [key: string]: { total: number; done: number; rejected: number; ratings: number[] } } = {}
        logInfos.forEach(log => {
            const chef = log.chefName
            const rating = log.rating
            if (!chefData[chef]) {
                chefData[chef] = { total: 0, done: 0, rejected: 0, ratings: [] }
            }
            chefData[chef].total += 1
            if (log.state === FinishState.Done) {
                chefData[chef].done += 1
            } else if (log.state === FinishState.Rejected) {
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
        console.log(updatedChefCounts);
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
            calculateChefRating(ordersArray)
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
        handleAdminQuery()
            .catch(error => {
                console.error('Error in handleComplete:', error) // Added error handling
            })
    }, [])

    return (
        <div className='root' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Box className='cover' />
            <Box className='main-box' height='90%' >
                <Typography variant="h4" component="h1" align="center" gutterBottom sx={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem'
                }}>
                    厨师概况
                </Typography>
                <List style={{ width: '70vw', maxWidth: '1000px', overflowY: 'auto', height: '88%' }}>
                    {Object.keys(chefCounts).filter(chef => chef != '')
                        .map((chef) => (
                            <React.Fragment key={chef}>
                                <ListItem button onClick={() => handleClick(chef)}>
                                    <ListItemText
                                        primary={`${chef}：已完成${chefCounts[chef].total}道菜，平均评分：` + (chefCounts[chef].rating === 0 ? 'N/A' : chefCounts[chef].rating.toFixed(2))}
                                        secondary={`Done: ${chefCounts[chef].done}, Rejected: ${chefCounts[chef].rejected}`}
                                    />
                                    {open[chef] ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                <Collapse in={open[chef]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {groupedOrders[chef].map((order, index) => (
                                            <ListItem key={index} sx={{ pl: 4 }}>
                                                <ListItemText
                                                    primary={
                                                        <Typography fontFamily='Merriweather'>{`${order.dishName}: ${order.quantity}`}</Typography>
                                                    }
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
        </div>
    )
}
