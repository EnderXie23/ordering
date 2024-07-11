import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box, TextField } from '@mui/material';

interface WalletChargeProps {
    open: boolean;
    onClose: () => void;
    onCharge: (amount: number) => void;
}

const WalletCharge: React.FC<WalletChargeProps> = ({ open, onClose, onCharge }) => {
    const [chargeAmount, setChargeAmount] = useState('');

    const handleChargeClick = () => {
        const amount = parseFloat(chargeAmount);
        if (!isNaN(amount)) {
            onCharge(amount);
            setChargeAmount('');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="charge-amount-dialog">
            <DialogTitle id="charge-amount-dialog">充值金额</DialogTitle>
            <DialogContent>
                <Typography>输入您想充值的金额:</Typography>
                <Box
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        mt: 2,
                    }}
                >
                    <TextField
                        type="number"
                        value={chargeAmount}
                        onChange={(e) => setChargeAmount(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    取消
                </Button>
                <Button onClick={handleChargeClick} color="primary" variant="contained">
                    确认充值
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WalletCharge;
