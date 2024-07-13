import React, { useEffect } from 'react'
import { useHistory } from 'react-router';
import { Box, Button, Container, Typography, Grid } from '@mui/material'
import './index.css'; // Importing the CSS file
import backgroundImage from '../Images/background.png';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '120vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    loginBox: {
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
        width: '50%',
    },
}));

export function Main() {
    const history = useHistory();
    const classes = useStyles();

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
        <div className={classes.root}>
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.3)', // 调整透明度以达到淡化效果
                zIndex: 1,
            }} />
            <Box className={classes.loginBox} sx={{zIndex: 2}}>
                <Typography variant="h1" component="h1" align="center" gutterBottom sx={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    marginBottom: '2rem'
                }}>
                    米麒麟厨房
                </Typography>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Box className="button-container" >
                        <Button variant="contained" color="primary" className="button-spacing"
                            //onClick={() => {setTimeout(() => {history.push('/customer-login')}, 500)}} fullWidth >
                            onClick={() => {history.push('/customer-login')}} sx={{
                                width: '30%',
                                backgroundColor: '#1976d2',
                                color: '#fff',
                                padding: '0.75rem',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                fontSize: '1rem'
                            }}>
                                我是顾客
                        </Button>
                    </Box>
                    <Box className="button-container">
                        <Button variant="contained" color="primary" className="button-spacing"
                            //onClick={() => {setTimeout(() => {history.push('/chef-login')}, 500)}} fullWidth>
                            onClick={() => {history.push('/chef-login')}} fullWidth sx={{
                                width: '30%',
                                backgroundColor: '#1976d2',
                                color: '#fff',
                                padding: '0.75rem',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                fontSize: '1rem'
                            }}>
                                我是厨师
                        </Button>
                    </Box>
                </form>
            </Box>
        </div>
    );
}


