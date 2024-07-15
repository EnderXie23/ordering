import React, { useState } from 'react';
import { useUser } from 'Pages/UserContext';
import{useHistory} from 'react-router-dom';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Typography,
    Fab,
} from '@mui/material'
import { AccountCircle, AccountBalanceWallet, History, Person } from '@mui/icons-material';
import  AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Profile from './Profile';
import Wallet from './Wallet';
import CustomerHistory from './OrderHistory'

const CustomerSidebar: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { name } = useUser();
    const username = name.split('\n')[1];
    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    // customer-profile
    const [profileOpen, setProfileOpen] = useState(false);
    const handleProfileOpen = () => {
        setProfileOpen(true);
    };
    const handleProfileClose = () => {
        setDrawerOpen(true);
        setProfileOpen(false);
    };

    // wallet
    const [walletOpen, setWalletOpen] = useState(false);
    const handleWalletOpen = () =>{
        setWalletOpen(true);
    }
    const handleWalletClose = () => {
        setDrawerOpen(true);
        setWalletOpen(false);
    }

    const [CustomerHistoryOpen, setCustomerHistoryOpen] = useState(false);
    const handleCustomerHistoryOpen = () =>{
        setCustomerHistoryOpen(true);
    }
    const handleCustomerHistoryClose = () => {
        setDrawerOpen(true);
        setCustomerHistoryOpen(false);
    }

    return (
        <>
            <Fab
                color="primary"
                onClick={toggleDrawer(true)}
                sx={{ position: 'fixed', top: 16, right: 16 }}
            >
                <AccountCircleIcon />
            </Fab>
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
                        <ListItem button onClick={handleProfileOpen}>
                            <ListItemIcon><Person /></ListItemIcon>
                            <ListItemText primary="个人信息" />
                        </ListItem>
                        <ListItem button onClick={handleWalletOpen}>
                            <ListItemIcon><AccountBalanceWallet /></ListItemIcon>
                            <ListItemText primary="我的钱包" />
                        </ListItem>
                        <ListItem button onClick={handleCustomerHistoryOpen}>
                            <ListItemIcon><History /></ListItemIcon>
                            <ListItemText primary="历史订单" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            <Profile open={profileOpen} onClose={handleProfileClose} />
            <CustomerHistory open={CustomerHistoryOpen} onClose={handleCustomerHistoryClose} />
            <Wallet
                open={walletOpen}
                onClose={handleWalletClose}
            />
        </>
    );
};

export default CustomerSidebar;
