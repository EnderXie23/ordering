import React, { useState } from 'react';
import { useUser } from 'Pages/UserContext'
import { useHistory } from 'react-router'

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
        <div>
            <h1>请选择服务方式</h1>
            <div>
                <label>
                    堂食
                    <input
                        type="radio"
                        name="serviceType"
                        value="dine-in"
                        checked={serviceType === 'dine-in'}
                        onChange={handleServiceTypeChange}
                    />
                </label>
                <label>
                    外卖
                    <input
                        type="radio"
                        name="serviceType"
                        value="takeaway"
                        checked={serviceType === 'takeaway'}
                        onChange={handleServiceTypeChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    {serviceType === 'dine-in' ? '桌号:' : '地址:'}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                </label>
            </div>
            <button onClick={handleSubmit}>确定</button>
        </div>
    );
};

export default ServiceType;
