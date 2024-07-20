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
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="charge-amount-dialog">
            <DialogTitle id="charge-amount-dialog">
                <Typography align="center" style={{
                    fontFamily:'Noto Sans',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                }}>
                    充值
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography style={{fontSize:'1.25rem', fontFamily:'Noto Sans'}}>输入您想充值的金额:</Typography>
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
                <Button onClick={onClose} color="secondary" style={{ textTransform: 'none', fontWeight: 'bold' }}>
                    取消
                </Button>
                <Button onClick={handleChargeClick} variant="contained" className='button'>
                    确认充值
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WalletCharge;
