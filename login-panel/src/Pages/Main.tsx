import React, { useEffect } from 'react'
import { useHistory } from 'react-router';
import { Box, Button,  Typography } from '@mui/material'
import './index.css'; // Importing the CSS file
import backgroundImage from '../Images/background.png';

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
        <div className='root' style={{backgroundImage: `url(${backgroundImage})`}}>
            <Box className='cover' />
            <Box className='login-box' style={{width: '30%'}}>
                <Typography variant="h1" component="h1" align="center" gutterBottom sx={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    marginBottom: '2rem'
                }}>
                    米麒麟厨房
                </Typography>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Box className="button-container">
                        <Button variant="contained" className='button' style={{width:'30%'}}
                                onClick={() => {
                                    history.push('/customer-login')
                                }} >
                            我是顾客
                        </Button>
                    </Box>
                    <Box className="button-container">
                        <Button variant="contained" className='button' style={{width:'30%'}}
                                onClick={() => {
                                    history.push('/chef-login')
                                }} fullWidth >
                            我是厨师
                        </Button>
                    </Box>
                </form>
            </Box>
        </div>
    );
}


