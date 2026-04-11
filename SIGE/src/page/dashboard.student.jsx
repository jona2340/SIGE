import React, { useState } from 'react';
import {
    Box, Drawer, Typography, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, Divider, Grid, Card, CardContent
} from '@mui/material';

// Importamos los componentes modulares
import StudentNavbar from '../components/layout/StudentNavbar';

// Íconos para el menú lateral
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GradeIcon from '@mui/icons-material/Grade';
import LogoutIcon from '@mui/icons-material/Logout';

// Configuración constante
const drawerWidth = 260;
const fontText = '"Montserrat", sans-serif';

export default function DashboardEstudiante() {
    // Estado para controlar la apertura del menú lateral en dispositivos móviles
    const [mobileOpen, setMobileOpen] = useState(false);

    // Función para alternar el estado del menú lateral
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Definición de los elementos del menú lateral
    const menuItems = [
        { text: 'Inicio', icon: <DashboardIcon />, active: true },
        { text: 'Mis Materias', icon: <MenuBookIcon /> },
        { text: 'Horario', icon: <CalendarMonthIcon /> },
        { text: 'Calificaciones', icon: <GradeIcon /> },
    ];

    // Contenido del menú lateral (se reutiliza en móvil y escritorio)
    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1e1e2d', color: 'white' }}>
            {/* Logo / Título del Sistema */}
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: fontText, letterSpacing: 1 }}>
                    SIGE UTSH
                </Typography>
                <Typography variant="body2" sx={{ color: '#aaa', fontFamily: fontText, mt: 0.5 }}>
                    Panel de Estudiante
                </Typography>
            </Box>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

            {/* Lista de Navegación principal */}
            <List sx={{ flexGrow: 1, px: 2, mt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton sx={{
                            borderRadius: 2,
                            bgcolor: item.active ? 'rgba(0, 137, 123, 0.1)' : 'transparent',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                        }}>
                            <ListItemIcon sx={{ color: item.active ? '#00897b' : '#aaa', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontFamily: fontText,
                                    fontWeight: item.active ? 600 : 400,
                                    color: item.active ? 'white' : '#ccc'
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {/* Botón de Cerrar Sesión en la parte inferior */}
            <Box sx={{ p: 2 }}>
                <ListItemButton sx={{
                    borderRadius: 2,
                    bgcolor: 'rgba(211, 47, 47, 0.1)',
                    '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.2)' }
                }}>
                    <ListItemIcon sx={{ color: '#ef5350', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Cerrar Sesión" primaryTypographyProps={{ fontFamily: fontText, color: '#ef5350', fontWeight: 500 }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f9' }}>

            {/* Utilización del componente modular StudentNavbar */}
            <StudentNavbar
                handleDrawerToggle={handleDrawerToggle}
                drawerWidth={drawerWidth}
            />

            {/* Contenedor de Navegación (Menú Lateral) */}
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                {/* Drawer temporal para dispositivos móviles */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }} // Mejora el rendimiento al abrirlo
                    sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
                >
                    {drawerContent}
                </Drawer>

                {/* Drawer permanente para pantallas de escritorio */}
                <Drawer
                    variant="permanent"
                    sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' } }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Contenido Principal de la Página */}
            {/* Se añade un margen superior (mt: 8) para que el contenido no quede debajo del Navbar */}
            <Box component="main" sx={{ flexGrow: 1, p: 4, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: { xs: 7, sm: 8 } }}>

                {/* Tarjetas de Resumen (Grilla responsiva) */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderLeft: '4px solid #00897b' }}>
                            <CardContent>
                                <Typography color="text.secondary" sx={{ fontFamily: fontText, fontSize: 14, mb: 1 }}>Cuatrimestre Actual</Typography>
                                <Typography variant="h4" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>5to</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderLeft: '4px solid #1976d2' }}>
                            <CardContent>
                                <Typography color="text.secondary" sx={{ fontFamily: fontText, fontSize: 14, mb: 1 }}>Promedio General</Typography>
                                <Typography variant="h4" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>9.2</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderLeft: '4px solid #ed6c02' }}>
                            <CardContent>
                                <Typography color="text.secondary" sx={{ fontFamily: fontText, fontSize: 14, mb: 1 }}>Materias Inscritas</Typography>
                                <Typography variant="h4" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>7</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Sección de Horario / Clases de hoy (Espacio reservado para datos reales) */}
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                    <Box sx={{ bgcolor: '#00897b', p: 2.5, color: 'white' }}>
                        <Typography variant="h6" sx={{ fontFamily: fontText, fontWeight: 600, fontSize: '1.1rem' }}>
                            Mis clases de hoy
                        </Typography>
                    </Box>
                    <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                        <Typography sx={{ fontFamily: fontText }}>Aquí se integrará la lista de materias y horarios del estudiante.</Typography>
                    </Box>
                </Card>

            </Box>
        </Box>
    );
}