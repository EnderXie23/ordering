import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import {
    Button,
    Typography,
    Container,
    Box,
    Dialog,
    TextField,
    CardMedia,
    Card, Grid, CardContent, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material'
import axios from 'axios'
import { DishChangeMessage, DishQueryMessage } from 'Plugins/AdminAPI/AdminDishMessage'
import { name } from 'qrcode.react'

interface Dish {
    name: string;
    path: string;
    price: string;
}

export function AdminDishPage(){
    const history=useHistory()
    const [newDish, setNewDish] = useState<Dish>({ name: '', path: '', price: '' });
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [changeOpen, setChangeOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);

    const handleRemove = (dishName: string) => {

    }

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

        if (name === 'path') {
            try {
                const previewPath = require(`../../Images/${value}`).default;
                setPreviewImage(previewPath);
            } catch (error) {
                setPreviewImage('');
            }
        }
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
            setPreviewImage('');
        } catch (error){
            console.error('Error admin dish adding:', error)
        }
    }

    const getImagePath = (path: string): string => {
        try {
            return require(`../../Images/${path}`).default;
        } catch (error) {
            return require(`../../Images/default.jpg`).default;
        }
    };

    const handleChangeClose = () =>{
        setChangeOpen(false);
    }

    const handleAddClose = () =>{
        setAddOpen(false);
    }

    useEffect(() => {
        readDishesInfo()
    }, [])

    return (
        <Container style={{ maxHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <h1>Menu</h1>
            <Grid container spacing={4}>
                {dishes.map((dish) => (
                    <Grid item xs={12} sm={6} md={4} key={dish.name}>
                        <Card style={{maxWidth: '250px', height: '300px', justifyContent:'center'}}>
                            <CardMedia component="img" height="140" src= {getImagePath(dish.path)} alt={dish.name} />
                            <CardContent>
                                <Typography variant="h5">{dish.name}</Typography>
                                <Box display="flex" alignItems="center">
                                    <Typography variant="subtitle1">价格：{dish.price}元</Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Button variant="contained" color="primary" onClick={() => setChangeOpen(true)}>
                                        <Typography>更改价格</Typography>
                                    </Button>
                                    <Button variant="contained" color="error" onClick={() => setChangeOpen(true)}>
                                        <Typography>移除</Typography>
                                    </Button>
                                </Box>

                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <div>
                <Button variant="contained" color="primary" onClick={() => {setAddOpen(true)}} style={{ marginTop: '10px' }}>
                    添加菜品
                </Button>
                <Button variant="contained" color="secondary" onClick={() => {history.push('/admin')}} style={{ marginTop: '10px' }}>
                    返回
                </Button>
            </div>
            <Dialog open={changeOpen} >
                <DialogTitle>更改价格</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        输入更新后的价格：
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New price"
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleChangeClose} color="primary">
                        取消
                    </Button>
                    <Button onClick={handleChangeClose} color="primary">
                        提交
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={addOpen} >
                <DialogTitle>添加菜品</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        填写新菜品的信息：
                    </DialogContentText>
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
                    {previewImage && (
                        <Card style={{maxWidth: '100vh', height: '300px'}}>
                            <CardMedia component="img" src= {previewImage} />
                        </Card>
                    )}
                    <TextField
                        label="Price"
                        name="price"
                        value={newDish.price}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddClose} color="primary">
                        取消
                    </Button>
                    <Button onClick={() => {
                        if(newDish.name != '') {
                            handleAddDish();
                        }
                        handleAddClose();
                    }} color="primary">
                        提交
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}
