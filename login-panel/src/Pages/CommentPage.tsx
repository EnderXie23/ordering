import React, { useState, ChangeEvent } from 'react';
import { Container, Typography, Box, Button, TextField } from '@mui/material';
import { useHistory } from 'react-router-dom';

const Comment = () => {
    const history = useHistory();
    const [comment, setComment] = useState('');

    const handleCommentChange = (event: ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    };

    const handleSubmit = () => {
        // Handle the submit logic here (e.g., send to server)
        console.log('Comment:', comment);
        alert('感谢您的评论!');
        // Clear the input after submitting
        setComment('');
        history.push('/')
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                留下您的评论
            </Typography>
            <Box mt={4}>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="留下您的评论..."
                    margin="normal"
                />
                <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        提交评论
                    </Button>
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                    <Button variant="contained" color="secondary" onClick={() => { history.push('/') }}>
                        返回主页
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Comment;
