import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { Box, Button, Container, Typography } from '@mui/material'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import ReceiptIcon from '@mui/icons-material/Receipt'
import RateReviewIcon from '@mui/icons-material/RateReview'
import StarIcon from '@mui/icons-material/Star'
import '../index.css'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ChatPanel from 'Plugins/CommonUtils/ChatPanel'
import { useUser } from 'Pages/UserContext'

export function AdminPage(){
    const history=useHistory()
    const {name, setName} = useUser()

    useEffect(() => {
        if (!name) {
            setName('admin\nadmin')
        }
    }, [])

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom marginBottom={5}>
                管理员页面
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="stretch" mt={2} className="button-container" gap={2}>
                <Button variant="outlined" className="custom-button" startIcon={<RestaurantMenuIcon />} onClick={() => history.push("/admin-dish")}>
                    查看菜品
                </Button>
                <Button variant="outlined" className="custom-button" startIcon={<ReceiptIcon />} onClick={() => history.push("/admin-order")}>
                    查看订单
                </Button>
                <Button variant="outlined" className="custom-button" startIcon={<RateReviewIcon />} >
                    菜品评价
                </Button>
                <Button variant="outlined" className="custom-button" startIcon={<StarIcon />} onClick={() => {history.push('/admin-chef')}}>
                    厨师评价
                </Button>
                <ChatPanel />
                <Button color="secondary" onClick={() => {history.push('/')}}>
                    主页
                </Button>
            </Box>
        </Container>
    )
}
