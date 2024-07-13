import React, { useEffect } from 'react'
import { useHistory } from 'react-router';
import { Box, Button, Container, Typography, Grid } from '@mui/material'
import './index.css'; // Importing the CSS file
import backgroundImage from '../Images/background.png';
<<<<<<< Updated upstream
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
    '@keyframes bubbly': {
        '0%, 100%': { transform: 'scale(1)' },
        '10%': { transform: 'scale(1.025)' },
        '20%': { transform: 'scale(0.975)' },
        '30%': { transform: 'scale(1.02)' },
        '40%': { transform: 'scale(0.98)' },
        '50%': { transform: 'scale(1.015)' },
        '60%': { transform: 'scale(0.985)' },
        '70%': { transform: 'scale(1.01)' },
        '80%': { transform: 'scale(0.99)' },
        '90%': { transform: 'scale(1.005)' },
        '100%': { transform: 'scale(0.995)' },
    },
    button: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: '20px',
        padding: '10px 20px',
        transition: 'transform 0.7s ease',
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            animation: '$bubbly 2s ease', // Adjust the duration to control the speed
        },
        '&:active': {
            transform: 'scale(0.9)', // Scale down slightly when clicked
        },
    },
}));
=======
>>>>>>> Stashed changes

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
            <Box className='login-box'>
                <Typography variant="h1" component="h1" align="center" gutterBottom sx={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    marginBottom: '2rem'
                }}>
                    米麒麟厨房
                </Typography>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Box className="button-container" >
                        <Button variant="contained" color="primary" className={`${classes.button} button-spacing`}
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
                        <Button variant="contained" color="primary" className={`${classes.button} button-spacing`}
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


