import React from 'react';
import { useHistory } from 'react-router-dom';
import { useUser } from 'Pages/UserContext';
import { Container, Typography,List, ListItem, ListItemAvatar, ListItemText,Avatar, Box, Button} from '@mui/material';
import CustomerSidebar from 'Pages/CustomerPages/CustomerSidebar/CustomerSidebar'

const OrderSummaryPage: React.FC = () => {
    const { orderedDishes } = useUser();
    const history = useHistory();

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom>
                    订单总结
                </Typography>
                <CustomerSidebar/>
            </Box>
            <List>
                {orderedDishes.map((dish) => (
                    <ListItem key={dish.name}>
                        <ListItemAvatar>
                            <Avatar src={require('../../Images/' + dish.path).default} alt={dish.name} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={dish.name}
                            secondary={`数量: ${dish.count}`}
                        />
                    </ListItem>
                ))}
            </List>
            <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
                <Button variant="contained" color="primary" onClick={() => { history.push('/place-order') }}>
                    继续点菜
                </Button>
                <Button variant="contained" color="secondary" onClick={() => { history.push('/finish') }} style={{ marginLeft: '16px' }}>
                    完成
                </Button>
            </Box>
        </Container>
    );
};

export default OrderSummaryPage;
