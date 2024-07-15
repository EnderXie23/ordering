import React, { useState } from 'react';
import { useUser } from 'Pages/UserContext'
import { useHistory } from 'react-router'
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Button, Box, Typography } from '@mui/material';

const ServiceType: React.FC = () => {
    const [serviceType, setServiceType] = useState<'dine-in' | 'takeaway'>('dine-in');
    const [inputValue, setInputValue] = useState('');
    const {setService, setServiceTypeInfo} = useUser();

    const history=useHistory()

    const handleServiceTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setServiceType(event.target.value as 'dine-in' | 'takeaway');
        setInputValue('');
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = () => {
        setService(serviceType === 'takeaway' ? 0 : 1);
        setServiceTypeInfo(inputValue);
        history.push('/place-order');
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>请选择服务方式</Typography>
            <FormControl component="fieldset">
                <FormLabel component="legend">服务方式</FormLabel>
                <RadioGroup
                    name="serviceType"
                    value={serviceType}
                    onChange={handleServiceTypeChange}
                >
                    <FormControlLabel value="dine-in" control={<Radio />} label="堂食" />
                    <FormControlLabel value="takeaway" control={<Radio />} label="外卖" />
                </RadioGroup>
            </FormControl>
            <TextField
                label={serviceType === 'dine-in' ? '桌号' : '地址'}
                value={inputValue}
                onChange={handleInputChange}
                fullWidth
                autoFocus
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                确定
            </Button>
            <Button variant="contained" color="secondary" onClick={() => {history.push('/')}} fullWidth sx={{marginTop: 2}}>
                返回
            </Button>
        </Box>
    );
};

export default ServiceType;
