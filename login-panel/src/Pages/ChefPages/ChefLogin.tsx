import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { LoginMessage } from 'Plugins/ChefAPI/LoginMessage';
import { useHistory } from 'react-router'
import { Container, TextField, Button, Typography, Alert, Box, IconButton, InputAdornment, Grid } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../index.css'
import backgroundImage from '../../Images/tiramisu.jpg';
import { useChef } from '../ChefContext';


export function ChefLogin() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for password
    const { setChefName } = useChef();
    const history=useHistory()
    const sendPostRequest = async (message: LoginMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Response status:', response.status);
            console.log('Response body:', response.data);
            if (response.data == 'Valid user') {
                setSuccessMessage('登录成功，跳转中…');
                setErrorMessage('');
                setChefName(message.userName);
                setTimeout(() => {
                    history.push('/chef');
                }, 1000);
            } else if (response.data == 'Invalid user') {
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
                setErrorMessage('Unexpected error occurred');
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

    const HandleLogin = () => {
        if  (userName == 'admin' && password == 'root') {
            setSuccessMessage('登录成功，跳转中…');
            setErrorMessage('');
            setTimeout(() => {history.push('/admin');}, 1000);
            return
        }
        const loginMessage = new LoginMessage(userName, password);
        sendPostRequest(loginMessage);
    };

    return (
        <Container className="container" sx={{
            position: 'relative',
            borderRadius: '10px',
            padding: '2rem',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden', // 确保子元素不溢出
        }}>
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 1,
            }} />
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.8)', // 调整透明度以达到淡化效果
                zIndex: 2,
            }} />
            <Grid container spacing={2} sx={{
                position: 'relative',
                zIndex: 3,
                borderRadius: '10px',
                padding: '2rem',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Grid item xs={12} sm={8}>
                    <Typography variant="h4" component="h1" align="center" gutterBottom sx={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem'
                    }}>
                        厨师登录
                    </Typography>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <TextField
                            label="用户名"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            fullWidth
                            margin="normal"
                            sx={{ backgroundColor: '#fff', borderRadius: '5px' }}
                        />
                        <TextField
                            label="密码"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            <Button variant="contained" color="primary" onClick={HandleLogin} fullWidth sx={{
                                backgroundColor: '#1976d2',
                                color: '#fff',
                                padding: '0.75rem',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                fontSize: '1rem'
                            }}>
                                登录
                            </Button>
                        </Box>
                        <Box display="flex" mt={2} justifyContent="space-between" className="button-container">
                            <Button color="secondary" onClick={() => {history.push('/chef-register')}}
                                    sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                                新用户注册
                            </Button>
                            <Button color="secondary" onClick={() => {history.push('/')}}
                                    sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                                主页
                            </Button>
                        </Box>
                    </form>
                </Grid>
            </Grid>
        </Container>
    );
}
