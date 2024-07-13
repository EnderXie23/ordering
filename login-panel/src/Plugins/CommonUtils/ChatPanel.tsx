import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Box, TextField, IconButton, List, ListItem, Paper, ListItemText, Fab, Drawer } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import { useUser } from 'Pages/UserContext'
import api from '../../api'

interface message{
    content: string,
    role: string
}

const ChatPanel = () => {
    const [messages, setMessages] = useState<message[]>([{content: "You're a helpful assistant.", role: "system"}]);
    const [input, setInput] = useState('');
    const [open, setOpen] = useState(false);
    const {name} = useUser();
    const userName = name.split('\n')[0];
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

    const getReply = () => {
        try{
            axios(config)
                .then((response) => {
                    // console.log(JSON.stringify(response.data));
                    setMessages([...messages, { content: response.data.choices[0].message.content, role: "Bot" }]);
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error){
            console.error('Error in handleSendMessage:', error)
        }
    }

    const handleSendMessage = () => {
        if (input.trim()) {
            setMessages([...messages, { content: input, role: userName }]);
            setInput('');
        }
    };

    useEffect(() => {
        if(messages[messages.length - 1].role == userName){
            getReply();
        }
    }, [messages]);

    const handleOpen = () => {
        setOpen(true);
        const storedMessages = localStorage.getItem(`chatMessages_${userName}`);
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
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
                        width: 350,
                        height: '70%',
                        bottom: 0,
                        top: 'auto',
                        position: 'fixed',
                    },
                }}
            >
                <Box sx={{ padding: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                        {messages
                            .filter((message) => message.role !== "system")
                            .map((message, index) => (
                            <ListItem key={index} sx={{ display: 'flex', justifyContent: message.role === userName ? 'flex-end' : 'flex-start' }}>
                                <Paper sx={{ padding: 1, borderRadius: 2, maxWidth: '75%', backgroundColor: message.role === userName ? '#DCF8C6' : '#FFF' }}>
                                    <ListItemText primary={message.content} secondary={message.role} />
                                </Paper>
                            </ListItem>
                        ))}
                    </List>
                    <Box sx={{ display: 'flex', mt: 2 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Type a message"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <IconButton color="primary" onClick={handleSendMessage}>
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Drawer>
        </div>
    );
};

export default ChatPanel;
