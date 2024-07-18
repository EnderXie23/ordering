import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { useHistory } from 'react-router'
import { TextField, Button, Typography, Alert, Box, IconButton, InputAdornment, Grid } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../index.css'
import backgroundImage from '../../Images/background.png';
import frontImage from '../../Images/tiramisu.jpg';
import { CustomerRegisterMessage } from 'Plugins/CustomerAPI/CustomerRegisterMessage'

export function CustomerRegister() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

    const history=useHistory()
    const sendPostRequest = async (message: CustomerRegisterMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Response status:', response.status);
            console.log('Response body:', response.data);
            setSuccessMessage('注册成功，跳转至登录页…');
            setErrorMessage('');
            setTimeout(() => {
                history.push('/customer-login');
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
                setErrorMessage('Unexpected error occurred');
                setSuccessMessage('');
            }
        }
    };

    const validatePhoneNumber = (phone: string) => {
        const phoneRegex = /^[1-9]\d{9,14}$/; // Simple regex for phone number validation
        return phoneRegex.test(phone);
    };

    const extractErrorBody = (errorData: any) => {
        if (typeof errorData === 'string') {
            const bodyMatch = errorData.match(/Body: (.*)$/);
            return bodyMatch ? bodyMatch[1] : errorData;
        }
        return JSON.stringify(errorData);
    };

    const CustomerRegister = () => {
        if (userName == '') {
            setErrorMessage('用户名不能为空');
            setSuccessMessage('');
            return;
        }
        if (nickname == '') {
            setErrorMessage('昵称不能为空');
            setSuccessMessage('');
            return;
        }
        if (password == '' || confirmPassword == '') {
            setErrorMessage('密码不能为空');
            setSuccessMessage('');
            return;
        }
        if (!validatePhoneNumber(phone)) {
            setErrorMessage('电话号码格式不正确');
            setSuccessMessage('');
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage('密码和确认密码不匹配');
            setSuccessMessage('');
            return;
        }

        const registerMessage = new CustomerRegisterMessage(userName, password, nickname, phone);
        sendPostRequest(registerMessage);
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
                CustomerRegister();
            }
        }
    };

    return (
        <div className='root' style={{backgroundImage: `url(${backgroundImage})`}}>
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
                        新顾客注册
                    </Typography>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <TextField
                            id="username"
                            label="用户名"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 'nickname')}
                            fullWidth
                            margin="normal"
                            sx={{ backgroundColor: '#fff', borderRadius: '5px' }}
                        />
                        <TextField
                            id="nickname"
                            label="昵称"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 'phone')}
                            fullWidth
                            margin="normal"
                            sx={{ backgroundColor: '#fff', borderRadius: '5px' }}
                        />
                        <TextField
                            id="phone"
                            label="电话"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
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
                            onKeyDown={(e) => handleKeyDown(e, 'confirmPassword')}
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
                            id="confirmPassword"
                            label="确认密码"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, null)}
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
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                            {successMessage && <Alert severity="success">{successMessage}</Alert>}
                            <Button variant="contained" color="primary" onClick={CustomerRegister} fullWidth className='button'>
                                注册
                            </Button>
                        </Box>
                        <Box display="flex" mt={2} justifyContent='space-between' className="button-container">
                            <Button color="secondary" onClick={() => {
                                history.push('/customer-login')
                            }}
                                    sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                                返回登录页
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
