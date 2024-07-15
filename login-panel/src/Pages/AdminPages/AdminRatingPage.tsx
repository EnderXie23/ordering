import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Typography,
    Box,
    Rating, Button, Grid,
} from '@mui/material'
import { ReadCommentsMessage } from 'Plugins/CustomerAPI/ReadCommentsMessage'
import { useHistory } from 'react-router'
import CustomerSidebar from 'Pages/CustomerPages/CustomerSidebar/CustomerSidebar'

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

const AdminRatingPage: React.FC = () => {
    const history = useHistory();
    const [comments, setComments] = useState<displayComment[]>([]);
    const [averageRatings, setAverageRatings] = useState({
        overall: 0,
        taste: 0,
        packaging: 0,
        service: 0,
        env: 0,
    });

    const fetchComments = async () => {
        const message = new ReadCommentsMessage();
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            setComments(parseComments(response.data));
        } catch (error) {
            console.error('Error fetching comments: ',error);
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
        }
    };

    const updateInfo = async () => {
        // Calculate average ratings
        const totalRatings = comments.reduce((acc, comment) => {
            acc.overall += comment.overallRating;
            acc.taste += comment.tasteRating;
            acc.packaging += comment.packagingRating;
            acc.service += comment.serviceRating;
            acc.env += comment.envRating;
            return acc;
        }, { overall: 0, taste: 0, packaging: 0, service: 0, env: 0 });

        const averageRatings = {
            overall: totalRatings.overall / comments.length,
            taste: totalRatings.taste / comments.length,
            packaging: totalRatings.packaging / comments.length,
            service: totalRatings.service / comments.length,
            env: totalRatings.env / comments.length,
        };
        setAverageRatings(averageRatings);
    }

    useEffect(() => {
        fetchComments();
        updateInfo();
    }, []);

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={8}>
                <Typography variant="h4" gutterBottom>
                   顾客评价查看页面
                </Typography>
            </Box>
            <Grid container spacing={9} style={{
                width: '80vw',
                height: '70vh',
            }}>
                <Grid item xs={6} style={{
                    width: '350px',
                    height: '70vh',
                    overflowY: 'auto',
                }}>
                    {comments.map(comment => (
                        <Box key={comment.id} mb={2} p={2} border={1} borderRadius={4}>
                            <Typography variant="h6">{comment.author}</Typography>
                            <Typography variant="body1">{comment.text}</Typography>

                            <Box mt={1}>
                                <Typography>综合评分：{comment.overallRating}</Typography>
                                <Rating value={comment.overallRating} readOnly/>
                                <Typography>口味评分：{comment.tasteRating}</Typography>
                                <Rating value={comment.tasteRating} readOnly precision={0.5} />
                                <Typography>包装评分：{comment.packagingRating}</Typography>
                                <Rating value={comment.packagingRating} readOnly precision={0.5} />
                                <Typography>服务评分：{comment.serviceRating}</Typography>
                                <Rating value={comment.serviceRating} readOnly precision={0.5} />
                                <Typography>环境评分：{comment.envRating}</Typography>
                                <Rating value={comment.envRating} readOnly precision={0.5} />
                            </Box>
                        </Box>
                    ))}
                </Grid>
                <Grid item xs={6} >
                    <Box mt={4}>
                        <Typography variant="h5">平均分数：</Typography>
                        <Box mt={1}>
                            <Typography>综合评分：{averageRatings.overall.toFixed(2)}</Typography>
                            <Rating value={averageRatings.overall} readOnly precision={0.5} />
                            <Typography>口味评分：{averageRatings.taste.toFixed(2)}</Typography>
                            <Rating value={averageRatings.taste} readOnly precision={0.5} />
                            <Typography>包装评分：{averageRatings.packaging.toFixed(2)}</Typography>
                            <Rating value={averageRatings.packaging} readOnly precision={0.5} />
                            <Typography>服务评分：{averageRatings.service.toFixed(2)}</Typography>
                            <Rating value={averageRatings.service} readOnly precision={0.5} />
                            <Typography>环境评分：{averageRatings.env.toFixed(2)}</Typography>
                            <Rating value={averageRatings.env} readOnly precision={0.5} />
                        </Box>
                        <Button variant="contained" color="secondary" style={{ marginTop: '20px' }} fullWidth onClick={() => {
                            fetchComments();
                            updateInfo();
                        }}>
                            刷新
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Button variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }} onClick={() => {history.push("/admin")}}>
                返回
            </Button>
        </Box>
    );
};

export default AdminRatingPage;
