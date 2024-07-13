import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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
import { makeStyles } from '@material-ui/core/styles';
import { List } from 'antd'
import { useUser } from 'Pages/UserContext'
import { CustomerCommentMessage } from 'Plugins/CustomerAPI/CustomerCommentMessage'
import { useHistory } from 'react-router'

interface Comment {
    id: number;
    author: string;
    text: string;
    createdAt: string;
    overallRating: number;
    tasteRating: number;
    packagingRating: number;
    serviceRating: number;
    envRating: number;
}

interface Params {
    postId: string;
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
    },
    commentBox: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
    submitButton: {
        marginTop: theme.spacing(2),
    },
}));

const CommentPage: React.FC = () => {
    const { postId } = useParams<Params>();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const {name} = useUser()
    const username = name.split('\n')[1]
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const [successMessage, setSuccessMessage] = useState('');

    const [author, setAuthor] = useState(username);
    const [text, setText] = useState('');
    const [overallRating, setOverallRating] = useState(0);
    const [tasteRating, setTasteRating] = useState(0);
    const [packagingRating, setPackagingRating] = useState(0);
    const [serviceRating, setServiceRating] = useState(0);
    const [envRating, setEnvRating] = useState(0);

    const classes = useStyles();
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/posts/${postId}/comments`);
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments', error);
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
    }, [postId]);

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
        const commentMessage = new CustomerCommentMessage(
            author,
            "user",
            text,
            overallRating.toString(),
            tasteRating.toString(),
            packagingRating.toString(),
            serviceRating.toString(),
            envRating.toString());
        try {
            await customerCommentRequest(commentMessage);
            setSuccessMessage('评价成功');
            setErrorMessage('');
        } catch (error) {
            console.error('Error in handleQuery:', error);
        }
    }

    return (
        <Container maxWidth="md">
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress />
                </Box>
            ) : (
                <Card>
                    {comments.length === 0 ? (
                        <Typography>还没有评价。</Typography>
                    ) : (
                        <List>
                            {comments.map((comment) => (
                                <ListItem key={comment.id} alignItems="flex-start">
                                    <ListItemText
                                        primary={comment.author}
                                        secondary={
                                            <>
                                                <Typography mt={1}>{comment.text}</Typography>
                                                <Box mt={1}>
                                                    <Typography>综合评价：{comment.overallRating}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography>口味：{comment.tasteRating}, 包装：{comment.packagingRating}, 服务：{comment.serviceRating}, 环境：{comment.envRating}</Typography>
                                                </Box>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Card>
            )}
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
                    <Box mt={2} alignItems="center" justifyContent="center" display="flex">
                        <Typography>综合评分：</Typography>
                        <Rating value={overallRating} onChange={(e, newValue) => setOverallRating(newValue)} precision={0.5}/>
                    </Box>
                    <Grid container columns={2}>
                        <Grid item xs={1} sm={1} md={1}>
                            <Box mt={2}>
                                <Typography>口味：</Typography>
                                <Rating value={tasteRating} onChange={(e, newValue) => setTasteRating(newValue)} precision={0.5}/>
                            </Box>
                        </Grid>
                        <Grid item xs={1} sm={1} md={1}>
                            <Box mt={2}>
                                <Typography>包装：</Typography>
                                <Rating value={packagingRating} onChange={(e, newValue) => setPackagingRating(newValue)} precision={0.5}/>
                            </Box>
                        </Grid>
                        <Grid item xs={1} sm={1} md={1}>
                            <Box mt={2}>
                                <Typography>服务：</Typography>
                                <Rating value={serviceRating} onChange={(e, newValue) => setServiceRating(newValue)} precision={0.5}/>
                            </Box>
                        </Grid>
                        <Grid item xs={1} sm={1} md={1}>
                            <Box mt={2}>
                                <Typography>环境：</Typography>
                                <Rating value={envRating} onChange={(e, newValue) => setEnvRating(newValue)} precision={0.5}/>
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
        </Container>
    );
};

export default CommentPage;
