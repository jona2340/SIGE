import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Avatar,
    Box,
    Badge,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider
} from '@mui/material';

// Íconos
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

// Recibimos "handleDrawerToggle" como prop para poder abrir el menú lateral en celulares
export default function StudentNavbar({ handleDrawerToggle, drawerWidth = 260 }) {
    // Estado para controlar el menú desplegable del perfil
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const fontText = '"Montserrat", sans-serif';

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
                bgcolor: 'white',
                color: '#333',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>

                {/* Botón de Menú (Solo visible en móviles) */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' }, color: '#00897b' }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ fontFamily: fontText, fontWeight: 600, display: { xs: 'none', sm: 'block' } }}
                    >
                        Panel de Estudiante
                    </Typography>
                </Box>

                {/* Sección Derecha: Notificaciones y Perfil */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>

                    {/* Campanita de Notificaciones */}
                    <IconButton sx={{ color: '#666' }}>
                        <Badge badgeContent={3} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    {/* Avatar y Menú de Usuario */}
                    <Box
                        onClick={handleClick}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            transition: 'background-color 0.2s',
                            '&:hover': { bgcolor: '#f3f4f6' }
                        }}
                    >
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                            <Typography variant="body2" sx={{ fontFamily: fontText, fontWeight: 600, color: '#333', lineHeight: 1.2 }}>
                                Jonathan
                            </Typography>
                            <Typography variant="caption" sx={{ fontFamily: fontText, color: '#888' }}>
                                1720110000
                            </Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: '#00897b', width: 38, height: 38, fontWeight: 'bold' }}>
                            J
                        </Avatar>
                    </Box>

                    {/* Menú Desplegable del Perfil */}
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                                mt: 1.5,
                                minWidth: 200,
                                borderRadius: 2,
                                '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem sx={{ fontFamily: fontText }}>
                            <ListItemIcon><PersonIcon fontSize="small" sx={{ color: '#00897b' }} /></ListItemIcon>
                            Mi Perfil
                        </MenuItem>
                        <MenuItem sx={{ fontFamily: fontText }}>
                            <ListItemIcon><SettingsIcon fontSize="small" sx={{ color: '#666' }} /></ListItemIcon>
                            Configuración
                        </MenuItem>
                        <Divider />
                        <MenuItem sx={{ fontFamily: fontText, color: '#d32f2f' }}>
                            <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#d32f2f' }} /></ListItemIcon>
                            Cerrar Sesión
                        </MenuItem>
                    </Menu>

                </Box>
            </Toolbar>
        </AppBar>
    );
}