import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import {
    Button,
    Typography,
    Box,
    Dialog,
    TextField,
    CardMedia,
    Card, Grid, CardContent, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material'
import axios from 'axios'
import {
    DishChangeMessage,
    DishQueryMessage,
    DishPriceMessage,
    DishDeleteMessage,
} from 'Plugins/AdminAPI/AdminDishMessage'
import { styled } from '@mui/styles'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ChatPanel from 'Plugins/CommonUtils/ChatPanel'
import { AdminQueryMessage } from 'Plugins/AdminAPI/AdminQueryMessage'
import backgroundImage from 'Images/background.png'

interface Dish {
    name: string;
    path: string;
    price: string;
    orders: number; // Total number of orders on this dish
    rating: number;
}

interface LogInfo {
    orderid: string,
    orderPart: string,
    userName: string,
    chefName: string,
    dishName: string,
    quantity: string,
    price: string,
    takeaway: string,
    state: string,
    rating: string
}

export function AdminDishPage() {
    const history = useHistory()
    const [newDish, setNewDish] = useState<Dish>({ name: '', path: '', price: '', orders: 0, rating: 0 })
    const [dishes, setDishes] = useState<Dish[]>([])

    const [dishToChange, setDishToChange] = useState<string>('')
    const [previewImage, setPreviewImage] = useState<string>('')
    const [newPrice, setNewPrice] = useState<string>('')
    const [changeOpen, setChangeOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [addOpen, setAddOpen] = useState(false)

    const parseDishes = (data: string): Dish[] => {
        return data.split('\n').map(line => {
            const [name, path, price] = line.split(',')
            return { name, path, price, orders: 0, rating: 0 }
        })
    }

    const calculateDishInfo = (logInfos: LogInfo[], _dishes: Dish[]) => {
        const dishData: { [key: string]: { orders: number; ratings: number[] } } = {}
        logInfos.forEach(log => {
            const dish = log.dishName
            const rating = parseFloat(log.rating)
            const quantity = parseInt(log.quantity, 10)
            if (!dishData[dish]) {
                dishData[dish] = { orders: 0, ratings: [] }
            }
            dishData[dish].orders += quantity
            if (rating != 0) {
                dishData[dish].ratings.push(rating)
            }
        })
        const updatedDishInfo = _dishes.map(dish => {
            const data = dishData[dish.name]
            if (data) {
                const sumRatings = data.ratings.reduce((acc, rating) => acc + rating, 0)
                const averageRating = data.ratings.length > 0 ? sumRatings / data.ratings.length : 0
                return {
                    ...dish,
                    orders: data.orders,
                    rating: averageRating,
                }
            } else {
                return {
                    ...dish,
                    orders: 0,
                    rating: 0,
                }
            }
        })
        setDishes(updatedDishInfo)
    }

    const readDishesInfo = async () => {
        const qmessage = new DishQueryMessage()
        let _dishes : Dish[] = []
        try {
            const response = await axios.post(qmessage.getURL(), JSON.stringify(qmessage), {
                headers: { 'Content-Type': 'application/json' },
            })
            _dishes = parseDishes(response.data)
        } catch (error) {
            console.error('Error querying dishes:', error)
        }

        const message = new AdminQueryMessage()
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            calculateDishInfo(response.data, _dishes)
        } catch (error) {
            console.error('Error admin-querying:', error)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewDish(prev => ({ ...prev, [name]: value }))

        if (name === 'path') {
            try {
                const previewPath = require(`../../Images/${value}`).default
                setPreviewImage(previewPath)
            } catch (error) {
                setPreviewImage('')
            }
        }
    }

    const handleAddDish = async () => {
        const message = new DishChangeMessage(newDish.name, newDish.path, newDish.price)
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response.status)
            console.log(response.data)
            setNewDish({ name: '', path: '', price: '', orders: 0, rating: 0 })
            setPreviewImage('')
            readDishesInfo()
        } catch (error) {
            console.error('Error admin dish adding:', error)
        }
    }

    const handleDeleteDish = async (dishName: string) => {
        const message = new DishDeleteMessage(dishName)
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response.status)
            console.log(response.data)
            readDishesInfo()
        } catch (error) {
            console.error('Error admin dish deleting:', error)
        }
    }

    const handleChangePrice = async (dishName: string) => {
        const message = new DishPriceMessage(dishName, newPrice)
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response.status)
            console.log(response.data)
            setNewPrice('')
            readDishesInfo()
        } catch (error) {
            console.error('Error admin dish price changing:', error)
        }
    }

    const getImagePath = (path: string): string => {
        try {
            return require(`../../Images/${path}`).default
        } catch (error) {
            return require(`../../Images/default.jpg`).default
        }
    }

    const handleChangeClose = () => {
        setNewPrice('')
        setDishToChange('')
        setChangeOpen(false)
    }

    const handleDeleteClose = () => {
        setDishToChange('')
        setDeleteOpen(false)
    }

    const handleAddClose = () => {
        setNewDish({ name: '', path: '', price: '', orders: 0, rating: 0 })
        setPreviewImage('')
        setAddOpen(false)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setNewDish((prev) => ({ ...prev, path: file.name }))
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result as string) // Cast to string for the image preview
            }
            reader.readAsDataURL(file) // Ensure the file is read as a data URL
        }
    }

    const HiddenInput = styled('input')({
        display: 'none',
    })

    useEffect(() => {
        readDishesInfo()
    }, [])

    return (
        <div className='root' style={{backgroundImage: `url(${backgroundImage})`}}>
            <Box className='cover' />
            <Box className='main-box'>
                <Grid>
                    <h1 style={{marginTop:0}}>
                        菜单管理:
                    </h1>
                </Grid>
                <Grid container spacing={4} style={{
                    height: '75vh',
                    overflowY: 'auto',
                    marginTop: '0'
                }}>
                    {dishes.map((dish) => (
                        <Grid item xs={12} sm={6} md={4} key={dish.name} paddingLeft='16px !important' paddingRight='16px'>
                            <Card sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                overflowY: 'auto'
                            }}>
                                <CardMedia component="img" height="140" src={getImagePath(dish.path)} alt={dish.name} />
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <Typography variant="h5" fontFamily='Merriweather'>{dish.name}</Typography>
                                    <Box>
                                        <Typography variant="subtitle1">价格：{dish.price}元</Typography>
                                        <Typography variant="subtitle1">订单量：{dish.orders}, 评分：{dish.rating === 0? 'N/A' : dish.rating.toFixed(2)}</Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" justifyContent='space-between'>
                                        <Button variant="contained" color="primary" className='button' onClick={() => {
                                            setDishToChange(dish.name)
                                            setChangeOpen(true)
                                        }}>
                                            更改价格
                                        </Button>
                                        <Button variant="contained" color="error" className='button' onClick={() => {
                                            setDishToChange(dish.name)
                                            setDeleteOpen(true)
                                        }}>
                                            移除
                                        </Button>
                                    </Box>

                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box display="flex" mt={2} justifyContent="space-between" className="button-container" marginBottom='0'>
                    <Button variant="contained" color="primary" className='button' onClick={() => {
                        setAddOpen(true)
                    }} style={{ marginTop: '10px' }}>
                        添加菜品
                    </Button>
                    <Button variant="contained" color="secondary" className='button' onClick={() => {
                        history.push('/admin')
                    }} style={{ marginTop: '10px' }}>
                        返回
                    </Button>
                </Box>
                <Dialog open={changeOpen} fullWidth>
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
                                    setNewPrice(e.target.value)
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
                            handleChangePrice(dishToChange)
                            handleChangeClose()
                        }} color="primary">
                            提交
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={deleteOpen} fullWidth>
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
                            handleDeleteDish(dishToChange)
                            handleDeleteClose()
                        }} color="primary">
                            提交
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={addOpen} fullWidth>
                    <DialogTitle>
                        <Typography variant="h4" component="h1" align="center" gutterBottom sx={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginBottom: '1rem'
                        }}>
                            添加菜品
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            填写新菜品的信息：
                        </DialogContentText>
                        <TextField
                            label="菜品名"
                            name="name"
                            value={newDish.name}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
                                <TextField
                                    label="图片路径"
                                    name="path"
                                    value={newDish.path}
                                    // fullWidth
                                    margin="normal"
                                    disabled
                                />
                                <label htmlFor="image-upload" >
                                    <HiddenInput
                                        accept="image/*"
                                        id="image-upload"
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                    <Button variant="contained" component="span" sx={{ ml: 2 }} className='button'>
                                        选择图片
                                    </Button>
                                </label>
                            </Box>
                            {previewImage && (
                                <Box sx={{ mt: 2 }}>
                                    <img src={previewImage} alt="Image Preview"
                                         style={{ maxWidth: '100%', marginTop: '10px' }} />
                                </Box>
                            )}
                        </Box>
                        <TextField
                            label="价格"
                            name="price"
                            value={newDish.price}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAddClose} color="primary" sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                            取消
                        </Button>
                        <Button onClick={() => {
                            if (newDish.name != '') {
                                handleAddDish()
                            }
                            handleAddClose()
                        }} color="primary" sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                            提交
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <ChatPanel/>
        </div>
    )
}
