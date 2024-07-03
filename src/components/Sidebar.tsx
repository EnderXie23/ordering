import React from 'react';
import { Paper, List, ListItem, ListItemText } from '@material-ui/core';

const Sidebar = () => {
    return (
        <Paper>
            <List>
                <ListItem button>
        <ListItemText primary="Inventory" />
            </ListItem>
            <ListItem button>
    <ListItemText primary="Marketplace" />
        </ListItem>
        </List>
        </Paper>
);
};

export default Sidebar;
