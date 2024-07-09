import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { Button, Typography, Container, Box } from '@mui/material'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios'
import { AdminQueryMessage } from 'Plugins/AdminAPI/AdminQueryMessage'
import '../index.css'

export function AdminPage(){
    const history=useHistory()

    const sendAdminQuery = async (message: AdminQueryMessage) => {
        try{
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response.status)
            console.log(response.data)
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
                // Handle any post-request actions here
            })
            .catch(error => {
                console.error('Error in handleComplete:', error) // Added error handling
            })
    }, [])

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom marginBottom={5}>
                管理员页面
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="stretch" mt={2} className="button-container" gap={2}>
                <Button variant="outlined" className="custom-button" startIcon={<RestaurantMenuIcon />} >
                    查看菜品
                </Button>
                <Button variant="outlined" className="custom-button" startIcon={<ReceiptIcon />} >
                    查看订单
                </Button>
                <Button variant="outlined" className="custom-button" startIcon={<RateReviewIcon />} >
                    菜品评价
                </Button>
                <Button variant="outlined" className="custom-button" startIcon={<StarIcon />} >
                    厨师评价
                </Button>
                <Button color="secondary" onClick={() => {history.push('/')}}>
                    主页
                </Button>
            </Box>
        </Container>
    )
}
