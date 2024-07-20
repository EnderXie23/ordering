import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    ListItemText,
    TextField,
    Typography,
} from '@mui/material'
import { makeStyles } from '@material-ui/core/styles'
import axios, { isAxiosError } from 'axios'
import { QueryMessage } from 'Plugins/ChefAPI/QueryMessage'
import { CompleteMessage } from 'Plugins/ChefAPI/CompleteMessage'
import { useChef } from '../ChefContext'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { Select } from 'antd'
import { RejectMessage } from 'Plugins/ChefAPI/RejectMessage'
import backgroundImage from 'Images/background.png'
import { decodeFinishState, FinishState } from 'Pages/enums'

interface Order {
    customer: string;
    dish: string;
    quantity: number;
    orderID: number;
    orderPart: number;
    state: FinishState;
}

interface OrderDesp {
    customerName: string;
    chefName: string;
    dishName: string;
    orderCount: string;
    state: FinishState
    orderID: string;
    orderPart: string;
}

interface RejectDesp {
    customerName: string;
    chefName: string;
    dishName: string;
    orderCount: string;
    orderID: string;
    orderPart: string;
    reason: string;
}

interface TransferDesp {
    customerName: string;
    chefName: string;
    dishName: string;
    orderCount: string;
    state: { [key: string]: any };
    orderID: string;
    orderPart: string;
}

const parseOrders = (data: TransferDesp[]): Order[] => {
    return data.map(order => {
        const orderID = parseInt(order.orderID, 10);
        const orderPart = parseInt(order.orderPart, 10);
        const customer = order.customerName;
        const dish = order.dishName;
        const quantity = parseInt(order.orderCount, 10);
        const stateKey = order.state && Object.keys(order.state)[0]
        const state = FinishState[stateKey as keyof typeof FinishState];

        return {
            customer,
            dish,
            quantity,
            orderID,
            orderPart,
            state,
        };
    }).filter(order => order.state === FinishState.Processing);
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
    const [rejectLogOpen, setRejectLogOpen] = useState(false)
    const [rejectReason, setRejectReason] = useState('')
    const groupedOrders : Record<string, Order[]> = groupBy === 'dish' ? groupByDish(orders) :
        groupBy === 'customer' ? groupByCustomer(orders) : groupByOrderID(orders)
    const [orderToReject, setOrderToReject] = useState<Order>({
        customer: '',
        dish: '',
        quantity: 0,
        orderID: 0,
        orderPart: 0,
        state: FinishState.Processing,
    })

    const sendCompleteRequest = async (message: CompleteMessage) => {
        try {
            const response1 = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response1.data)
            await handleQuery()
        } catch (error) {
            console.error('Error completing order:', error)
        }
    }

    const handleComplete = async (order: Order, state: FinishState) => {
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
        if (state === FinishState.Rejected) {
            console.log('Reject order:', order)
        } else if (state === FinishState.Done) {
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
            setOrders(parseOrders(response.data))
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

    const handleRejectLog = async (rejectDesp: RejectDesp) => {
        const rmessage = new RejectMessage(rejectDesp);
        try {
            const response2 = await axios.post(rmessage.getURL(), JSON.stringify(rmessage), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response2.data)
        } catch (error) {
            if (isAxiosError(error)) {
                console.warn("The above error message is probably due to simultaneous response handling. You may proceed with ordering.")
            }else{
                console.error('Error logging reject:', error)
            }
        }
    }

    const useStyles = makeStyles((theme) => ({
        container: {
            height: '100%',
            overflowY:'auto'
        },
        grid: {
            overflowY: 'auto',
            overflowX: 'hidden'
        },
        box: {
            backgroundColor: 'transparent', // 确保背景色与容器相同或根据需要设置
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
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
        },
    }));
    const classes = useStyles();

    useEffect(() => {
        handleQuery()
            .catch(error => {
                console.error('Error in handleQuery:', error) // Added error handling
            })
    }, [])

    return (
        <div className='root' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Box className='cover' />
            <Box className='main-box' sx={{
                display: 'flex',
                alignItems: 'stretch',
                margin:'16px',
                maxHeight:'90%',
                width:'80%',
                overflowY: 'auto'
            }}>
                <Container className={classes.container}>
                    <Box className={classes.box}>
                        <Typography variant="h4" sx={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginBottom: '1rem'
                        }}>
                            厨师{ chefName }，您好！
                        </Typography>
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
                        <Box className={classes.grid} display="flex" alignItems="center" justifyContent="center" height="400px" width="100%">
                            <Typography variant="h6" align="center">No orders available</Typography>
                        </Box>
                    ) : (
                        <Grid container rowSpacing={2} columnSpacing={2} className={classes.grid}>
                            {Object.keys(groupedOrders).map((key) => (
                                <Grid item xs={12} sm={6} md={4} key={key}>
                                    <Card className={classes.card}>
                                        <CardHeader style={{paddingBottom:0}}
                                            title={
                                                <Typography style={{fontFamily: 'Merriweather', fontSize: '1.5rem'}}>
                                                    {groupBy === 'dish' ? `Dish: ${key}` : groupBy === 'customer' ? `Customer: ${key}` : `OrderID: ${key}`}
                                                </Typography>
                                            } />
                                        <CardContent className={classes.cardContent}>
                                            {groupedOrders[key]
                                                .map((order) => (
                                                    <Box my={1} display="flex" justifyContent="stretch" alignItems="center" key={order.orderID + '-' + order.orderPart}>
                                                        <ListItemText
                                                            primary={groupBy === 'dish' ? `from: ${order.customer} x${order.quantity}` : `· ${order.dish} x${order.quantity}`}
                                                            secondary={(groupBy === 'orderID' ? `Customer: ${order.customer}` : `OrderID: ${order.orderID}`) + `, OrderPart: ${order.orderPart}`}
                                                        />
                                                        <Box className={classes.actionBox}>
                                                            <IconButton onClick={() => handleComplete(order, FinishState.Done)}>
                                                                <CheckIcon />
                                                            </IconButton>
                                                            <IconButton onClick={() => {
                                                                setOrderToReject(order)
                                                                setRejectLogOpen(true)
                                                            }}>
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
                    <Box className={classes.box} style={{padding:0, margin:0}}>
                        <Button variant="contained" className='button' onClick={handleQuery} style={{ margin: '20px' }}>
                            刷新
                        </Button>
                        <Button color="secondary" onClick={() => history.push('/')}
                                style={{ margin: '20px', textTransform: 'none', fontWeight: 'bold' }}>
                            返回主页
                        </Button>
                    </Box>
                    {/*  Dialog for input reject reason  */}
                    <Dialog open={rejectLogOpen}>
                        <DialogTitle id="reject-reason-dialog" color="error">
                            <Typography align="center" style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                marginBottom: '1rem'
                            }}>
                                拒绝订单
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Typography>为客户服务，是我们的宗旨！如果你的确想要拒绝该订单，请填写原因。</Typography>
                            <Typography mt={2}>
                                订单信息：
                                顾客名称：{orderToReject.customer}, 菜品：{orderToReject.dish}, 数量：{orderToReject.quantity}.
                            </Typography>
                            <Typography mt={2} style={{fontWeight:'bold'}}>输入您拒绝订单的原因:</Typography>
                            <Box
                                component="form"
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    mt: 2,
                                }}
                            >
                                <TextField
                                    type="text"
                                    value={rejectReason}
                                    label="拒绝原因"
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {setRejectLogOpen(false)}} color="secondary"
                                    sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                                取消
                            </Button>
                            <Button onClick={async () => {
                                await handleComplete(orderToReject, FinishState.Rejected);
                                await handleRejectLog({
                                    customerName: orderToReject.customer,
                                    chefName: chefName,
                                    dishName: orderToReject.dish,
                                    orderCount: orderToReject.quantity.toString(),
                                    orderID: orderToReject.orderID.toString(),
                                    orderPart: orderToReject.orderPart.toString(),
                                    reason: rejectReason,
                                });
                                setRejectLogOpen(false);
                            }} className='button' variant="contained">
                                确认拒绝订单
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </div>
    )
}

export default ChefPage
