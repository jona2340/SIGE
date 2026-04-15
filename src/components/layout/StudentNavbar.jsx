import React, { useState } from 'react';
import {
    AppBar, Toolbar, IconButton, Typography, Avatar, Box,
    Badge, Menu, MenuItem, ListItemIcon, Divider, Tooltip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssessmentIcon from '@mui/icons-material/Assessment'; // 🚀 Nuevo ícono importado
import { logoutUser } from '../../service/authService';

const fontText = '"Montserrat", sans-serif';

// Botón de navegación reutilizable adaptado al color del estudiante
function NavTab({ label, icon, path, active, onClick }) {
    return (
        <Box onClick={onClick} sx={{
            display: 'flex', alignItems: 'center', gap: 0.8, cursor: 'pointer',
            px: 1.8, py: 0.8, borderRadius: 2,
            bgcolor: active ? 'rgba(0, 137, 123, 0.1)' : 'transparent',
            borderBottom: active ? '2px solid #00897b' : '2px solid transparent',
            transition: 'all 0.15s ease',
            '&:hover': { bgcolor: 'rgba(0, 137, 123, 0.07)' },
        }}>
            {React.cloneElement(icon, { sx: { fontSize: 18, color: active ? '#00897b' : '#888' } })}
            <Typography sx={{
                fontFamily: fontText, fontSize: '0.82rem',
                fontWeight: active ? 700 : 500,
                color: active ? '#00897b' : '#666',
            }}>
                {label}
            </Typography>
        </Box>
    );
}

export default function StudentNavbar({ handleDrawerToggle, user, drawerWidth = 260 }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const isActive = (path) => location.pathname === path;

    return (
        <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` }, bgcolor: 'white', color: '#333', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: { sm: '64px' } }}>
                
                {/* Izquierda: menú hamburguesa + tabs de navegación */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1, display: { sm: 'none' }, color: '#00897b' }}>
                        <MenuIcon />
                    </IconButton>

                    {/* Tabs de navegación — visibles en sm+ */}
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
                        <NavTab
                            label="Inicio"
                            icon={<DashboardIcon />}
                            active={isActive('/dashboard/estudiante')} 
                            onClick={() => navigate('/dashboard/estudiante')} 
                        />
                        <NavTab
                            label="Mis Materias"
                            icon={<MenuBookIcon />}
                            active={isActive('/estudiante/materias')} 
                            onClick={() => navigate('/estudiante/materias')} 
                        />
                        {/* 🚀 NUEVA PESTAÑA: Mi Promedio */}
                        <NavTab
                            label="Mi Promedio"
                            icon={<AssessmentIcon />}
                            active={isActive('/estudiante/reporte')} 
                            onClick={() => navigate('/estudiante/reporte')} 
                        />
                    </Box>
                </Box>

                {/* Derecha: notificaciones + perfil */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                    <Tooltip title="Notificaciones">
                        <IconButton sx={{ color: '#666' }}>
                            <Badge badgeContent={3} color="error"><NotificationsIcon /></Badge>
                        </IconButton>
                    </Tooltip>

                    <Box onClick={handleClick} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', '&:hover': { bgcolor: '#f3f4f6' } }}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                            <Typography variant="body2" sx={{ fontFamily: fontText, fontWeight: 600, color: '#333', lineHeight: 1.2 }}>
                                {user ? user.nombre.split(' ')[0] : '...'}
                            </Typography>
                            <Typography variant="caption" sx={{ fontFamily: fontText, color: '#888' }}>
                                {user ? user.matricula : '...'}
                            </Typography>
                        </Box>

                        <Avatar src={user?.fotoPerfil || undefined} sx={{ bgcolor: '#00897b', width: 38, height: 38, fontWeight: 'bold' }}>
                            {!user?.fotoPerfil && user?.nombre ? user.nombre.charAt(0).toUpperCase() : ''}
                        </Avatar>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}