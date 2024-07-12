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
    Input,
    Card, Grid, CardContent, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material'
import axios from 'axios'
import { DishChangeMessage, DishQueryMessage, DishPriceMessage, DishDeleteMessage } from 'Plugins/AdminAPI/AdminDishMessage'
import { styled } from '@mui/styles'

interface Dish {
    name: string;
    path: string;
    price: string;
}

export function AdminDishPage(){
    const history=useHistory()
    const [newDish, setNewDish] = useState<Dish>({ name: '', path: '', price: '' });
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [dishToChange, setDishToChange] = useState<string>('');
    const [previewImage, setPreviewImage] = useState<string>('');
    const [newPrice, setNewPrice] = useState<string>('')
    const [changeOpen, setChangeOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);

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
            setNewDish({ name: '', path: '', price: '' });
            setPreviewImage('');
            readDishesInfo();
        } catch (error){
            console.error('Error admin dish adding:', error)
        }
    }

    const handleDeleteDish = async (dishName: string) => {
        const message = new DishDeleteMessage(dishName);
        try{
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response.status)
            console.log(response.data)
            readDishesInfo();
        } catch (error){
            console.error('Error admin dish deleting:', error)
        }
    }

    const handleChangePrice = async (dishName: string) => {
        const message = new DishPriceMessage(dishName, newPrice);
        try{
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response.status)
            console.log(response.data)
            setNewPrice('');
            readDishesInfo();
        } catch (error){
            console.error('Error admin dish price changing:', error)
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
        setNewPrice('');
        setDishToChange('');
        setChangeOpen(false);
    }

    const handleDeleteClose = () =>{
        setDishToChange('');
        setDeleteOpen(false);
    }

    const handleAddClose = () =>{
        setNewDish({ name: '', path: '', price: '' });
        setPreviewImage('');
        setAddOpen(false);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewDish((prev) => ({ ...prev, path: file.name }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string); // Cast to string for the image preview
            };
            reader.readAsDataURL(file); // Ensure the file is read as a data URL
        }
    };

    const HiddenInput = styled('input')({
        display: 'none',
    });

    useEffect(() => {
        readDishesInfo()
    }, [])

    return (
        <Container style={{ maxHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <h1>菜单管理:</h1>
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
                                    <Button variant="contained" color="primary" onClick={() =>{
                                        setDishToChange(dish.name);
                                        setChangeOpen(true);
                                    }}>
                                        <Typography>更改价格</Typography>
                                    </Button>
                                    <Button variant="contained" color="error" onClick={() => {
                                        setDishToChange(dish.name);
                                        setDeleteOpen(true);
                                    }}>
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
            <Dialog open={changeOpen} fullWidth >
                <DialogTitle>更改{dishToChange}的价格</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        原价为{dishes.find(dish => dish.name === dishToChange)?.price}，输入更新后的价格：
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New price"
                        value={newPrice}
                        onChange={
                            (e) => {
                                setNewPrice(e.target.value);
                            }
                        }
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleChangeClose} color="primary">
                        取消
                    </Button>
                    <Button onClick={() => {
                        handleChangePrice(dishToChange);
                        handleChangeClose();
                    }} color="primary">
                        提交
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={deleteOpen} fullWidth >
                <DialogTitle>删除{dishToChange}？</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        此操作无法撤销！
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} color="primary">
                        取消
                    </Button>
                    <Button onClick={() => {
                        handleDeleteDish(dishToChange);
                        handleDeleteClose();
                    }} color="primary">
                        提交
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={addOpen} fullWidth>
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
                            <TextField
                                label="Image Path"
                                name="path"
                                value={newDish.path}
                                // fullWidth
                                margin="normal"
                                disabled
                            />
                            <label htmlFor="image-upload">
                                <HiddenInput
                                    accept="image/*"
                                    id="image-upload"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                                <Button variant="contained" component="span" sx={{ ml: 2, mt: 2 }}>
                                    Upload Image
                                </Button>
                            </label>
                        </Box>
                        {previewImage && (
                            <Box sx={{ mt: 2 }}>
                                <img src={previewImage} alt="Image Preview" style={{ maxWidth: '100%', marginTop: '10px' }} />
                            </Box>
                        )}
                    </Box>
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
