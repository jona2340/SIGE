import React, { useState } from 'react';
import {
    AppBar, Toolbar, IconButton, Typography, Avatar, Box, Badge,
    Menu, MenuItem, ListItemIcon, Divider, Tooltip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import { logoutUser, getStoredUser } from '../../service/authService';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const fontText = '"Montserrat", sans-serif';

// Botón de navegación reutilizable para el Navbar
function NavTab({ label, icon, path, active, onClick }) {
    return (
        <Box onClick={onClick} sx={{
            display: 'flex', alignItems: 'center', gap: 0.8, cursor: 'pointer',
            px: 1.8, py: 0.8, borderRadius: 2,
            bgcolor: active ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
            borderBottom: active ? '2px solid #1976d2' : '2px solid transparent',
            transition: 'all 0.15s ease',
            '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.07)' },
        }}>
            {React.cloneElement(icon, { sx: { fontSize: 18, color: active ? '#1976d2' : '#888' } })}
            <Typography sx={{
                fontFamily: fontText, fontSize: '0.82rem',
                fontWeight: active ? 700 : 500,
                color: active ? '#1976d2' : '#666',
            }}>
                {label}
            </Typography>
        </Box>
    );
}

export default function AdminNavbar({ handleDrawerToggle, drawerWidth = 260 }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const adminUser = getStoredUser();

    const isActive = (path) => location.pathname === path;

    return (
        <AppBar position="fixed" sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            bgcolor: 'white',
            color: '#333',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        }}>
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: { sm: '64px' } }}>

                {/* Izquierda: menú hamburguesa + tabs de navegación */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}
                        sx={{ mr: 1, display: { sm: 'none' }, color: '#1976d2' }}>
                        <MenuIcon />
                    </IconButton>

                    {/* Tabs de navegación — visibles en sm+ */}
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
                        <NavTab
                            label="Dashboard"
                            icon={<DashboardIcon />}
                            active={isActive('/dashboard/admin')}
                            onClick={() => navigate('/dashboard/admin')}
                        />
                        <NavTab
                            label="Gestión de Usuarios"
                            icon={<PeopleAltIcon />}
                            active={isActive('/admin/usuarios')}
                            onClick={() => navigate('/admin/usuarios')}
                        />
                        <NavTab
                            label="Materias"
                            icon={<SchoolIcon />}
                            active={isActive('/admin/materias')}
                            onClick={() => navigate('/admin/materias')}
                        />

                        <NavTab
                            label="Horarios"
                            icon={<AccessTimeIcon />}
                            active={isActive('/admin/horarios')}
                            onClick={() => navigate('/admin/horarios')}
                        />
                    </Box>
                </Box>

                {/* Derecha: notificaciones + perfil */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box onClick={e => setAnchorEl(e.currentTarget)} sx={{
                        display: 'flex', alignItems: 'center', gap: 1.5,
                        cursor: 'pointer', px: 1.5, py: 0.8, borderRadius: 2,
                        '&:hover': { bgcolor: '#f3f4f6' },
                    }}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                            <Typography variant="body2" sx={{ fontFamily: fontText, fontWeight: 600, color: '#333', lineHeight: 1.2, fontSize: '0.82rem' }}>
                                {adminUser?.nombre?.split(' ')[0] || 'Admin'}
                            </Typography>
                            <Typography variant="caption" sx={{ fontFamily: fontText, color: '#1976d2', fontWeight: 600 }}>
                                Super Admin
                            </Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: '#1976d2', width: 36, height: 36 }}>
                            <AdminPanelSettingsIcon fontSize="small" />
                        </Avatar>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}