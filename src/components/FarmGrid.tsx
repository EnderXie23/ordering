import React from 'react';
import { Grid, Paper } from '@material-ui/core';

const FarmGrid = () => {
    const rows = 5;
    const cols = 5;
    const createGrid = () => {
        let grid = [];
        for (let i = 0; i < rows; i++) {
            let row = [];
            for (let j = 0; j < cols; j++) {
                row.push(
                    <Grid item xs key={`${i}-${j}`}>
                        <Paper style={{ height: 100, backgroundColor: '#c8e6c9' }} />
                    </Grid>
                );
            }
            grid.push(
                <Grid container item xs={12} spacing={1} key={i}>
                    {row}
                </Grid>
            );
        }
        return grid;
    };

    return (
        <Grid container spacing={1}>
            {createGrid()}
        </Grid>
    );
};

export default FarmGrid;
