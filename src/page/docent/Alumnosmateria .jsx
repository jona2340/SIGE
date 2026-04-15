import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Drawer, Typography, Divider, Card, Avatar, Chip, Button,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Skeleton, Alert, TextField, InputAdornment, Tooltip, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Snackbar
} from '@mui/material';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import DocentNavbar from '../../components/layout/DocentNavbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClassIcon from '@mui/icons-material/Class';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import GradeIcon from '@mui/icons-material/Grade';
import GroupsIcon from '@mui/icons-material/Groups';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getStoredUser, logoutUser } from '../../service/authService';
import { getAlumnosDeMateria, actualizarCalificacion } from '../../service/materiaService';

const drawerWidth = 260;
const fontText = '"Montserrat", sans-serif';

// Colores por estado de inscripción
const ESTADO_CONFIG = {
    ACTIVA: { label: 'Activa', color: '#1565c0', bg: '#e3f2fd' },
    APROBADA: { label: 'Aprobada', color: '#2e7d32', bg: '#e8f5e9' },
    REPROBADA: { label: 'Reprobada', color: '#c62828', bg: '#ffebee' },
    BAJA: { label: 'Baja', color: '#6d4c41', bg: '#efebe9' },
};

export default function AlumnosMateria() {
    const { materiaId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const user = getStoredUser();

    // La materia puede llegar por state (desde navigate) o se carga por separado
    const [materia, setMateria] = useState(location.state?.materia || null);
    const [inscripciones, setInscripciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);

    // Map de cambios pendientes: { [inscripcionId]: valor_string }
    const [drafts, setDrafts] = useState({});
    // Map de estado guardado por inscripción: 'saving' | 'saved' | 'error'
    const [saveState, setSaveState] = useState({});
    // Snackbar de éxito global
    const [snack, setSnack] = useState({ open: false, msg: '' });

    // ── Carga de alumnos ────────────────────────────────────────────────────────
    useEffect(() => {
        // 🐛 DEBUG 1: Verificamos el ID de la materia que extrae React Router
        console.log("🐛 [Frontend] ID de la materia a buscar (materiaId):", materiaId);

        if (!materiaId) {
            setFetchError('No se detectó el ID de la materia en la URL. Revisa tus rutas.');
            setLoading(false);
            return;
        }

        setLoading(true);
        getAlumnosDeMateria(materiaId)
            .then(res => {
                // 🐛 DEBUG 2: Verificamos qué nos está respondiendo el servidor
                console.log("🐛 [Backend] Respuesta de getAlumnosDeMateria:", res);

                if (res.success) {
                    setInscripciones(res.data || []);
                } else if (Array.isArray(res)) {
                    // 🛠️ FIX: Si el backend devolvió directamente el arreglo en vez de { success, data }
                    console.warn("⚠️ [Aviso] El backend devolvió un arreglo directo. Adaptando los datos...");
                    setInscripciones(res);
                } else {
                    setFetchError(res.message || 'No se pudieron cargar los alumnos.');
                }
            })
            .catch((err) => {
                // 🐛 DEBUG 3: Verificamos si hubo un error HTTP o de Red
                console.error("🐛 [Error Catch] Falló la petición:", err);
                setFetchError('Error de conexión al cargar los alumnos.');
            })
            .finally(() => setLoading(false));
    }, [materiaId]);

    const handleDrawerToggle = () => setMobileOpen(prev => !prev);

    // ── Manejo de calificación ──────────────────────────────────────────────────
    const handleDraftChange = (inscripcionId, value) => {
        // Solo permitir números entre 0 y 10, vacío o punto decimal
        if (value === '' || (/^\d*\.?\d*$/.test(value) && Number(value) <= 10)) {
            setDrafts(prev => ({ ...prev, [inscripcionId]: value }));
            setSaveState(prev => ({ ...prev, [inscripcionId]: undefined }));
        }
    };

    const handleSave = useCallback(async (inscripcionId) => {
        const rawVal = drafts[inscripcionId];
        if (rawVal === '' || rawVal === undefined) return;
        const parsed = parseFloat(rawVal);
        if (isNaN(parsed) || parsed < 0 || parsed > 10) {
            setSaveState(prev => ({ ...prev, [inscripcionId]: 'error' }));
            return;
        }

        setSaveState(prev => ({ ...prev, [inscripcionId]: 'saving' }));
        try {
            const res = await actualizarCalificacion(inscripcionId, parsed);
            if (res.success || res.data) {
                // Actualizar el valor en la lista local para reflejar el cambio
                setInscripciones(prev =>
                    prev.map(i => i._id === inscripcionId ? { ...i, calificacion: parsed } : i)
                );
                setDrafts(prev => { const n = { ...prev }; delete n[inscripcionId]; return n; });
                setSaveState(prev => ({ ...prev, [inscripcionId]: 'saved' }));
                setSnack({ open: true, msg: 'Calificación guardada correctamente.' });
                // Limpiar ícono de guardado tras 2 s
                setTimeout(() => setSaveState(prev => ({ ...prev, [inscripcionId]: undefined })), 2000);
            } else {
                setSaveState(prev => ({ ...prev, [inscripcionId]: 'error' }));
            }
        } catch {
            setSaveState(prev => ({ ...prev, [inscripcionId]: 'error' }));
        }
    }, [drafts]);

    // ── Guardar con Enter ────────────────────────────────────────────────────────
    const handleKeyDown = (e, inscripcionId) => {
        if (e.key === 'Enter') handleSave(inscripcionId);
    };


    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1e1e2d', color: 'white' }}>
            <Box sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: fontText, letterSpacing: 1, mb: 2 }}>SIGE UTSH</Typography>
                <Avatar src={user?.fotoPerfil || undefined} sx={{ width: 80, height: 80, border: '3px solid #7986cb', mb: 1, bgcolor: '#7986cb' }}>
                    {!user?.fotoPerfil && user?.nombre ? user.nombre.charAt(0).toUpperCase() : ''}
                </Avatar>
                <Typography variant="body2" sx={{ color: '#7986cb', fontFamily: fontText, mt: 0.5, fontWeight: 600 }}>{user?.nombre || 'Cargando...'}</Typography>
                <Typography variant="caption" sx={{ color: '#aaa', fontFamily: fontText }}>{user?.especialidad || 'Docente'}</Typography>
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

    // ── Render ──────────────────────────────────────────────────────────────────
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f9' }}>
            <DocentNavbar handleDrawerToggle={handleDrawerToggle} user={user} drawerWidth={drawerWidth} />

            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>{drawerContent}</Drawer>
                <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' } }} open>{drawerContent}</Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: { xs: 7, sm: 8 } }}>

                {/* ── Encabezado con botón de regreso ── */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Tooltip title="Regresar a Mis Clases">
                        <IconButton onClick={() => navigate('/docente/clases')} sx={{ bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', '&:hover': { bgcolor: '#f0f0f0' } }}>
                            <ArrowBackIcon sx={{ color: '#1e1e2d' }} />
                        </IconButton>
                    </Tooltip>
                    <Box>
                        <Typography variant="h5" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d', lineHeight: 1.2 }}>
                            {materia?.nombre || 'Alumnos de la Materia'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: fontText, color: 'text.secondary' }}>
                            {materia?.codigo || ''}{materia?.carrera ? ` · ${materia.carrera}` : ''}
                        </Typography>
                    </Box>
                </Box>

                {/* ── Info de la materia ── */}
                {materia && (
                    <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', p: 2, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
                        <Chip icon={<GradeIcon sx={{ fontSize: '0.9rem !important' }} />} label={materia.nombre} sx={{ fontFamily: fontText, fontWeight: 700, bgcolor: '#1e1e2d', color: 'white', borderRadius: 2 }} />
                        <Chip icon={<GroupsIcon sx={{ fontSize: '0.9rem !important' }} />} label={`${materia.cuatrimestre}° Cuatrimestre`} size="small" sx={{ fontFamily: fontText, fontWeight: 600, bgcolor: '#e3f2fd', color: '#1565c0', borderRadius: 1.5 }} />
                        <Chip icon={<AccessTimeIcon sx={{ fontSize: '0.9rem !important' }} />} label={`${materia.horasSemanales} hrs/semana`} size="small" sx={{ fontFamily: fontText, fontWeight: 600, bgcolor: '#f3e5f5', color: '#6a1b9a', borderRadius: 1.5 }} />
                        {!loading && (
                            <Chip label={`${inscripciones.length} alumno${inscripciones.length !== 1 ? 's' : ''}`} size="small" sx={{ fontFamily: fontText, fontWeight: 600, bgcolor: '#e8f5e9', color: '#2e7d32', borderRadius: 1.5 }} />
                        )}
                    </Card>
                )}

                {fetchError && <Alert severity="error" sx={{ mb: 3, fontFamily: fontText, borderRadius: 2 }}>{fetchError}</Alert>}

                {/* ── Tabla de alumnos ── */}
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                    <Box sx={{ p: 2.5, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontFamily: fontText, fontWeight: 600, fontSize: '1rem', color: '#1e1e2d' }}>
                            Lista de Alumnos
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: fontText, color: 'text.secondary', fontSize: '0.8rem' }}>
                            Escribe la calificación y presiona <strong>Enter</strong> o el ícono 💾 para guardar
                        </Typography>
                    </Box>

                    {loading ? (
                        <Box sx={{ p: 3 }}>
                            {[1, 2, 3, 4].map(i => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Skeleton variant="circular" width={40} height={40} />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Skeleton variant="text" width="40%" />
                                        <Skeleton variant="text" width="25%" />
                                    </Box>
                                    <Skeleton variant="rectangular" width={90} height={36} sx={{ borderRadius: 2 }} />
                                </Box>
                            ))}
                        </Box>
                    ) : inscripciones.length === 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, color: 'text.secondary' }}>
                            <PersonOffIcon sx={{ fontSize: 56, mb: 1.5, opacity: 0.25 }} />
                            <Typography sx={{ fontFamily: fontText, fontSize: '0.95rem' }}>
                                No hay alumnos inscritos en esta materia.
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0}>
                            <Table sx={{ minWidth: 500 }}>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                                        {['#', 'Alumno', 'Matrícula', 'Estado', 'Calificación Actual', 'Asignar / Editar'].map(h => (
                                            <TableCell key={h} sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', py: 1.5 }}>
                                                {h}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {inscripciones.map((insc, idx) => {
                                        const alumno = insc.alumno || {};
                                        const estadoCfg = ESTADO_CONFIG[insc.estado] || ESTADO_CONFIG.ACTIVA;
                                        const isDraft = drafts[insc._id] !== undefined;
                                        const status = saveState[insc._id];
                                        const calActual = insc.calificacion ?? '—';

                                        return (
                                            <TableRow
                                                key={insc._id}
                                                sx={{
                                                    '&:hover': { bgcolor: '#f7f9ff' },
                                                    '& td': { borderBottom: '1px solid #f0f0f0', py: 1.5 },
                                                }}
                                            >
                                                {/* # */}
                                                <TableCell sx={{ fontFamily: fontText, color: '#aaa', fontSize: '0.8rem', width: 40 }}>
                                                    {idx + 1}
                                                </TableCell>

                                                {/* Alumno */}
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Avatar
                                                            src={alumno.fotoPerfil || undefined}
                                                            sx={{ width: 36, height: 36, bgcolor: '#1e1e2d', fontSize: '0.85rem' }}
                                                        >
                                                            {!alumno.fotoPerfil && alumno.nombre ? alumno.nombre.charAt(0).toUpperCase() : '?'}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography sx={{ fontFamily: fontText, fontWeight: 600, fontSize: '0.85rem', color: '#1e1e2d' }}>
                                                                {alumno.nombre || 'Sin nombre'}
                                                            </Typography>
                                                            <Typography sx={{ fontFamily: fontText, fontSize: '0.72rem', color: 'text.secondary' }}>
                                                                {alumno.email || ''}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>

                                                {/* Matrícula */}
                                                <TableCell sx={{ fontFamily: fontText, fontSize: '0.82rem', fontWeight: 500, color: '#444' }}>
                                                    {alumno.matricula || '—'}
                                                </TableCell>

                                                {/* Estado */}
                                                <TableCell>
                                                    <Chip
                                                        label={estadoCfg.label}
                                                        size="small"
                                                        sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '0.7rem', bgcolor: estadoCfg.bg, color: estadoCfg.color, border: `1px solid ${estadoCfg.color}30` }}
                                                    />
                                                </TableCell>

                                                {/* Calificación actual */}
                                                <TableCell>
                                                    <Typography sx={{
                                                        fontFamily: fontText,
                                                        fontWeight: 700,
                                                        fontSize: '1rem',
                                                        color: typeof calActual === 'number'
                                                            ? calActual >= 7 ? '#2e7d32' : '#c62828'
                                                            : '#bbb',
                                                    }}>
                                                        {calActual}
                                                    </Typography>
                                                </TableCell>

                                                {/* Input de calificación + guardar */}
                                                <TableCell sx={{ width: 160 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <TextField
                                                            size="small"
                                                            placeholder="0 – 10"
                                                            value={drafts[insc._id] ?? ''}
                                                            onChange={e => handleDraftChange(insc._id, e.target.value)}
                                                            onKeyDown={e => handleKeyDown(e, insc._id)}
                                                            disabled={insc.estado === 'BAJA'}
                                                            error={status === 'error'}
                                                            sx={{
                                                                width: 90,
                                                                '& .MuiOutlinedInput-root': {
                                                                    borderRadius: 2,
                                                                    fontFamily: fontText,
                                                                    fontSize: '0.85rem',
                                                                    bgcolor: isDraft ? '#fff8e1' : '#f7f7f7',
                                                                    '& fieldset': { borderColor: isDraft ? '#ffa726' : 'transparent' },
                                                                    '&:hover fieldset': { borderColor: isDraft ? '#ffa726' : '#ddd' },
                                                                    '&.Mui-focused fieldset': { borderColor: '#1e1e2d' },
                                                                },
                                                            }}
                                                        />
                                                        <Tooltip title={
                                                            insc.estado === 'BAJA' ? 'Alumno dado de baja' :
                                                                status === 'saving' ? 'Guardando...' :
                                                                    status === 'saved' ? '¡Guardado!' :
                                                                        status === 'error' ? 'Error al guardar' :
                                                                            'Guardar calificación'
                                                        }>
                                                            <span>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleSave(insc._id)}
                                                                    disabled={!isDraft || status === 'saving' || insc.estado === 'BAJA'}
                                                                    sx={{
                                                                        color: status === 'saved' ? '#2e7d32' :
                                                                            status === 'error' ? '#c62828' :
                                                                                isDraft ? '#1e1e2d' : '#bbb',
                                                                        bgcolor: status === 'saved' ? '#e8f5e9' : 'transparent',
                                                                        '&:hover': { bgcolor: '#f0f0f0' },
                                                                        transition: 'all 0.2s',
                                                                    }}
                                                                >
                                                                    {status === 'saved'
                                                                        ? <CheckCircleIcon fontSize="small" />
                                                                        : <SaveIcon fontSize="small" />}
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                    </Box>
                                                    {status === 'error' && (
                                                        <Typography sx={{ fontFamily: fontText, fontSize: '0.68rem', color: '#c62828', mt: 0.5 }}>
                                                            Valor inválido (0–10)
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Card>
            </Box>

            {/* ── Snackbar de confirmación ── */}
            <Snackbar
                open={snack.open}
                autoHideDuration={2500}
                onClose={() => setSnack(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled" sx={{ fontFamily: fontText, borderRadius: 2 }}>
                    {snack.msg}
                </Alert>
            </Snackbar>
        </Box>
    );
}