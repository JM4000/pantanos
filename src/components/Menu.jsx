import React from 'react'
import { Box, AppBar, Typography, Toolbar } from '@mui/material';

function Menu({handler}) {

    return (
        <Box id="title" sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{backgroundColor: "#007a33"}}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Typography variant="h6" color="inherit" component="div">
                        Embalses en Andalucía
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Menu