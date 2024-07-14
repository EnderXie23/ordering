import { useHistory } from 'react-router-dom';
import React from 'react';
import CustomerSidebar from './CustomerSidebar/CustomerSidebar'
import { Container, Typography, Box, Button } from '@mui/material';

const CustomerFinishPage: React.FC = () => {
    const history = useHistory();

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
