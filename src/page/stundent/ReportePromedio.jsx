import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, Grid, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip, Button,
    Alert, AlertTitle, Avatar, Skeleton, Divider,
    Drawer, List, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import LogoutIcon from '@mui/icons-material/Logout';
import { getStoredUser, logoutUser } from '../../service/authService';
import { getMateriasDeAlumno } from '../../service/materiaService';
import StudentNavbar from '../../components/layout/StudentNavbar';

// 🚀 Librerías para el PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Configuración visual
const fontText = '"Montserrat", sans-serif';
const drawerWidth = 260; // 🚀 Agregamos el ancho de la barra lateral

export default function ReportePromedio() {
    const [user, setUser] = useState(null);
    const [inscripciones, setInscripciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [promedio, setPromedio] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false); // 🚀 Estado para el menú móvil

    useEffect(() => {
        const storedUser = getStoredUser();
        setUser(storedUser);

        if (storedUser?._id) {
            getMateriasDeAlumno(storedUser._id)
                .then(res => {
                    if (res.success) {
                        const data = res.data || [];
                        setInscripciones(data);
                        calcularPromedio(data);
                    }
                })
                .finally(() => setLoading(false));
        }
    }, []);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen); // 🚀 Control de menú móvil

    const calcularPromedio = (data) => {
        const calificadas = data.filter(i => i.calificacion !== null && i.calificacion !== undefined);
        if (calificadas.length === 0) return setPromedio(0);
        const suma = calificadas.reduce((acc, curr) => acc + curr.calificacion, 0);
        setPromedio(suma / calificadas.length);
    };

    const esCandidatoBeca = promedio >= 9.5;

    // ── Función para descargar PDF ──
    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // --- Encabezado ---
        doc.setFontSize(20);
        doc.setTextColor(0, 137, 123); // Color verde
        doc.text('SIGE UTSH - Historial Académico', 14, 22);

        // --- Datos del estudiante ---
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        doc.text(`Alumno: ${user?.nombre || 'N/A'}`, 14, 32);
        doc.text(`Matrícula: ${user?.matricula || 'N/A'}`, 14, 38);
        doc.text(`Carrera: ${user?.carrera || 'N/A'}`, 14, 44);

        // --- Promedio ---
        doc.setFontSize(14);
        doc.text(`Promedio General: ${promedio.toFixed(2)}`, 14, 54);

        if (esCandidatoBeca) {
            doc.setTextColor(212, 175, 55); // Color dorado
            doc.text('¡Candidato a Beca de Excelencia!', 14, 62);
        }

        // --- Preparar datos para la tabla ---
        const tableColumn = ["Materia", "Créditos/Hrs", "Calificación", "Estado"];
        const tableRows = [];

        inscripciones.forEach(row => {
            const m = row.materia;
            if (!m) return;
            const calificacion = row.calificacion ?? 'S/C';
            tableRows.push([
                m.nombre,
                `${m.horasSemanales} hrs`,
                calificacion,
                row.estado
            ]);
        });

        // --- Generar la tabla en el PDF ---
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 70, // Empezamos a dibujar la tabla en la posición Y: 70
            theme: 'grid',
            headStyles: { fillColor: [0, 137, 123] }
        });

        // --- Descargar documento ---
        doc.save(`Historial_Academico_${user?.matricula || 'Alumno'}.pdf`);
    };

    // ── Contenido de la barra lateral (Drawer) ──
    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1e1e2d', color: 'white' }}>
            <Box sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: fontText, letterSpacing: 1, mb: 2 }}>
                    SIGE UTSH
                </Typography>
                <Avatar src={user?.fotoPerfil || undefined} sx={{ width: 80, height: 80, border: '3px solid #00897b', mb: 1, bgcolor: '#00897b' }}>
                    {!user?.fotoPerfil && user?.nombre ? user.nombre.charAt(0).toUpperCase() : ''}
                </Avatar>
                <Typography variant="body2" sx={{ color: '#00897b', fontFamily: fontText, mt: 0.5, fontWeight: 600 }}>
                    {user?.nombre || 'Cargando...'}
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

            {/* 🚀 Navbar conectada con la función handleDrawerToggle */}
            <StudentNavbar handleDrawerToggle={handleDrawerToggle} user={user} drawerWidth={drawerWidth} />

            {/* 🚀 Barra lateral (Drawer) añadida al layout */}
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>{drawerContent}</Drawer>
                <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' } }} open>{drawerContent}</Drawer>
            </Box>

            {/* 🚀 Contenido principal con ancho ajustado y márgenes responsivos */}
            <Box component="main" sx={{ flexGrow: 1, p: 4, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: { xs: 7, sm: 8 } }}>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h5" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>
                        Mi Historial Académico
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<FileDownloadIcon />}
                        onClick={handleDownloadPDF}
                        disabled={loading || inscripciones.length === 0}
                        sx={{ bgcolor: '#1e1e2d', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#2d2d42' } }}
                    >
                        Descargar PDF
                    </Button>
                </Box>

                {/* --- Banner de Beca de Excelencia --- */}
                {esCandidatoBeca && (
                    <Alert
                        icon={<StarIcon fontSize="large" sx={{ color: '#fff' }} />}
                        sx={{
                            mb: 4,
                            bgcolor: '#d4af37', // Color Oro
                            color: '#fff',
                            borderRadius: 3,
                            boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
                            '& .MuiAlert-icon': { alignItems: 'center' }
                        }}
                    >
                        <AlertTitle sx={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: fontText }}>¡FELICIDADES, CANDIDATO A BECA!</AlertTitle>
                        <Typography sx={{ fontFamily: fontText }}>
                            Tu promedio de <strong>{promedio.toFixed(2)}</strong> te califica para la <strong>Beca de Excelencia UTSH</strong>.
                            Mantén tu esfuerzo para conservar este beneficio.
                        </Typography>
                    </Alert>
                )}

                <Grid container spacing={3}>
                    {/* Tarjeta de Promedio General */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ p: 4, borderRadius: 3, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
                            <Typography sx={{ fontFamily: fontText, color: 'text.secondary', fontWeight: 700, letterSpacing: 1 }}>
                                PROMEDIO GENERAL
                            </Typography>
                            <Typography variant="h1" sx={{ fontFamily: fontText, fontWeight: 800, color: esCandidatoBeca ? '#d4af37' : '#00897b', my: 2 }}>
                                {loading ? <Skeleton width={100} sx={{ mx: 'auto' }} /> : promedio.toFixed(2)}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                <SchoolIcon color="action" />
                                <Typography variant="body2" sx={{ fontFamily: fontText, fontWeight: 600, color: 'text.secondary' }}>
                                    {inscripciones.filter(i => i.calificacion !== null).length} Materias calificadas
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>

                    {/* Tabla de Calificaciones Detallada */}
                    <Grid item xs={12} md={8}>
                        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <Table>
                                <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, fontFamily: fontText, color: '#555' }}>Materia</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, fontFamily: fontText, color: '#555' }}>Créditos/Hrs</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, fontFamily: fontText, color: '#555' }}>Calificación</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, fontFamily: fontText, color: '#555' }}>Estatus</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow><TableCell colSpan={4}><Skeleton height={50} /></TableCell></TableRow>
                                    ) : inscripciones.map((row) => (
                                        <TableRow key={row._id} hover>
                                            <TableCell sx={{ fontFamily: fontText, fontWeight: 600, color: '#1e1e2d' }}>
                                                {row.materia?.nombre}
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontFamily: fontText }}>{row.materia?.horasSemanales} hrs</TableCell>
                                            <TableCell align="center">
                                                <Typography sx={{
                                                    fontWeight: 800,
                                                    fontFamily: fontText,
                                                    fontSize: '1.2rem',
                                                    color: row.calificacion >= 7 ? '#2e7d32' : (row.calificacion ? '#c62828' : '#bbb')
                                                }}>
                                                    {row.calificacion ?? 'S/C'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={row.estado}
                                                    size="small"
                                                    sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '0.65rem' }}
                                                    color={row.estado === 'APROBADA' ? 'success' : row.estado === 'REPROBADA' ? 'error' : 'default'}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
