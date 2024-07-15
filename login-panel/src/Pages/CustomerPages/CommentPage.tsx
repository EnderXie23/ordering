import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Box,
    ListItem,
    ListItemText,
    Card,
    Rating,
    CircularProgress, Grid, Alert,
} from '@mui/material'
import { List } from 'antd'
import { useUser } from 'Pages/UserContext'
import { CustomerCommentMessage } from 'Plugins/CustomerAPI/CustomerCommentMessage'
import { ReadCommentsMessage } from 'Plugins/CustomerAPI/ReadCommentsMessage'
import { useHistory } from 'react-router'
import { DishRatingMessage } from 'Plugins/CustomerAPI/DishRatingMessage'

interface displayComment {
    id: number;
    author: string;
    text: string;
    overallRating: number;
    tasteRating: number;
    packagingRating: number;
    serviceRating: number;
    envRating: number;
}

interface Comment {
    customerName: string,
    chefName: string,
    comment: string,
    overall: string,
    taste: string,
    pack: string,
    serv: string,
    env: string
}

function parseComments(rawComments: Comment[]): displayComment[] {
    return rawComments.map((comment,index) => ({
        id: index,
        author: comment.customerName,
        text: comment.comment,
        overallRating: parseFloat(comment.overall),
        tasteRating: parseFloat(comment.taste),
        packagingRating: parseFloat(comment.pack),
        serviceRating: parseFloat(comment.serv),
        envRating: parseFloat(comment.env),
    }));
}

const CommentPage: React.FC = () => {
    const [comments, setComments] = useState<displayComment[]>([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const {name, orderedDishes,OrderID } = useUser()
    const username = name.split('\n')[1]
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const [successMessage, setSuccessMessage] = useState('');

    const [author, setAuthor] = useState(username);
    const [text, setText] = useState('');

    const [dishRatings, setDishRatings] = useState(
        orderedDishes.map(dish => ({ name: dish.name, rating: 0 }))
    );
    const [overallRating, setOverallRating] = useState(0);
    const [tasteRating, setTasteRating] = useState(0);
    const [packagingRating, setPackagingRating] = useState(0);
    const [serviceRating, setServiceRating] = useState(0);
    const [envRating, setEnvRating] = useState(0);

    useEffect(() => {
        const totalRating = dishRatings.reduce((sum, dish) => sum + dish.rating, 0);
        const averageRating = dishRatings.length > 0 ? totalRating / dishRatings.length : 0;
        setOverallRating(averageRating);
    }, [dishRatings]);

    const handleRatingChange = (index: number, newRating: number) => {
        const updatedRatings = [...dishRatings];
        updatedRatings[index].rating = newRating;
        setDishRatings(updatedRatings);
    };

    useEffect(() => {
        const fetchComments = async () => {
            const message = new ReadCommentsMessage();
            try {
                const response = await axios.post(message.getURL(), JSON.stringify(message), {
                    headers: { 'Content-Type': 'application/json' },
                })
                setComments(parseComments(response.data));
            } catch (error) {
                console.error('Error fetching comments: ', error);
                const testComment = {
                    id: 1,
                    author: "None",
                    text: "Test",
                    createdAt: "A date",
                    overallRating: 4.5,
                    tasteRating: 5.0,
                    packagingRating: 4.5,
                    serviceRating: 4.0,
                    envRating: 5.0,
                }
                setComments([testComment])
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, []);

    const customerCommentRequest = async (message: CustomerCommentMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response.status)
            console.log(response.data)
        } catch (error) {
            console.error('Error submitting comment:', error)
        }
    }

    const handleSubmit = async () => {
        if (author === '' || text === '') {
            setErrorMessage('姓名或评价不能为空');
            return;
        }
        if (overallRating === 0 || tasteRating === 0 || packagingRating === 0 || serviceRating === 0 || envRating === 0) {
            setErrorMessage('请给出完整评分');
            return;
        }

        dishRatings.forEach(dish => {
            const message = new DishRatingMessage(OrderID, dish.name, dish.rating.toString());
            axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            }).then(response => {
                console.log(response.status)
                console.log(response.data)
            }).catch(error => {
                console.error('Error submitting dish rating:', error)
            })
        })
        const comment: Comment = {
            customerName: author,
            chefName: "chef",
            comment: text,
            overall: overallRating.toString(),
            taste: tasteRating.toString(),
            pack: packagingRating.toString(),
            serv: serviceRating.toString(),
            env: envRating.toString()
        };
        const commentMessage = new CustomerCommentMessage(comment);
        try {
            await customerCommentRequest(commentMessage);
            setSuccessMessage('评价成功');
            setErrorMessage('');
        } catch (error) {
            console.error('Error in handleQuery:', error);
        }
    }

    return (
        <Container maxWidth="md" style={{
            height: '90vh',
            overflowY: 'auto'
        }}>
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    评价
                </Typography>
                <form style={{ marginTop: '20px' }}>
                    <TextField
                        label="姓名"
                        variant="outlined"
                        fullWidth
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="评价"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                        style={{ marginBottom: '10px' }}
                    />
                    <Box>
                        {orderedDishes.map((dish, index) => (
                            <Box key={dish.name} mt={2} alignItems="center" justifyContent="center" display="flex">
                                <Typography>{dish.name}:</Typography>
                                <Rating
                                    value={dishRatings[index].rating}
                                    onChange={(e, newValue) => handleRatingChange(index, newValue)}
                                    precision={0.5}
                                />
                            </Box>
                        ))}
                        <Box mt={2} alignItems="center" justifyContent="center" display="flex">
                            <Typography>综合评分：{overallRating}</Typography>
                        </Box>
                    </Box>
                    <Grid container columns={2} mt={2} >
                        <Grid item xs={1} sm={1} md={1}>
                            <Typography>口味：</Typography>
                            <Box display="flex">
                                <Rating value={tasteRating} onChange={(e, newValue) => setTasteRating(newValue)} precision={0.5}/>
                                <Typography>{tasteRating}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={1} sm={1} md={1}>
                            <Typography>包装：</Typography>
                            <Box display="flex">
                                <Rating value={packagingRating} onChange={(e, newValue) => setPackagingRating(newValue)} precision={0.5}/>
                                <Typography>{packagingRating}</Typography>
                            </Box>
                        </Grid>
                        <Grid mt={1} item xs={1} sm={1} md={1}>
                            <Typography>服务：</Typography>
                            <Box display="flex">
                                <Rating value={serviceRating} onChange={(e, newValue) => setServiceRating(newValue)} precision={0.5}/>
                                <Typography>{serviceRating}</Typography>
                            </Box>
                        </Grid>
                        <Grid mt={1} item xs={1} sm={1} md={1}>
                            <Typography>环境：</Typography>
                            <Box display="flex">
                                <Rating value={envRating} onChange={(e, newValue) => setEnvRating(newValue)} precision={0.5}/>
                                <Typography>{envRating}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Button variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }} onClick={handleSubmit}>
                        Submit
                    </Button>
                    <Button variant="contained" color="secondary" fullWidth style={{ marginTop: '10px' }} onClick={() => history.push("/finish")}>
                        Back
                    </Button>
                </form>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}
            </Paper>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress />
                </Box>
            ) : (
                <Card style={{ marginTop: '20px' }}>
                    {comments.length === 0 ? (
                        <Typography>还没有评价。</Typography>
                    ) : (
                        <List>
                            {comments.map((comment) => (
                                <ListItem key={comment.id} alignItems="flex-start">
                                    <ListItemText
                                        primary={comment.author}
                                        secondary={
                                            <Typography component="span" style={{ whiteSpace: 'pre-line' }}>
                                                {`${comment.text}\n综合评价：${comment.overallRating}\n口味：${comment.tasteRating}, 包装：${comment.packagingRating}, 服务：${comment.serviceRating}, 环境：${comment.envRating}`}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Card>
            )}
        </Container>
    );
};

export default CommentPage;
