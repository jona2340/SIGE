import React, { useState, useEffect } from 'react';
import {
    Box, Drawer, Typography, Divider, Grid, Card, Skeleton, Avatar,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText, Chip
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import StudentNavbar from '../../components/layout/StudentNavbar'; // Ajusta la ruta si es necesario
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GradeIcon from '@mui/icons-material/Grade';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getStoredUser, logoutUser } from '../../service/authService';
import { getMateriasDeAlumno } from '../../service/materiaService';

const drawerWidth = 260;
const fontText = '"Montserrat", sans-serif';

// 🚀 Agregamos la configuración de colores para el estado de la materia
const ESTADO_CONFIG = {
    ACTIVA: { label: 'En Curso', color: '#1565c0', bg: '#e3f2fd' },
    APROBADA: { label: 'Aprobada', color: '#2e7d32', bg: '#e8f5e9' },
    REPROBADA: { label: 'Reprobada', color: '#c62828', bg: '#ffebee' },
    BAJA: { label: 'Baja', color: '#6d4c41', bg: '#efebe9' },
};

export default function MisMaterias() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [materias, setMaterias] = useState([]);
    const [loadingMaterias, setLoadingMaterias] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedUser = getStoredUser();
        setUser(storedUser);

        if (storedUser?._id) {
            getMateriasDeAlumno(storedUser._id)
                .then(res => {
                    if (res.success) setMaterias(res.data || []);
                })
                .catch(err => console.error("Error al cargar materias", err))
                .finally(() => setLoadingMaterias(false));
        }
    }, []);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1e1e2d', color: 'white' }}>
            <Box sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: fontText, letterSpacing: 1, mb: 2 }}>
                    SIGE UTSH
                </Typography>
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
            <List sx={{ flexGrow: 1, px: 2, mt: 2 }}></List>
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
                    <MenuBookIcon sx={{ fontSize: 32, color: '#00897b' }} />
                    <Typography variant="h5" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>
                        Mis Materias
                    </Typography>
                </Box>

                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', p: 3 }}>
                    <Typography variant="h6" sx={{ fontFamily: fontText, fontWeight: 600, mb: 3, color: '#1e1e2d' }}>
                        Materias Inscritas
                    </Typography>

                    {loadingMaterias ? (
                        <Grid container spacing={2}>
                            {[1, 2, 3].map(i => (
                                <Grid item xs={12} sm={6} md={4} key={i}>
                                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : materias.length === 0 ? (
                        <Box sx={{ textAlign: 'center', p: 4 }}>
                            <SchoolIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                            <Typography sx={{ fontFamily: fontText, color: 'text.secondary' }}>
                                Aún no estás inscrito en ninguna materia este cuatrimestre.
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {materias.map((inscripcion) => {
                                const m = inscripcion.materia;
                                if (!m) return null;

                                // 🚀 Lógica para calificación y estado
                                const calActual = inscripcion.calificacion ?? '—';
                                const estadoCfg = ESTADO_CONFIG[inscripcion.estado] || ESTADO_CONFIG.ACTIVA;

                                // Determinar color del texto de la calificación
                                const gradeColor = typeof calActual === 'number'
                                    ? calActual >= 7 ? '#2e7d32' : '#c62828'
                                    : '#bbb';

                                return (
                                    <Grid item xs={12} sm={6} md={4} key={inscripcion._id}>
                                        <Card sx={{
                                            borderRadius: 3,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                            borderTop: '4px solid #00897b',
                                            height: '100%',
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                                                    <Box>
                                                        <Typography sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '1.05rem', color: '#1e1e2d', mb: 0.2 }}>
                                                            {m.nombre}
                                                        </Typography>
                                                        <Typography sx={{ fontFamily: fontText, fontSize: '0.8rem', color: '#777', mb: 2, fontWeight: 600 }}>
                                                            {m.codigo}
                                                        </Typography>
                                                    </Box>
                                                    {m.horasSemanales && (
                                                        <Chip
                                                            icon={<AccessTimeIcon sx={{ fontSize: '0.9rem !important', color: '#00897b !important' }} />}
                                                            label={`${m.horasSemanales} hrs`}
                                                            size="small"
                                                            sx={{ fontFamily: fontText, fontWeight: 700, bgcolor: '#e0f2f1', color: '#00897b', borderRadius: 1.5 }}
                                                        />
                                                    )}
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                    <Avatar sx={{ width: 28, height: 28, bgcolor: '#e0f2f1', color: '#00897b', fontSize: '0.8rem' }}>
                                                        {m.docente?.nombre?.charAt(0) || '?'}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography sx={{ fontFamily: fontText, fontSize: '0.8rem', fontWeight: 600, color: '#333' }}>
                                                            {m.docente?.nombre || 'Sin docente asignado'}
                                                        </Typography>
                                                        <Typography sx={{ fontFamily: fontText, fontSize: '0.7rem', color: '#888' }}>
                                                            Docente titular
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>

                                            {/* 🚀 Nueva sección inferior: Estado y Calificación */}
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                bgcolor: '#f8f9fa',
                                                p: 1.5,
                                                borderRadius: 2,
                                                mt: 'auto' // Empuja esto hacia el fondo de la tarjeta
                                            }}>
                                                <Box>
                                                    <Typography sx={{ fontFamily: fontText, fontSize: '0.7rem', fontWeight: 700, color: '#888', mb: 0.5, letterSpacing: 0.5 }}>
                                                        ESTADO
                                                    </Typography>
                                                    <Chip
                                                        label={estadoCfg.label}
                                                        size="small"
                                                        sx={{
                                                            fontFamily: fontText,
                                                            fontWeight: 700,
                                                            fontSize: '0.7rem',
                                                            bgcolor: estadoCfg.bg,
                                                            color: estadoCfg.color,
                                                            border: `1px solid ${estadoCfg.color}30`,
                                                            height: 22
                                                        }}
                                                    />
                                                </Box>
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography sx={{ fontFamily: fontText, fontSize: '0.7rem', fontWeight: 700, color: '#888', mb: 0.5, letterSpacing: 0.5 }}>
                                                        CALIFICACIÓN
                                                    </Typography>
                                                    <Typography sx={{
                                                        fontFamily: fontText,
                                                        fontWeight: 800,
                                                        fontSize: '1.4rem',
                                                        lineHeight: 1,
                                                        color: gradeColor
                                                    }}>
                                                        {calActual}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </Card>
            </Box>
        </Box>
    );
}