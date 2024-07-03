import React from 'react';
import { Container, Grid, Paper, Typography } from '@material-ui/core';
import Sidebar from './components/Sidebar';
import FarmGrid from './components/FarmGrid';

function App() {
  return (
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Sidebar />
          </Grid>
          <Grid item xs={9}>
            <Paper>
              <Typography variant="h4" gutterBottom>
                QQ Farm Clone
              </Typography>
              <FarmGrid />
            </Paper>
          </Grid>
        </Grid>
      </Container>
  );
}

export default App;
