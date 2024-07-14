import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { useUser } from 'Pages/UserContext';
import { Container, Typography,List, ListItem, ListItemAvatar, ListItemText,Avatar, Box, Button} from '@mui/material';
import CustomerSidebar from 'Pages/CustomerPages/CustomerSidebar/CustomerSidebar'
import { CustomerQueryStateMessage } from 'Plugins/CustomerAPI/CustomerQueryStateMessage'
import axios from 'axios'

const OrderSummaryPage: React.FC = () => {
    const { name, orderedDishes, OrderID } = useUser();
    const nickName = name.split('\n')[1];
    const history = useHistory();
    const [dishesWithStates, setDishesWithStates] = useState<{ name: string, path: string, count: number, state: string }[]>([]);

    const QueryStateRequest = async (message: CustomerQueryStateMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            return response.data;
        } catch (error) {
            console.error('Unexpected error:', error);
            return "Unknown";
        }
    };

    async function recordStates(orderedDishes: { name: string, path: string, count: number }[]): Promise<{ name: string, path: string, count: number, state: string }[]> {
        const results = [];
        for (const dish of orderedDishes) {
            const message = new CustomerQueryStateMessage(OrderID, dish.name);
            const state = await QueryStateRequest(message);
            results.push({ ...dish, state });
        }
        return results;
    }

    const fetchStates = async () => {
        const result = await recordStates(orderedDishes);
        setDishesWithStates(result);
    };

    useEffect(() => {
        fetchStates();
    }, [orderedDishes]);

    return (
        <Container style={{
            width: '70vw',
            height: '90vh',
            overflowY: 'auto',
        }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom>
                    {nickName}的订单总结:
                </Typography>
                <CustomerSidebar/>
            </Box>
            <List>
                {dishesWithStates.map(dish => (
                    <ListItem key={dish.name}>
                        <ListItemAvatar>
                            <Avatar src={require('../../Images/' + dish.path).default} alt={dish.name} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={dish.name}
                            secondary={`数量: ${dish.count}，状态：${dish.state}`}
                        />
                    </ListItem>
                ))}
            </List>
            <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
                <Button variant="contained" color="primary" onClick={fetchStates}>
                    刷新
                </Button>
                <Button variant="contained" color="primary" onClick={() => { history.push('/place-order') }} style={{ marginLeft: '16px' }}>
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
