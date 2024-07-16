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
import backgroundImage from 'Images/background.png'

export function AdminPage(){
    const history=useHistory()
    const {name, setName} = useUser()

    useEffect(() => {
        if (!name) {
            setName('admin\nadmin')
        }
    }, [])

    return (
        <div className='root' style={{backgroundImage: `url(${backgroundImage})`}}>
            <Box className='cover' />
            <Box className='main-box'>
                <Typography variant="h4" align="center" gutterBottom marginBottom={5} sx={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    marginBottom: '2rem'
                }}>
                    管理员页面
                </Typography>
                <Box display="flex" flexDirection="column" alignItems="stretch" mt={2} className="button-container" gap={2} margin={0}>
                    <Button variant="outlined" className="button" startIcon={<RestaurantMenuIcon />} onClick={() => history.push("/admin-dish")}>
                        查看菜品
                    </Button>
                    <Button variant="outlined" className="button" startIcon={<ReceiptIcon />} onClick={() => history.push("/admin-order")}>
                        查看订单
                    </Button>
                    <Button variant="outlined" className="button" startIcon={<RateReviewIcon />} onClick={() => {history.push('/admin-rating')}}>
                        顾客评价
                    </Button>
                    <Button variant="outlined" className="button" startIcon={<StarIcon />} onClick={() => {history.push('/admin-chef')}}>
                        厨师概况
                    </Button>
                    <ChatPanel />
                    <Button color="secondary" onClick={() => {history.push('/')}} sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                        主页
                    </Button>
                </Box>
            </Box>
        </div>
    )
}
