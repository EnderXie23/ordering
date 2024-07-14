import React from 'react'
import { useHistory } from 'react-router'
import { Button, Typography, Container, Box } from '@mui/material'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StarIcon from '@mui/icons-material/Star';
import '../index.css'
import { OrderHistoryMessage } from 'Plugins/AdminAPI/OrderHistoryMessage'
import axios from 'axios'

export function OrderHistory(){
    const history=useHistory()
    const sendOrderHistoryRequest = async (message: OrderHistoryMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(response.status);
            console.log(response.data);
            const { orderId } = response.data; // Assuming orderId is part of the response data
        } catch (error) {
            console.error('Error querying order:', error);
        }
    };

    const handleOrderHistory = async () => {
        const queryMessage = new OrderHistoryMessage(); // Adjust this to your actual service
        try {
            await sendOrderHistoryRequest(queryMessage);
        } catch (error) {
            console.error('Error in handleQuery:', error);
        }
    };
    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom marginBottom={5}>
                订单历史
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="stretch" mt={2} className="button-container" gap={2}>
                <Button variant="outlined" className="button" startIcon={<RestaurantMenuIcon />} >
                    查看菜品
                </Button>
                <Button variant="outlined" className="button" startIcon={<ReceiptIcon />} onClick={() => history.push("/admin-order")}>
                    查看订单
                </Button>
                <Button variant="outlined" className="button" startIcon={<RateReviewIcon />} >
                    菜品评价
                </Button>
                <Button variant="outlined" className="button" startIcon={<StarIcon />} >
                    厨师评价
                </Button>
                <Button color="secondary" onClick={() => {history.push('/')}}>
                    主页
                </Button>
            </Box>
        </Container>
    )
}
