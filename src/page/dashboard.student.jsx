import React, { useState, useEffect } from 'react';
import {
    Box, Drawer, Typography, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, Divider, Grid, Card, CardContent, Skeleton, Avatar
} from '@mui/material';
import StudentNavbar from '../components/layout/StudentNavbar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GradeIcon from '@mui/icons-material/Grade';
import LogoutIcon from '@mui/icons-material/Logout';
import { getStoredUser, logoutUser } from '../service/authService';

const drawerWidth = 260;
const fontText = '"Montserrat", sans-serif';

export default function DashboardEstudiante() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = getStoredUser();
        setUser(storedUser);
    }, []);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const menuItems = [
        { text: 'Inicio', icon: <DashboardIcon />, active: true },
        { text: 'Mis Materias', icon: <MenuBookIcon /> },
        { text: 'Horario', icon: <CalendarMonthIcon /> },
        { text: 'Calificaciones', icon: <GradeIcon /> },
    ];

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1e1e2d', color: 'white' }}>
            <Box sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: fontText, letterSpacing: 1, mb: 2 }}>
                    SIGE UTSH
                </Typography>

                {/* Foto de perfil en el menú lateral */}
                <Avatar
                    src={user?.fotoPerfil || undefined}
                    sx={{ width: 80, height: 80, border: '3px solid #00897b', mb: 1, bgcolor: '#00897b' }}
                >
                    {!user?.fotoPerfil && user?.nombre ? user.nombre.charAt(0).toUpperCase() : ''}
                </Avatar>

                <Typography variant="body2" sx={{ color: '#00897b', fontFamily: fontText, mt: 0.5, fontWeight: 600 }}>
                    {user?.nombre || 'Cargando...'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#aaa', fontFamily: fontText }}>
                    {user?.matricula || ''}
                </Typography>
            </Box>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            <List sx={{ flexGrow: 1, px: 2, mt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton sx={{ borderRadius: 2, bgcolor: item.active ? 'rgba(0, 137, 123, 0.1)' : 'transparent', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
                            <ListItemIcon sx={{ color: item.active ? '#00897b' : '#aaa', minWidth: 40 }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontFamily: fontText, fontWeight: item.active ? 600 : 400, color: item.active ? 'white' : '#ccc' }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ p: 2 }}>
                <ListItemButton onClick={logoutUser} sx={{ borderRadius: 2, bgcolor: 'rgba(211, 47, 47, 0.1)', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.2)' } }}>
                    <ListItemIcon sx={{ color: '#ef5350', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Cerrar Sesión" primaryTypographyProps={{ fontFamily: fontText, color: '#ef5350', fontWeight: 500 }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f9' }}>
            <StudentNavbar handleDrawerToggle={handleDrawerToggle} user={user} drawerWidth={drawerWidth} />
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>{drawerContent}</Drawer>
                <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' } }} open>{drawerContent}</Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: 4, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: { xs: 7, sm: 8 } }}>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Avatar src={user?.fotoPerfil || undefined} sx={{ width: 56, height: 56, bgcolor: '#00897b', display: { xs: 'none', sm: 'flex' } }}>
                        {!user?.fotoPerfil && user?.nombre ? user.nombre.charAt(0).toUpperCase() : ''}
                    </Avatar>
                    <Typography variant="h5" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>
                        Bienvenido(a), {user?.nombre?.split(' ')[0] || '...'}
                    </Typography>
                </Box>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderLeft: '4px solid #00897b' }}>
                            <CardContent>
                                <Typography color="text.secondary" sx={{ fontFamily: fontText, fontSize: 14, mb: 1 }}>Cuatrimestre</Typography>
                                {user ? <Typography variant="h4" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>{user.cuatrimestre}°</Typography> : <Skeleton variant="text" width={60} height={60} />}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderLeft: '4px solid #1976d2' }}>
                            <CardContent>
                                <Typography color="text.secondary" sx={{ fontFamily: fontText, fontSize: 14, mb: 1 }}>Carrera</Typography>
                                {user ? <Typography variant="h6" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>{user.carrera}</Typography> : <Skeleton variant="text" width={120} height={40} />}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderLeft: '4px solid #ed6c02' }}>
                            <CardContent>
                                <Typography color="text.secondary" sx={{ fontFamily: fontText, fontSize: 14, mb: 1 }}>Grupo</Typography>
                                {user ? <Typography variant="h4" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>{user.grupo}</Typography> : <Skeleton variant="text" width={60} height={60} />}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                    <Box sx={{ bgcolor: '#00897b', p: 2.5, color: 'white' }}>
                        <Typography variant="h6" sx={{ fontFamily: fontText, fontWeight: 600, fontSize: '1.1rem' }}>Mi Perfil</Typography>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        {user ? (
                            <Grid container spacing={2}>
                                {[
                                    { label: 'Nombre completo', value: user.nombre },
                                    { label: 'Matrícula', value: user.matricula },
                                    { label: 'Email', value: user.email },
                                    { label: 'Carrera', value: user.carrera },
                                    { label: 'Área', value: user.area || 'No especificada' }, // Se agregó Área
                                    { label: 'Cuatrimestre y Grupo', value: `${user.cuatrimestre}° ${user.grupo}` },
                                ].map((field) => (
                                    <Grid item xs={12} sm={6} key={field.label}>
                                        <Typography variant="caption" sx={{ fontFamily: fontText, color: 'text.secondary', fontWeight: 600, display: 'block' }}>{field.label.toUpperCase()}</Typography>
                                        <Typography sx={{ fontFamily: fontText, fontWeight: 500, color: '#1e1e2d' }}>{field.value}</Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Skeleton variant="rectangular" height={100} />
                        )}
                    </Box>
                </Card>
            </Box>
        </Box>
    );
}