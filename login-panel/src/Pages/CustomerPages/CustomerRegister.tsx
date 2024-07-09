import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { useHistory } from 'react-router'
import { Container, TextField, Button, Typography, Alert, Box, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../index.css'
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
                    setErrorMessage('注册失败：' + extractErrorBody(error.response.data.error) || '注册失败');
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

    return (
        <Container maxWidth="sm" className="container">
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                新顾客注册
            </Typography>
            <form onSubmit={(e) => e.preventDefault()}>
                <TextField
                    label="用户名"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="昵称"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="电话"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="密码"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
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
                <Button variant="contained" color="primary" onClick={CustomerRegister} fullWidth>
                    注册
                </Button>
                <Box display="flex" mt={2} className="button-container">
                    <Button color="secondary" onClick={() => {history.push('/customer-login')}}>
                        返回登录页
                    </Button>
                    <Button color="secondary" onClick={() => {history.push('/')}}>
                        主页
                    </Button>
                </Box>
            </form>
        </Container>
    );
}