import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Avatar, Box, Badge, Tooltip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ClassIcon from '@mui/icons-material/Class';

const fontText = '"Montserrat", sans-serif';
const accentColor = '#1e1e2d'; // Color oscuro institucional para el docente

// Botón de navegación reutilizable (Estilo StudentNavbar)
function NavTab({ label, icon, path, active, onClick }) {
    return (
        <Box onClick={onClick} sx={{
            display: 'flex', alignItems: 'center', gap: 0.8, cursor: 'pointer',
            px: 1.8, py: 0.8, borderRadius: 2,
            bgcolor: active ? 'rgba(30, 30, 45, 0.08)' : 'transparent',
            borderBottom: active ? `2px solid ${accentColor}` : '2px solid transparent',
            transition: 'all 0.15s ease',
            '&:hover': { bgcolor: 'rgba(30, 30, 45, 0.05)' },
        }}>
            {React.cloneElement(icon, { sx: { fontSize: 18, color: active ? accentColor : '#888' } })}
            <Typography sx={{
                fontFamily: fontText, fontSize: '0.82rem',
                fontWeight: active ? 700 : 500,
                color: active ? accentColor : '#666',
            }}>
                {label}
            </Typography>
        </Box>
    );
}

export default function DocentNavbar({ handleDrawerToggle, user, drawerWidth = 260 }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const isActive = (path) => location.pathname === path;

    return (
        <AppBar position="fixed" sx={{ 
            width: { sm: `calc(100% - ${drawerWidth}px)` }, 
            ml: { sm: `${drawerWidth}px` }, 
            bgcolor: 'white', color: '#333', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)' 
        }}>
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: { sm: '64px' } }}>
                
                {/* Izquierda: menú + tabs de navegación */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1, display: { sm: 'none' }, color: accentColor }}>
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
                        <NavTab
                            label="Inicio"
                            icon={<DashboardIcon />}
                            active={isActive('/dashboard/docente')}
                            onClick={() => navigate('/dashboard/docente')}
                        />
                        <NavTab
                            label="Mis Clases"
                            icon={<ClassIcon />}
                            active={isActive('/docente/clases')}
                            onClick={() => navigate('/docente/clases')}
                        />
                    </Box>
                </Box>

                {/* Derecha: notificaciones + perfil dinámico */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                    <Tooltip title="Notificaciones">
                        <IconButton sx={{ color: '#666' }}>
                            <Badge badgeContent={5} color="error"><NotificationsIcon /></Badge>
                        </IconButton>
                    </Tooltip>

                    <Box onClick={handleClick} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', '&:hover': { bgcolor: '#f3f4f6' } }}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                            <Typography variant="body2" sx={{ fontFamily: fontText, fontWeight: 600, color: '#333', lineHeight: 1.2 }}>
                                {user ? user.nombre.split(' ')[0] : 'Docente'}
                            </Typography>
                            <Typography variant="caption" sx={{ fontFamily: fontText, color: '#888' }}>
                                {user ? user.matricula : 'ID'}
                            </Typography>
                        </Box>

                        <Avatar src={user?.fotoPerfil || undefined} sx={{ bgcolor: accentColor, width: 38, height: 38, fontWeight: 'bold' }}>
                            {!user?.fotoPerfil && user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'D'}
                        </Avatar>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}