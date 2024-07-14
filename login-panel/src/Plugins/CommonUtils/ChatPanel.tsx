import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Box, TextField, IconButton, List, ListItem, Paper, ListItemText, Fab, Drawer, Typography, AppBar, Toolbar, CircularProgress }
    from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import { useUser } from 'Pages/UserContext'
import { DishQueryMessage } from 'Plugins/AdminAPI/AdminDishMessage'
import api from '../../api'

interface message{
    content: string,
    role: string
}

const ChatPanel = () => {
    const {name} = useUser();
    const userName = name.split('\n')[0];
    const [messages, setMessages] = useState<message[]>([]);
    const [input, setInput] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const listRef = useRef(null);

    let APIKEY = api.api_key;

    let data = JSON.stringify({
        "messages": messages.map(message => ({
            ...message,
            role: message.role === userName ? "user" : message.role === "system" ? "system" : "assistant"
        })),
        "model": "deepseek-chat",
        "frequency_penalty": 0,
        "max_tokens": 256,
        "presence_penalty": 0,
        "stop": null,
        "stream": false,
        "temperature": 1,
        "top_p": 1,
        "logprobs": false,
        "top_logprobs": null
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.deepseek.com/chat/completions',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${APIKEY}`
        },
        data : data
    };

    const dishesInfo = (data: string): string => {
        return data.split('\n').map(line => {
            const [name, path, price] = line.split(',');
            return name+ '(' +price+'元)';
        }).join(',');
    };

    const getReply = () => {
        setLoading(true);
        try{
            axios(config)
                .then((response) => {
                    setMessages((prevMessages) =>
                        prevMessages.map((message, index) =>
                            index === prevMessages.length - 1 && message.role === "loading"
                                ? { content: response.data.choices[0].message.content, role: "Bot" }
                                : message
                        )
                    );
                })
        } catch (error){
            setMessages((prevMessages) =>
                prevMessages.map((message, index) =>
                    index === prevMessages.length - 1 && message.role === "loading"
                        ? { content: 'Error: Failed to get response', role: "Bot" }
                        : message
                )
            );
            console.error('Error in handleSendMessage:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleSendMessage = () => {
        if (input.trim()) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { content: input, role: userName },
                { content: '', role: 'loading' },
            ]);
            setInput('');
        }
    };

    const welcomeCustomer = async() => {
        const qmessage = new DishQueryMessage();
        try {
            const response = await axios.post(qmessage.getURL(), JSON.stringify(qmessage), {
                headers: { 'Content-Type': 'application/json' },
            });
            setMessages([{ content: '现在你是米麒麟餐厅的介绍员，餐厅内有' +
                    dishesInfo(response.data) +
                    '除去上述菜品之外，餐厅暂时没有其他菜品。' +
                    '请你为顾客提供服务，耐心解答他们的问题，并向他们推荐菜品。', role: 'system' },
                { content: '你好，我是米麒麟餐厅的介绍员，有什么可以帮到您的吗？', role: 'Bot' }]);
        } catch (error) {
            setMessages([{ content: '现在你是米麒麟餐厅的介绍员，餐厅内有Spaghetti Carbonara(125元),' +
                    'Margherita Pizza(100元),Caesar Salad(25元),Tiramisu(50元),' +
                    '除去上述菜品之外，餐厅暂时没有其他菜品。' +
                    '请你为顾客提供服务，耐心解答他们的问题，并向他们推荐菜品。', role: 'system' },
                { content: '你好，我是米麒麟餐厅的介绍员，有什么可以帮到您的吗？', role: 'Bot' }]);
            console.error('Error querying dishes:', error);
        }
    }

    useEffect(() => {
        if(messages.length > 0 && messages[messages.length - 1].role == 'loading'){
            getReply();
        }
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages]);

    const handleOpen = () => {
        setOpen(true);
        const storedMessages = localStorage.getItem(`chatMessages_${userName}`);
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }
        if (messages.length === 0 && userName != "admin") {
            welcomeCustomer();
        }
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    };

    const handleClose = () => {
        setOpen(false);
        localStorage.setItem(`chatMessages_${userName}`, JSON.stringify(messages));
    };

    return (
        <div>
            <Fab
                color="primary"
                onClick={handleOpen}
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
                <ChatIcon />
            </Fab>
            <Drawer
                anchor="right"
                open={open}
                onClose={handleClose}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 400,
                        height: '80%',
                        bottom: 0,
                        top: 'auto',
                        position: 'fixed',
                        borderRadius: '16px 16px 0 0',
                        boxShadow: 3,
                    },
                }}
            >
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            AI助手
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box sx={{ padding: 2, height: '85%', display: 'flex', flexDirection: 'column' }}>
                    <List ref={listRef} sx={{ flexGrow: 1, overflow: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '12px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#888',
                            borderRadius: '10px',
                            border: '3px solid #f1f1f1',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: '#555',
                        } }}>
                        {messages
                            .filter((message) => message.role !== "system")
                            .map((message, index) => (
                                <ListItem key={index} sx={{ display: 'flex', justifyContent: message.role === userName ? 'flex-end' : 'flex-start' }}>
                                    <Paper sx={{
                                        padding: 1,
                                        borderRadius: 2,
                                        maxWidth: '75%',
                                        background: message.role === userName
                                            ? 'linear-gradient(135deg, #DCF8C6 0%, #A1F0A1 100%)'
                                            : 'linear-gradient(135deg, #FFF 0%, #EEE 100%)',
                                    }}>
                                        <ListItemText primary={message.content} secondary={message.role === "loading" ? <CircularProgress size={20} /> : message.role} />
                                    </Paper>
                                </ListItem>
                            ))}
                    </List>
                    <Box sx={{ display: 'flex', mt: 2 }}>
                        <TextField
                            disabled={loading}
                            fullWidth
                            variant="outlined"
                            placeholder="输入您的问题…"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#FFF',
                                    boxShadow: 1,
                                }
                            }}
                        />
                        <IconButton color="primary" onClick={handleSendMessage} sx={{ ml: 1 }}>
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Drawer>
        </div>
    );
};

export default ChatPanel;
