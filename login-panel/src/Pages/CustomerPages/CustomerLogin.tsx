import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { useHistory } from 'react-router'
import { TextField, Button, Typography, Alert, Box, IconButton, InputAdornment, Grid } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../index.css'
import backgroundImage from '../../Images/background.png';
import frontImage from '../../Images/tiramisu.jpg';
import { useUser } from 'Pages/UserContext'
import { CustomerLoginMessage } from 'Plugins/CustomerAPI/CustomerLoginMessage'
import { CustomerQueryProfileMessage } from 'Plugins/CustomerAPI/CustomerProfileMessage'

export function CustomerLogin() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for password
    const { setName, setBalance } = useUser()

    const history=useHistory()

    const updateProfile = async () =>{
        const qmessage = new CustomerQueryProfileMessage(userName);
        try{
            const response = await axios.post(qmessage.getURL(), JSON.stringify(qmessage), {
                headers: { 'Content-Type': 'application/json' },
            });
            setBalance(Number(response.data.balance));
            console.log(response.data);
        }catch(error){
            console.error('Unexpected error:', error);
            setErrorMessage('Unexpected error occurred');
            setSuccessMessage('');
        }
    }

    const sendPostRequest = async (message: CustomerLoginMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Response status:', response.status);
            console.log('Response body:', response.data);
            if (response.data[0] == 'Valid user') {
                setSuccessMessage('登录成功，跳转中…');
                setErrorMessage('');
                setName(userName + '\n' + response.data[1]);
                await updateProfile();
                setTimeout(() => {
                    history.push('/service-type');
                }, 1000);
            } else if (response.data[0] == 'Invalid user') {
                setSuccessMessage('');
                setErrorMessage('登录失败：用户名或密码错误');
            } else {
                setSuccessMessage('');
                setErrorMessage(response.data);
            }
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response && error.response.data) {
                    console.error('Error sending request:', error.response.data);
                    setErrorMessage(extractErrorBody(error.response.data.error) || '登录失败');
                    setSuccessMessage('');
                } else {
                    console.error('Error sending request:', error.message);
                    setErrorMessage(error.message || '登录失败');
                    setSuccessMessage('');
                }
            } else {
                console.error('Unexpected error:', error);
                setErrorMessage('登录失败');
                setSuccessMessage('');
            }
        }
    };

    const extractErrorBody = (errorData: any) => {
        if (typeof errorData === 'string') {
            const bodyMatch = errorData.match(/Body: (.*)$/);
            return bodyMatch ? bodyMatch[1] : errorData;
        }
        return JSON.stringify(errorData);
    };

    const CustomerLogin = () => {
        const loginMessage = new CustomerLoginMessage(userName, password);
        sendPostRequest(loginMessage);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, nextFieldId: string | null) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextFieldId) {
                const nextField = document.getElementById(nextFieldId);
                if (nextField) {
                    nextField.focus();
                }
            } else {
                CustomerLogin();
            }
        }
    };

    return (
        <div className='root' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Box className='cover' />
            <Box className='main-box' sx={{ display: 'flex', alignItems: 'stretch', padding: 0}}>
                <Grid item width='40%'
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                    <img src={frontImage} alt="Login illustration"
                         style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px 0 0 10px' }} />
                </Grid>
                <Grid item width='60%' sx={{ padding: '2rem'}}>
                    <Typography variant="h4" component="h1" align="center" gutterBottom sx={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem'
                    }}>
                        顾客登录
                    </Typography>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <TextField
                            id="username"
                            label="用户名"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 'password')}
                            fullWidth
                            margin="normal"
                            sx={{ backgroundColor: '#fff', borderRadius: '5px' }}
                        />
                        <TextField
                            id="password"
                            label="密码"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, null)}
                            fullWidth
                            margin="normal"
                            sx={{ backgroundColor: '#fff', borderRadius: '5px' }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                            {successMessage && <Alert severity="success">{successMessage}</Alert>}
                            <Button variant="contained" color="primary" onClick={CustomerLogin} fullWidth
                                    className='button'>
                                登录
                            </Button>
                        </Box>
                        <Box display="flex" mt={2} justifyContent="space-between" className="button-container">
                            <Button color="secondary" onClick={() => {
                                history.push('/customer-register')
                            }}
                                    sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                                新用户注册
                            </Button>
                            <Button color="secondary" onClick={() => {
                                history.push('/')
                            }}
                                    sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                                主页
                            </Button>
                        </Box>
                    </form>
                </Grid>
            </Box>
        </div>
    );
}
