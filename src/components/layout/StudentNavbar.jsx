import React, { useState } from 'react';
import {
    AppBar, Toolbar, IconButton, Typography, Avatar, Box,
    Badge, Menu, MenuItem, ListItemIcon, Divider
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { logoutUser } from '../../service/authService';

export default function StudentNavbar({ handleDrawerToggle, user, drawerWidth = 260 }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const fontText = '"Montserrat", sans-serif';

    return (
        <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` }, bgcolor: 'white', color: '#333', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' }, color: '#00897b' }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ fontFamily: fontText, fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
                        Panel de Estudiante
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                    <IconButton sx={{ color: '#666' }}>
                        <Badge badgeContent={3} color="error"><NotificationsIcon /></Badge>
                    </IconButton>

                    <Box onClick={handleClick} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', '&:hover': { bgcolor: '#f3f4f6' } }}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                            <Typography variant="body2" sx={{ fontFamily: fontText, fontWeight: 600, color: '#333', lineHeight: 1.2 }}>
                                {user ? user.nombre.split(' ')[0] : '...'}
                            </Typography>
                            <Typography variant="caption" sx={{ fontFamily: fontText, color: '#888' }}>
                                {user ? user.matricula : '...'}
                            </Typography>
                        </Box>

                        {/* Avatar dinámico */}
                        <Avatar src={user?.fotoPerfil || undefined} sx={{ bgcolor: '#00897b', width: 38, height: 38, fontWeight: 'bold' }}>
                            {!user?.fotoPerfil && user?.nombre ? user.nombre.charAt(0).toUpperCase() : ''}
                        </Avatar>
                    </Box>

                </Box>
            </Toolbar>
        </AppBar>
    );
}