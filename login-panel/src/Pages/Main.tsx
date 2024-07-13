import React, { useEffect } from 'react'
import { useHistory } from 'react-router';
import { Box, Button, Container, Typography } from '@mui/material'
import './index.css'; // Importing the CSS file

export function Main() {
    const history = useHistory();

    const clearAllChats = () => {
        // Clear all chat messages from local storage
        for (const key in localStorage) {
            if (key.startsWith('chatMessages_') || key=='chatMessages') {
                localStorage.removeItem(key);
            }
        }
        console.log('All chat histories have been cleared.');
    };

    useEffect(() => {
        clearAllChats();
    }, [])

    return (
        <Container maxWidth="sm" className="container">
            <Typography variant="h2" component="h1" align="center" gutterBottom>
                米麒麟厨房
            </Typography>
            <form onSubmit={(e) => e.preventDefault()}>
                <Box className="button-container">
                    <Button variant="contained" color="primary" className="button-spacing"
                            //onClick={() => {setTimeout(() => {history.push('/customer-login')}, 500)}} fullWidth >
                            onClick={() => {history.push('/customer-login')}} fullWidth >
                        我是顾客
                    </Button>
                </Box>
                <Box className="button-container">
                    <Button variant="contained" color="primary" className="button-spacing"
                            //onClick={() => {setTimeout(() => {history.push('/chef-login')}, 500)}} fullWidth>
                            onClick={() => {history.push('/chef-login')}} fullWidth >
                        我是厨师
                    </Button>
                </Box>
            </form>
        </Container>
    );
}


