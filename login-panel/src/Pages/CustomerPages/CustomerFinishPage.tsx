import { useHistory } from 'react-router-dom';
import React from 'react';
import CustomerSidebar from './CustomerSidebar/CustomerSidebar'
import { Container, Typography, Box, Button } from '@mui/material';
import backgroundImage from 'Images/background.png'

const CustomerFinishPage: React.FC = () => {
    const history = useHistory();

    return (
        <div className='root' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Box className='cover' style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}/>
            <Container style={{zIndex:2, width: '50%'}}>
                <Box display="flex" flexDirection='column' justifyContent="center" alignItems="center">
                    <Typography variant="h4" gutterBottom sx={{
                        fontFamily: 'Noto Sans',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        marginBottom: '2rem'
                    }}>
                        订单完成
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{
                        fontFamily: 'Noto Sans',
                        fontSize: '1rem',
                    }}>
                        感谢您的订购！
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
                    <Button variant="contained" className='button' onClick={() => { history.push('/comment') }} style={{ marginRight: '16px' }}>
                        留下评论
                    </Button>
                    <Button variant="contained" className='button' onClick={() => { history.push('/') }}>
                        返回主页
                    </Button>
                </Box>
            </Container>
            <CustomerSidebar/>
        </div>
    );
};

export default CustomerFinishPage;
