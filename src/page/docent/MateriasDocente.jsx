import React, { useState, useEffect } from 'react';
import {
    Box, Drawer, Typography, Divider, Grid, Card, Skeleton, Avatar,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText, Chip, Button
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DocentNavbar from '../../components/layout/DocentNavbar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ClassIcon from '@mui/icons-material/Class';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleIcon from '@mui/icons-material/People';
import { getStoredUser, logoutUser } from '../../service/authService';
import { getMaterias } from '../../service/materiaService';

const drawerWidth = 260;
const fontText = '"Montserrat", sans-serif';

export default function MateriasDocente() {
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
            getMaterias({ docente: storedUser._id })
                .then(res => { if (res.success) setMaterias(res.data || []); })
                .catch(err => console.error('Error al cargar materias del docente', err))
                .finally(() => setLoadingMaterias(false));
        }
    }, []);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);


    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1e1e2d', color: 'white' }}>
            <Box sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: fontText, letterSpacing: 1, mb: 2 }}>SIGE UTSH</Typography>
                <Avatar src={user?.fotoPerfil || undefined} sx={{ width: 80, height: 80, border: '3px solid #7986cb', mb: 1, bgcolor: '#7986cb' }}>
                    {!user?.fotoPerfil && user?.nombre ? user.nombre.charAt(0).toUpperCase() : ''}
                </Avatar>
                <Typography variant="body2" sx={{ color: '#7986cb', fontFamily: fontText, mt: 0.5, fontWeight: 600 }}>{user?.nombre || 'Cargando...'}</Typography>
                <Typography variant="caption" sx={{ color: '#aaa', fontFamily: fontText }}>{user?.departamento || 'Docente'}</Typography>
            </Box>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            <List sx={{ flexGrow: 1, px: 2, mt: 2 }}>
            </List>
            <Box sx={{ p: 2 }}>
                <ListItemButton onClick={logoutUser} sx={{ borderRadius: 2, bgcolor: 'rgba(211,47,47,0.1)', '&:hover': { bgcolor: 'rgba(211,47,47,0.2)' } }}>
                    <ListItemIcon sx={{ color: '#ef5350', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Cerrar Sesión" primaryTypographyProps={{ fontFamily: fontText, color: '#ef5350', fontWeight: 500 }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f9' }}>
            <DocentNavbar handleDrawerToggle={handleDrawerToggle} user={user} drawerWidth={drawerWidth} />

            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>{drawerContent}</Drawer>
                <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' } }} open>{drawerContent}</Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: 4, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: { xs: 7, sm: 8 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <ClassIcon sx={{ fontSize: 32, color: '#1e1e2d' }} />
                    <Typography variant="h5" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>
                        Mis Clases Asignadas
                    </Typography>
                </Box>

                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', p: 3 }}>
                    <Typography variant="h6" sx={{ fontFamily: fontText, fontWeight: 600, mb: 3, color: '#1e1e2d' }}>
                        Materias que impartes este cuatrimestre
                    </Typography>

                    {loadingMaterias ? (
                        <Grid container spacing={2}>
                            {[1, 2, 3].map(i => (
                                <Grid item xs={12} sm={6} md={4} key={i}>
                                    <Skeleton variant="rectangular" height={170} sx={{ borderRadius: 3 }} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : materias.length === 0 ? (
                        <Box sx={{ textAlign: 'center', p: 4 }}>
                            <ClassIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                            <Typography sx={{ fontFamily: fontText, color: 'text.secondary' }}>
                                No tienes materias asignadas actualmente. Contacta a administración.
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {materias.map((m) => (
                                <Grid item xs={12} sm={6} md={4} key={m._id}>
                                    <Card sx={{
                                        borderRadius: 3,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                        borderTop: '4px solid #1e1e2d',
                                        height: '100%',
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}>
                                        <Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                                                <Box>
                                                    <Typography sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '1.05rem', color: '#1e1e2d', mb: 0.2 }}>
                                                        {m.nombre}
                                                    </Typography>
                                                    <Typography sx={{ fontFamily: fontText, fontSize: '0.8rem', color: '#777', mb: 1, fontWeight: 600 }}>
                                                        {m.codigo}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', mb: 2 }}>
                                                <Chip
                                                    icon={<GroupsIcon sx={{ fontSize: '0.9rem !important' }} />}
                                                    label={`${m.cuatrimestre}° Cuatri`}
                                                    size="small"
                                                    sx={{ fontFamily: fontText, fontWeight: 600, bgcolor: '#e3f2fd', color: '#1565c0', borderRadius: 1.5 }}
                                                />
                                                <Chip
                                                    icon={<AccessTimeIcon sx={{ fontSize: '0.9rem !important' }} />}
                                                    label={`${m.horasSemanales} hrs`}
                                                    size="small"
                                                    sx={{ fontFamily: fontText, fontWeight: 600, bgcolor: '#f3e5f5', color: '#6a1b9a', borderRadius: 1.5 }}
                                                />
                                            </Box>

                                            <Divider sx={{ my: 1.5 }} />

                                            <Typography sx={{ fontFamily: fontText, fontSize: '0.75rem', fontWeight: 600, color: '#555' }}>CARRERA</Typography>
                                            <Typography sx={{ fontFamily: fontText, fontSize: '0.85rem', color: '#1e1e2d', fontWeight: 500, mb: 2 }}>
                                                {m.carrera}
                                            </Typography>
                                        </Box>

                                        {/* ── Botón Ver Alumnos ── */}
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            startIcon={<PeopleIcon />}
                                            onClick={() => navigate(`/docente/materia/${m._id}/alumnos`, { state: { materia: m } })}
                                            sx={{
                                                fontFamily: fontText,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                bgcolor: '#1e1e2d',
                                                borderRadius: 2,
                                                '&:hover': { bgcolor: '#2d2d42' },
                                            }}
                                        >
                                            Ver Alumnos
                                        </Button>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Card>
            </Box>
        </Box>
    );
}