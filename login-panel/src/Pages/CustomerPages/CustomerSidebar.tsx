import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useUser } from 'Pages/UserContext';
import { Box, Drawer, List, ListItem, ListItemText, IconButton, ListItemIcon, Typography, Modal, Button } from '@mui/material'
import { AccountCircle, AccountBalanceWallet, History, Person } from '@mui/icons-material';

const CustomerSidebar: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [chargeModalOpen, setChargeModalOpen] = useState(false);
    const [chargeAmount, setChargeAmount] = useState('');
    const [balance, setBalance] = useState(0);
    const history = useHistory();
    const { name } = useUser(); // Replace with actual username
    const username = name.split('\n')[1];

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleModalOpen = () =>{
        // TODO: Fetch user balance
        setModalOpen(true);
    }

    const handleModalClose = () => {
        setDrawerOpen(true);
        setModalOpen(false);
    }

    const handleChargeModalOpen = () => {
        setChargeModalOpen(true);
        setModalOpen(false); // Close the balance modal when opening the charge modal
    };

    const handleChargeModalClose = () => {
        setModalOpen(true);
        setChargeModalOpen(false);
    };

    const handleCharge = (amount: string) => {
        // TODO: really handle it here
        setBalance(balance + parseInt(amount));
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
                        <ListItem button >
                            <ListItemIcon><Person /></ListItemIcon>
                            <ListItemText primary="个人信息" />
                        </ListItem>
                        <ListItem button onClick={handleModalOpen}>
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
            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="user-balance-modal"
                aria-describedby="user-balance-description"
                sx={{ textAlign: 'center' }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '16px', // Add rounded edges
                    }}
                >
                    <Typography id="user-balance-modal" variant="h6" component="h2">
                        用户余额
                    </Typography>
                    <Typography id="user-balance-description" sx={{ mt: 2 }}>
                        您的当前余额是: {balance} 元
                    </Typography>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleChargeModalOpen}>
                        立即充值
                    </Button>
                </Box>
            </Modal>
            <Modal
                open={chargeModalOpen}
                onClose={handleChargeModalClose}
                aria-labelledby="charge-amount-modal"
                aria-describedby="charge-amount-description"
                sx={{
                    textAlign: 'center',  // Align text to center
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '16px', // Add rounded edges
                    }}
                >
                    <Typography id="charge-amount-modal" variant="h6" component="h2">
                        充值金额
                    </Typography>
                    <Typography id="charge-amount-description" sx={{ mt: 2 }}>
                        输入您想充值的金额:
                    </Typography>
                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        <input
                            type="number"
                            value={chargeAmount}
                            onChange={(e) => setChargeAmount(e.target.value)}
                            style={{
                                padding: '10px',
                                fontSize: '16px',
                                borderRadius: '8px', // Add rounded edges
                                border: '1px solid #ccc', // Add border
                                width: '100%', // Full width
                                marginBottom: '16px' // Space between input and button
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                handleCharge(chargeAmount);
                                handleChargeModalClose();
                            }}
                            sx={{
                                mt: 2,
                                borderRadius: '8px', // Add rounded edges
                                padding: '10px 20px', // Add padding
                            }}
                        >
                            确认充值
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default CustomerSidebar;
