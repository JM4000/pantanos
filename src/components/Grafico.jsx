import React from 'react'
import { LineChart, Line, CartesianGrid, Tooltip, YAxis, XAxis } from 'recharts';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';

const Grafico = ({ rows }) => {
    return (
        <Paper variant='outlined' sx={{overflow: "auto"}}>
            <Box padding={1} >
                <LineChart width={600} height={300} data={rows}>
                    <Line type="monotone" dataKey="expected" stroke="#8884d8" dot={false} />
                    <CartesianGrid stroke="#ccc" />
                    <YAxis/>
                    <XAxis dataKey="date" hide />
                    <Tooltip />
                </LineChart>
            </Box>
            <Box padding={1}>
                <LineChart width={600} height={300} data={rows}>
                    <Line type="monotone" dataKey="predicted" stroke="#8884d8" dot={false} />
                    <CartesianGrid stroke="#ccc" />
                    <YAxis />
                    <XAxis dataKey="date" hide />
                    <Tooltip />
                </LineChart>
            </Box>
        </Paper>
    )
}

export default Grafico