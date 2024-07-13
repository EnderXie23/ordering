import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { RegisterMessage } from 'Plugins/ChefAPI/RegisterMessage';
import { useHistory } from 'react-router'
import { Container, TextField, Button, Typography, Alert, Box, IconButton, InputAdornment, Grid } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../index.css'
import backgroundImage from '../../Images/tiramisu.jpg';

export function ChefRegister() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

    const history=useHistory()
    const sendPostRequest = async (message: RegisterMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Response status:', response.status);
            console.log('Response body:', response.data);
            setSuccessMessage('注册成功，跳转至登录页…');
            setErrorMessage('');
            setTimeout(() => {
                history.push('/chef-login');
            }, 1000);
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response && error.response.data) {
                    console.error('Error sending request:', error.response.data);
                    const ErrorBody= extractErrorBody(error.response.data.error)
                    if (ErrorBody == 'already registered') {
                        setErrorMessage('注册失败：该用户已经存在');
                    } else {
                        setErrorMessage('注册失败：' + extractErrorBody(error.response.data.error) || '注册失败');
                    }
                    setSuccessMessage('');
                } else {
                    console.error('Error sending request:', error.message);
                    setErrorMessage(error.message || '注册失败');
                    setSuccessMessage('');
                }
            } else {
                console.error('Unexpected error:', error);
                setErrorMessage('注册失败：未知错误');
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

    const ChefRegister = () => {
        if (userName == '') {
            setErrorMessage('用户名不能为空');
            setSuccessMessage('');
            return;
        }
        if (userName == 'admin') {
            setErrorMessage('注册失败：该用户已经存在');
            setSuccessMessage('');
            return;
        }
        if (password == '' || confirmPassword == '') {
            setErrorMessage('密码不能为空');
            setSuccessMessage('');
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage('密码和确认密码不匹配');
            setSuccessMessage('');
            return;
        }

        const registerMessage = new RegisterMessage(userName, password);
        sendPostRequest(registerMessage);
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
                        新厨师注册
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
                        <TextField
                            label="确认密码"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                            sx={{ backgroundColor: '#fff', borderRadius: '5px' }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                        {successMessage && <Alert severity="success">{successMessage}</Alert>}
                        <Button variant="contained" color="primary" onClick={ChefRegister} fullWidth sx={{
                            backgroundColor: '#1976d2',
                            color: '#fff',
                            padding: '0.75rem',
                            borderRadius: '5px',
                            fontWeight: 'bold',
                            fontSize: '1rem'
                        }}>
                            注册
                        </Button>
                        <Box display="flex" mt={2} className="button-container">
                            <Button color="secondary" onClick={() => {history.push('/chef-login')}}
                                    sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                                返回登录页
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
