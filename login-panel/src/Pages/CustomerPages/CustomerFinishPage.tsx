import { useHistory } from 'react-router-dom';
import { useUser } from 'Pages/UserContext';
import React, { useState } from 'react';
import CustomerSidebar from './CustomerSidebar'
import { Container, Typography, Box, Button, TextField } from '@mui/material';

const CustomerFinishPage: React.FC = () => {
    const history = useHistory();
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        // Handle the submit logic here (e.g., send to server)
        console.log('Comment:', comment);
        alert('感谢您的评论!');
        // Clear the input after submitting
        setComment('');
    };

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom>
                    订单完成
                </Typography>
                <CustomerSidebar/>
            </Box>
            <Typography variant="body1" gutterBottom>
                感谢您的订购！
            </Typography>
            <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
                <Button variant="contained" color="primary" onClick={() => { history.push('/comment') }} style={{ marginRight: '16px' }}>
                    留下评论
                </Button>
                <Button variant="contained" color="primary" onClick={() => { history.push('/') }}>
                    返回主页
                </Button>
            </Box>
        </Container>
    );
};

export default CustomerFinishPage;
