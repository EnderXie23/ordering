import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useUser } from 'Pages/UserContext';
import { Box, Drawer, List, ListItem, ListItemText, IconButton, ListItemIcon, Typography } from '@mui/material';
import { AccountCircle, AccountBalanceWallet, History, Person } from '@mui/icons-material';

const CustomerSidebar: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const history = useHistory();
    const { name } = useUser(); // Replace with actual username
    const username = name.split('\n')[1];

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleNavigation = (path: string) => {
        history.push(path);
    };

    return (
        <>
            <IconButton
                edge="end"
                color="inherit"
                aria-label="account of current user"
                onClick={toggleDrawer(true)}
            >
                <AccountCircle fontSize="large" />
            </IconButton>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '16px',
                            borderBottom: '1px solid #ccc',
                        }}
                    >
                        <AccountCircle fontSize="large" />
                        <Typography variant="h6">{username}</Typography>
                    </Box>
                    <List>
                        <ListItem button onClick={() => handleNavigation('/')}>
                            <ListItemIcon><Person /></ListItemIcon>
                            <ListItemText primary="个人信息" />
                        </ListItem>
                        <ListItem button >
                            <ListItemIcon><AccountBalanceWallet /></ListItemIcon>
                            <ListItemText primary="我的钱包" />
                        </ListItem>
                        <ListItem button >
                            <ListItemIcon><History /></ListItemIcon>
                            <ListItemText primary="历史订单" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default CustomerSidebar;
