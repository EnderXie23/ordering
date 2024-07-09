import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { Grid, Button, Card, CardContent, Typography, ListItemText, Container, Box } from '@mui/material'
import axios from 'axios'
import { AdminQueryMessage } from 'Plugins/ChefAPI/AdminQueryMessage'

export function AdminPage(){
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
        const queryMeaasge = new AdminQueryMessage()
        try {
            await sendAdminQuery(queryMeaasge)
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
            <Typography variant="h4" align="center" gutterBottom>
                管理员页面
            </Typography>
        </Container>
    )
}
