import React, { useState, useEffect } from 'react';
import {
    Box, Drawer, Typography, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, Divider, Grid, Card, CardContent, Button, Skeleton
} from '@mui/material';
import DocentNavbar from '../components/layout/DocentNavbar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import LogoutIcon from '@mui/icons-material/Logout';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { getStoredUser, logoutUser } from '../service/authService';

const drawerWidth = 260;
const fontText = '"Montserrat", sans-serif';

export default function DashboardDocente() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = getStoredUser();
        setUser(storedUser);
    }, []);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const menuItems = [
        { text: 'Inicio', icon: <DashboardIcon />, active: true },
        { text: 'Mis Grupos', icon: <GroupsIcon /> },
        { text: 'Calificaciones', icon: <AssignmentIcon /> },
        { text: 'Asistencias', icon: <FactCheckIcon /> },
    ];

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1e1e2d', color: 'white' }}>
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: fontText, letterSpacing: 1 }}>
                    SIGE UTSH
                </Typography>
                <Typography variant="body2" sx={{ color: '#42a5f5', fontFamily: fontText, mt: 0.5, fontWeight: 600 }}>
                    {user?.nombre || 'Cargando...'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#aaa', fontFamily: fontText }}>
                    {user?.departamento || ''}
                </Typography>
            </Box>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            <List sx={{ flexGrow: 1, px: 2, mt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton sx={{
                            borderRadius: 2,
                            bgcolor: item.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                        }}>
                            <ListItemIcon sx={{ color: item.active ? 'white' : '#aaa', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text}
                                primaryTypographyProps={{ fontFamily: fontText, fontWeight: item.active ? 600 : 400, color: item.active ? 'white' : '#ccc' }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ p: 2 }}>
                <ListItemButton
                    onClick={logoutUser}
                    sx={{ borderRadius: 2, bgcolor: 'rgba(211, 47, 47, 0.1)', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.2)' } }}>
                    <ListItemIcon sx={{ color: '#ef5350', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Cerrar Sesión"
                        primaryTypographyProps={{ fontFamily: fontText, color: '#ef5350', fontWeight: 500 }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f9' }}>
            <DocentNavbar handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth} />
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
                    {drawerContent}
                </Drawer>
                <Drawer variant="permanent"
                    sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' } }}
                    open>
                    {drawerContent}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: 4, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: { xs: 7, sm: 8 } }}>

                {/* Saludo */}
                <Typography variant="h5" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d', mb: 4 }}>
                    Bienvenido, {user?.nombre?.split(' ')[0] || '...'}
                </Typography>

                {/* KPIs con datos del docente */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderLeft: '4px solid #1e1e2d' }}>
                            <CardContent>
                                <Typography color="text.secondary" sx={{ fontFamily: fontText, fontSize: 14, mb: 1 }}>Departamento</Typography>
                                {user ? (
                                    <Typography variant="h6" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>
                                        {user.departamento}
                                    </Typography>
                                ) : <Skeleton variant="text" width={120} height={40} />}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderLeft: '4px solid #1976d2' }}>
                            <CardContent>
                                <Typography color="text.secondary" sx={{ fontFamily: fontText, fontSize: 14, mb: 1 }}>Especialidad</Typography>
                                {user ? (
                                    <Typography variant="h6" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>
                                        {user.especialidad}
                                    </Typography>
                                ) : <Skeleton variant="text" width={120} height={40} />}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderLeft: '4px solid #d32f2f' }}>
                            <CardContent>
                                <Typography color="text.secondary" sx={{ fontFamily: fontText, fontSize: 14, mb: 1 }}>Matrícula Docente</Typography>
                                {user ? (
                                    <Typography variant="h6" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>
                                        {user.matricula}
                                    </Typography>
                                ) : <Skeleton variant="text" width={100} height={40} />}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Perfil del docente */}
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden', mb: 3 }}>
                    <Box sx={{ bgcolor: '#1e1e2d', p: 2.5, color: 'white' }}>
                        <Typography variant="h6" sx={{ fontFamily: fontText, fontWeight: 600, fontSize: '1.1rem' }}>
                            Mi Perfil Docente
                        </Typography>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        {user ? (
                            <Grid container spacing={2}>
                                {[
                                    { label: 'Nombre completo', value: user.nombre },
                                    { label: 'Matrícula', value: user.matricula },
                                    { label: 'Email institucional', value: user.email },
                                    { label: 'Departamento', value: user.departamento },
                                    { label: 'Especialidad', value: user.especialidad },
                                ].map((field) => (
                                    <Grid item xs={12} sm={6} key={field.label}>
                                        <Typography variant="caption" sx={{ fontFamily: fontText, color: 'text.secondary', fontWeight: 600, display: 'block' }}>
                                            {field.label.toUpperCase()}
                                        </Typography>
                                        <Typography sx={{ fontFamily: fontText, fontWeight: 500, color: '#1e1e2d' }}>
                                            {field.value}
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : <Skeleton variant="rectangular" height={100} />}
                    </Box>
                </Card>

                {/* Grupos del día (estáticos por ahora) */}
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                    <Box sx={{ bgcolor: '#1e1e2d', p: 2.5, color: 'white' }}>
                        <Typography variant="h6" sx={{ fontFamily: fontText, fontWeight: 600, fontSize: '1.1rem' }}>
                            Grupos de Hoy
                        </Typography>
                    </Box>
                    <List sx={{ p: 0 }}>
                        {[
                            { materia: 'Desarrollo Web Avanzado', grupo: 'TI-51', hora: '08:00 - 10:00 hrs', aula: 'Laboratorio TI 1' },
                            { materia: 'Base de Datos Relacionales', grupo: 'TI-32', hora: '10:30 - 12:30 hrs', aula: 'Aula 4' },
                        ].map((clase, idx) => (
                            <React.Fragment key={idx}>
                                <ListItem sx={{ py: 2, px: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography sx={{ fontFamily: fontText, fontWeight: 600, color: '#333' }}>
                                            {clase.materia} (Grupo {clase.grupo})
                                        </Typography>
                                        <Typography sx={{ fontFamily: fontText, color: '#666', fontSize: '0.875rem', mt: 0.5 }}>
                                            {clase.hora} | {clase.aula}
                                        </Typography>
                                    </Box>
                                    <Button variant="outlined" startIcon={<PlayArrowIcon />}
                                        sx={{ fontFamily: fontText, textTransform: 'none', color: '#1e1e2d', borderColor: '#1e1e2d', borderRadius: 2 }}>
                                        Pasar Lista
                                    </Button>
                                </ListItem>
                                {idx === 0 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Card>
            </Box>
        </Box>
    );
}