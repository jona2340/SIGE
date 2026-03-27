import React, { useState } from 'react';
import {
    Box, Drawer, Typography, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, Divider, Grid, Card, CardContent, Button
} from '@mui/material';

// Importamos el Navbar modular del docente
import DocentNavbar from '../components/layout/DocentNavbar';

// Íconos
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import LogoutIcon from '@mui/icons-material/Logout';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const drawerWidth = 260;
const fontText = '"Montserrat", sans-serif';

export default function DashboardDocente() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

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
                <Typography variant="body2" sx={{ color: '#aaa', fontFamily: fontText, mt: 0.5 }}>
                    Panel de Docente
                </Typography>
            </Box>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            <List sx={{ flexGrow: 1, px: 2, mt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton sx={{ borderRadius: 2, bgcolor: item.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
                            <ListItemIcon sx={{ color: item.active ? 'white' : '#aaa', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontFamily: fontText, fontWeight: item.active ? 600 : 400, color: item.active ? 'white' : '#ccc' }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ p: 2 }}>
                <ListItemButton sx={{ borderRadius: 2, bgcolor: 'rgba(211, 47, 47, 0.1)', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.2)' } }}>
                    <ListItemIcon sx={{ color: '#ef5350', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Cerrar Sesión" primaryTypographyProps={{ fontFamily: fontText, color: '#ef5350', fontWeight: 500 }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f9' }}>

            <DocentNavbar handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth} />

            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
                    {drawerContent}
                </Drawer>
                <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' } }} open>
                    {drawerContent}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: 4, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: { xs: 7, sm: 8 } }}>

                {/* Tarjetas de Resumen (Métricas de Profesor) */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderLeft: '4px solid #1e1e2d' }}>
                            <CardContent>
                                <Typography color="text.secondary" sx={{ fontFamily: fontText, fontSize: 14, mb: 1 }}>Grupos Asignados</Typography>
                                <Typography variant="h4" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>4</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderLeft: '4px solid #1976d2' }}>
                            <CardContent>
                                <Typography color="text.secondary" sx={{ fontFamily: fontText, fontSize: 14, mb: 1 }}>Total de Alumnos</Typography>
                                <Typography variant="h4" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>112</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderLeft: '4px solid #d32f2f' }}>
                            <CardContent>
                                <Typography color="text.secondary" sx={{ fontFamily: fontText, fontSize: 14, mb: 1 }}>Evaluaciones Pendientes</Typography>
                                <Typography variant="h4" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>28</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Sección de Acciones Rápidas (Clases de Hoy) */}
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
                                    <Button variant="outlined" startIcon={<PlayArrowIcon />} sx={{ fontFamily: fontText, textTransform: 'none', color: '#1e1e2d', borderColor: '#1e1e2d', borderRadius: 2, '&:hover': { bgcolor: 'rgba(30, 30, 45, 0.05)', borderColor: '#1e1e2d' } }}>
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