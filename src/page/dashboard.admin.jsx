import React, { useState } from 'react';
import {
    Box, Drawer, Typography, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, Divider, Grid, Card, CardContent, Button, Chip, Avatar
} from '@mui/material';

// Importación del Navbar modular del administrador
import AdminNavbar from '../components/layout/AdminNavbar.jsx';

// Íconos de gestión
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const drawerWidth = 260;
const fontText = '"Montserrat", sans-serif';

export default function DashboardAdmin() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: 'Resumen Global', icon: <DashboardIcon />, active: true },
        { text: 'Control de Usuarios', icon: <PeopleIcon /> },
        { text: 'Programas Educativos', icon: <SchoolIcon /> },
        { text: 'Reportes del Sistema', icon: <AssessmentIcon /> },
        { text: 'Configuración', icon: <SettingsIcon /> },
    ];

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#111827', color: 'white' }}>
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: fontText, letterSpacing: 1 }}>
                    SIGE UTSH
                </Typography>
                <Typography variant="caption" sx={{ color: '#1976d2', fontFamily: fontText, fontWeight: 600 }}>
                    ADMINISTRACIÓN CENTRAL
                </Typography>
            </Box>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            <List sx={{ flexGrow: 1, px: 2, mt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton sx={{
                            borderRadius: 2,
                            bgcolor: item.active ? 'rgba(25, 118, 210, 0.15)' : 'transparent',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                        }}>
                            <ListItemIcon sx={{ color: item.active ? '#42a5f5' : '#aaa', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{ fontFamily: fontText, fontWeight: item.active ? 600 : 400, color: item.active ? 'white' : '#ccc' }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ p: 2 }}>
                <ListItemButton sx={{ borderRadius: 2, bgcolor: 'rgba(211, 47, 47, 0.1)', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.2)' } }}>
                    <ListItemIcon sx={{ color: '#ef5350', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Salir del Sistema" primaryTypographyProps={{ fontFamily: fontText, color: '#ef5350', fontWeight: 500 }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f9' }}>

            <AdminNavbar handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth} />

            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
                >
                    {drawerContent}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', bgcolor: '#111827' } }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: 4, mt: { xs: 7, sm: 8 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h5" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>
                        Panel de Control Maestro
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{ bgcolor: '#1976d2', textTransform: 'none', fontFamily: fontText, borderRadius: 2, px: 3 }}
                    >
                        Nuevo Registro
                    </Button>
                </Box>

                {/* Indicadores Clave (KPIs) */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {[
                        { label: 'Estudiantes', value: '1,248', color: '#00897b' },
                        { label: 'Docentes', value: '86', color: '#1e1e2d' },
                        { label: 'Carreras', value: '12', color: '#ed6c02' },
                        { label: 'Alertas', value: '3', color: '#d32f2f' }
                    ].map((kpi, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{ borderRadius: 3, borderLeft: `5px solid ${kpi.color}`, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                                <CardContent sx={{ py: 2.5 }}>
                                    <Typography variant="caption" sx={{ fontFamily: fontText, color: 'text.secondary', fontWeight: 600 }}>{kpi.label.toUpperCase()}</Typography>
                                    <Typography variant="h4" sx={{ fontFamily: fontText, fontWeight: 700, mt: 0.5 }}>{kpi.value}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Tabla de Registros Recientes */}
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                        <Typography variant="h6" sx={{ fontFamily: fontText, fontWeight: 600, fontSize: '1rem' }}>Log de Actividad Reciente</Typography>
                        <Button size="small" sx={{ fontFamily: fontText, textTransform: 'none' }}>Ver histórico completo</Button>
                    </Box>
                    <List sx={{ p: 0 }}>
                        {[
                            { name: 'Ricardo Ruiz', type: 'Estudiante', info: 'Inscripción TI-51', time: '12:45 PM', color: '#00897b' },
                            { name: 'Dra. Elena Solís', type: 'Docente', info: 'Actualización de Perfil', time: '11:20 AM', color: '#1e1e2d' },
                            { name: 'Admin_Sys', type: 'Sistema', info: 'Backup completado', time: '09:00 AM', color: '#1976d2' }
                        ].map((item, idx) => (
                            <React.Fragment key={idx}>
                                <ListItem sx={{ py: 2, px: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                        <Avatar sx={{ bgcolor: item.color, width: 40, height: 40 }}>{item.name.charAt(0)}</Avatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography sx={{ fontFamily: fontText, fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</Typography>
                                            <Typography sx={{ fontFamily: fontText, color: 'text.secondary', fontSize: '0.8rem' }}>{item.info}</Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Chip label={item.type} size="small" sx={{ fontFamily: fontText, fontWeight: 600, fontSize: '0.7rem', mb: 0.5 }} />
                                            <Typography sx={{ fontFamily: fontText, color: '#999', fontSize: '0.7rem', display: 'block' }}>{item.time}</Typography>
                                        </Box>
                                    </Box>
                                </ListItem>
                                {idx !== 2 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Card>
            </Box>
        </Box>
    );
}