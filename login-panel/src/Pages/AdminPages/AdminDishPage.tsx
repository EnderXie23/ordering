import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { List, Button, Typography, Container, Box, ListItem, ListItemText, TextField } from '@mui/material'
import axios from 'axios'
import { DishChangeMessage, DishQueryMessage } from 'Plugins/AdminAPI/AdminDishMessage'

interface Dish {
    name: string;
    path: string;
    price: string;
}

export function AdminDishPage(){
    const history=useHistory()
    const [newDish, setNewDish] = useState<Dish>({ name: '', path: '', price: '' });
    const [dishes, setDishes] = useState<Dish[]>([]);

    const parseDishes = (data: string): Dish[] => {
        return data.split('\n').map(line => {
            const [name, path, price] = line.split(',');
            return { name, path, price };
        });
    };

    const readDishesInfo = async () => {
        const qmessage = new DishQueryMessage();
        try {
            const response = await axios.post(qmessage.getURL(), JSON.stringify(qmessage), {
                headers: { 'Content-Type': 'application/json' },
            });
            setDishes(parseDishes(response.data));
        } catch (error) {
            console.error('Error querying dishes:', error);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewDish(prev => ({ ...prev, [name]: value }));
    };

    const handleAddDish = async () => {
        const message = new DishChangeMessage(newDish.name, newDish.path, newDish.price);
        try{
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response.status)
            console.log(response.data)
            setDishes(prev => [...prev, newDish]);
            setNewDish({ name: '', path: '', price: '' });
        } catch (error){
            console.error('Error admin dish adding:', error)
        }
    };

    useEffect(() => {
        readDishesInfo()
    }, [])

    return (
        <Container style={{ maxHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <h1>Menu</h1>
            <List>
                {dishes.map((dish, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={dish.name} secondary={`${dish.path}, ${dish.price}`} />
                    </ListItem>
                ))}
            </List>
            <div>
                <TextField
                    label="Dish Name"
                    name="name"
                    value={newDish.name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Image Path"
                    name="path"
                    value={newDish.path}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Price"
                    name="price"
                    value={newDish.price}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" onClick={handleAddDish} style={{ marginTop: '10px' }}>
                    添加菜品
                </Button>
                <Button variant="contained" color="secondary" onClick={() => {history.push('/')}} style={{ marginTop: '10px' }}>
                    返回
                </Button>
            </div>
        </Container>
    )
}
