import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Drawer, Divider, Typography, Card, Chip, Avatar, IconButton, Tooltip,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert,
    Grid, FormControl, InputLabel, Select, MenuItem, TextField,
    List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction,
    Tab, Tabs, Skeleton, ListItemButton,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AdminNavbar from '../../components/layout/AdminNavbar.jsx';
import { logoutUser, getStoredUser } from '../../service/authService';
import { getAllUsers } from '../../service/adminService';
import {
    getMaterias, getDocentes, createMateria, deleteMateria,
    inscribirGrupo, eliminarInscripcion, getMateriasDeAlumno,
} from '../../service/materiaService';

const drawerWidth = 260;
const fontText = '"Montserrat", sans-serif';

// ── Catálogos reales de la UTSH ──────────────────────────────────────────────
const CARRERAS_UTSH = [
    'Tecnologías de la Información',
    'Mecatrónica',
    'Desarrollo de Negocios',
    'Contaduría',
    'Enfermería',
    'Terapia Física',
    'Diseño Textil',
    'Recursos Naturales',
    'Mantenimiento Industrial',
];

const AREAS_UTSH = [
    'DIRECCIÓN DE CIENCIAS ECONÓMICO ADMINISTRATIVAS',
    'DIRECCIÓN DE CIENCIAS NATURALES E INGENIERÍA',
    'DIRECCIÓN DE TECNOLOGÍAS DE LA INFORMACIÓN',
    'DIRECCIÓN DE CIENCIAS EXACTAS',
    'DIRECCIÓN DE CIENCIAS DE LA SALUD',
];

const DEPARTAMENTOS = [
    'Ciencias Exactas y Básicas',
    'Económico-Administrativa',
    'Tecnologías de la Información',
    'Mecánica y Manufactura',
    'Ciencias de la Salud',
    'Diseño y Arte',
    'Desarrollo de Negocios',
    'Mecatrónica',
    'Idiomas',
];

const GRUPOS = ['A', 'B', 'C', 'D'];
const CUATRIMESTRES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const emptyMateria = {
    nombre: '', codigo: '', carrera: '', cuatrimestre: '',
    docente: '', horasSemanales: 4,
};

const emptyGrupo = {
    materiaId: '', carrera: '', cuatrimestre: '', grupo: '',
};

// ─── Componente principal ────────────────────────────────────────────────────
export default function GestionMaterias() {
    const adminUser = getStoredUser();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [tab, setTab] = useState(0);

    // ── Datos ──
    const [materias, setMaterias] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [loading, setLoading] = useState(true);

    // ── Filtros panel materias ──
    const [filtCarrera, setFiltCarrera] = useState('');
    const [filtCuatri, setFiltCuatri] = useState('');
    const [filtDocente, setFiltDocente] = useState('');

    // ── Modal nueva materia ──
    const [openMateria, setOpenMateria] = useState(false);
    const [formMateria, setFormMateria] = useState(emptyMateria);
    const [errMateria, setErrMateria] = useState('');
    const [okMateria, setOkMateria] = useState('');
    const [savingM, setSavingM] = useState(false);

    // ── Modal inscribir grupo ──
    const [openGrupo, setOpenGrupo] = useState(false);
    const [formGrupo, setFormGrupo] = useState(emptyGrupo);
    const [errGrupo, setErrGrupo] = useState('');
    const [okGrupo, setOkGrupo] = useState('');
    const [savingG, setSavingG] = useState(false);
    const [resultGrupo, setResultGrupo] = useState(null); // { insertados, duplicados, total }

    // ── Panel consulta por grupo ──
    const [consultaCarrera, setConsultaCarrera] = useState('');
    const [consultaCuatri, setConsultaCuatri] = useState('');
    const [consultaGrupo, setConsultaGrupo] = useState('');
    const [alumnosGrupo, setAlumnosGrupo] = useState([]);
    const [loadingConsulta, setLoadingConsulta] = useState(false);
    const [alumnoExpandido, setAlumnoExpandido] = useState(null);
    const [inscripcionesAlumno, setInscripcionesAlumno] = useState({});

    useEffect(() => {
        Promise.all([
            getMaterias().then(d => setMaterias(d.data || [])),
            getDocentes().then(d => setDocentes(d.data || [])),
        ]).finally(() => setLoading(false));
    }, []);

    // ── Buscar alumnos por grupo/carrera/cuatrimestre ──
    const handleBuscarGrupo = async () => {
        if (!consultaCarrera || !consultaCuatri) return;
        setLoadingConsulta(true);
        setAlumnoExpandido(null);
        try {
            const data = await getAllUsers();
            const todos = data.data || [];
            const filtrados = todos.filter(u => {
                const okRol = u.rol === 'STUDENT';
                const okCarr = u.carrera === consultaCarrera;
                const okCuatri = String(u.cuatrimestre) === String(consultaCuatri);
                const okGrupo = !consultaGrupo || u.grupo === consultaGrupo;
                return okRol && okCarr && okCuatri && okGrupo;
            });
            setAlumnosGrupo(filtrados);
        } finally {
            setLoadingConsulta(false);
        }
    };

    // ── Cargar materias de un alumno al expandir ──
    const handleExpandirAlumno = async (alumnoId) => {
        if (alumnoExpandido === alumnoId) { setAlumnoExpandido(null); return; }
        setAlumnoExpandido(alumnoId);
        if (!inscripcionesAlumno[alumnoId]) {
            const data = await getMateriasDeAlumno(alumnoId);
            setInscripcionesAlumno(prev => ({ ...prev, [alumnoId]: data.data || [] }));
        }
    };

    // ── Eliminar inscripción desde panel consulta ──
    const handleQuitarMateria = async (inscId, alumnoId) => {
        if (!window.confirm('¿Dar de baja esta materia?')) return;
        const res = await eliminarInscripcion(inscId);
        if (res.success) {
            setInscripcionesAlumno(prev => ({
                ...prev,
                [alumnoId]: prev[alumnoId].filter(i => i._id !== inscId),
            }));
        }
    };

    // ── Materias filtradas ──
    const materiasFiltradas = useMemo(() => materias.filter(m => {
        const okC = !filtCarrera || m.carrera === filtCarrera;
        const okQ = !filtCuatri || String(m.cuatrimestre) === filtCuatri;
        const okD = !filtDocente || m.docente?._id === filtDocente;
        return okC && okQ && okD;
    }), [materias, filtCarrera, filtCuatri, filtDocente]);

    // ── Crear materia ──
    const handleCrearMateria = async () => {
        setSavingM(true); setErrMateria(''); setOkMateria('');
        const res = await createMateria({
            ...formMateria,
            cuatrimestre: Number(formMateria.cuatrimestre),
            horasSemanales: Number(formMateria.horasSemanales),
        });
        if (res.success) {
            setOkMateria('✅ Materia creada correctamente.');
            setMaterias(prev => [...prev, res.data]);
            setTimeout(() => { setOpenMateria(false); setFormMateria(emptyMateria); setOkMateria(''); }, 1200);
        } else { setErrMateria(res.message); }
        setSavingM(false);
    };

    // ── Eliminar materia ──
    const handleDeleteMateria = async (id, nombre) => {
        if (!window.confirm(`¿Eliminar la materia "${nombre}"?`)) return;
        const res = await deleteMateria(id);
        if (res.success) setMaterias(prev => prev.filter(m => m._id !== id));
        else alert(res.message);
    };

    // ── Inscribir grupo completo ──
    const handleInscribirGrupo = async () => {
        if (!formGrupo.materiaId || !formGrupo.carrera || !formGrupo.cuatrimestre) {
            setErrGrupo('Materia, carrera y cuatrimestre son requeridos.');
            return;
        }
        setSavingG(true); setErrGrupo(''); setOkGrupo(''); setResultGrupo(null);
        const res = await inscribirGrupo({
            materiaId: formGrupo.materiaId,
            carrera: formGrupo.carrera,
            cuatrimestre: Number(formGrupo.cuatrimestre),
            grupo: formGrupo.grupo || undefined, // si está vacío no se envía
        });
        if (res.success) {
            setOkGrupo(res.message);
            setResultGrupo(res.data);
        } else { setErrGrupo(res.message); }
        setSavingG(false);
    };

    // ── Materias filtradas para el selector del modal de inscripción ──
    const materiasFiltroGrupo = materias.filter(m =>
        (!formGrupo.carrera || m.carrera === formGrupo.carrera) &&
        (!formGrupo.cuatrimestre || String(m.cuatrimestre) === String(formGrupo.cuatrimestre))
    );

    // ── Drawer ──────────────────────────────────────────────────────────────
    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#111827', color: 'white' }}>
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: fontText, letterSpacing: 1 }}>
                    SIGE UTSH
                </Typography>
                <Typography variant="caption" sx={{ color: '#42a5f5', fontFamily: fontText, fontWeight: 600 }}>
                    {adminUser?.nombre || 'ADMINISTRACIÓN CENTRAL'}
                </Typography>
            </Box>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ p: 2 }}>
                <ListItemButton onClick={logoutUser}
                    sx={{ borderRadius: 2, bgcolor: 'rgba(211,47,47,0.1)', '&:hover': { bgcolor: 'rgba(211,47,47,0.2)' } }}>
                    <ListItemIcon sx={{ color: '#ef5350', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Salir del Sistema"
                        primaryTypographyProps={{ fontFamily: fontText, color: '#ef5350', fontWeight: 500 }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f9' }}>
            <AdminNavbar handleDrawerToggle={() => setMobileOpen(!mobileOpen)} drawerWidth={drawerWidth} />

            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}>
                    {drawerContent}
                </Drawer>
                <Drawer variant="permanent"
                    sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, borderRight: 'none', bgcolor: '#111827' } }}
                    open>
                    {drawerContent}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, mt: { xs: 7, sm: 8 }, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>

                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>
                            Gestión de Materias
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: fontText, color: 'text.secondary', mt: 0.5 }}>
                            {loading ? 'Cargando...' : `${materias.length} materias · ${docentes.length} docentes`}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        {tab === 0 && (
                            <Button variant="contained" startIcon={<AddCircleOutlineIcon />}
                                onClick={() => { setFormMateria(emptyMateria); setErrMateria(''); setOkMateria(''); setOpenMateria(true); }}
                                sx={{ fontFamily: fontText, textTransform: 'none', bgcolor: '#1976d2', borderRadius: 2 }}>
                                Nueva Materia
                            </Button>
                        )}
                        {tab === 1 && (
                            <Button variant="contained" startIcon={<GroupsIcon />}
                                onClick={() => { setFormGrupo(emptyGrupo); setErrGrupo(''); setOkGrupo(''); setResultGrupo(null); setOpenGrupo(true); }}
                                sx={{ fontFamily: fontText, textTransform: 'none', bgcolor: '#00897b', borderRadius: 2 }}>
                                Inscribir a Grupo / Carrera
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Tabs */}
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: '1px solid #e0e0e0' }}>
                    <Tab label="Catálogo de Materias" icon={<MenuBookIcon />} iconPosition="start"
                        sx={{ fontFamily: fontText, textTransform: 'none', fontWeight: 600 }} />
                    <Tab label="Inscripciones por Grupo" icon={<GroupsIcon />} iconPosition="start"
                        sx={{ fontFamily: fontText, textTransform: 'none', fontWeight: 600 }} />
                </Tabs>

                {/* ══════════════════════════════════════
                    TAB 0 — CATÁLOGO DE MATERIAS
                ══════════════════════════════════════ */}
                {tab === 0 && (
                    <>
                        {/* Filtros */}
                        <Card sx={{ borderRadius: 3, p: 2.5, mb: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel shrink sx={{ fontFamily: fontText, bgcolor: 'white', px: 0.5 }}>Carrera</InputLabel>
                                        <Select value={filtCarrera} onChange={e => setFiltCarrera(e.target.value)} label="Carrera"
                                            notched displayEmpty
                                            sx={{ fontFamily: fontText, borderRadius: 2 }}>
                                            <MenuItem value="" sx={{ fontFamily: fontText, color: '#aaa' }}>Todas las carreras</MenuItem>
                                            {CARRERAS_UTSH.map(c => <MenuItem key={c} value={c} sx={{ fontFamily: fontText }}>{c}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sm={2}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel shrink sx={{ fontFamily: fontText, bgcolor: 'white', px: 0.5 }}>Cuatrimestre</InputLabel>
                                        <Select value={filtCuatri} onChange={e => setFiltCuatri(e.target.value)} label="Cuatrimestre"
                                            notched displayEmpty
                                            sx={{ fontFamily: fontText, borderRadius: 2 }}>
                                            <MenuItem value="" sx={{ fontFamily: fontText, color: '#aaa' }}>Todos</MenuItem>
                                            {CUATRIMESTRES.map(n => <MenuItem key={n} value={String(n)} sx={{ fontFamily: fontText }}>{n}°</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel shrink sx={{ fontFamily: fontText, bgcolor: 'white', px: 0.5 }}>Docente</InputLabel>
                                        <Select value={filtDocente} onChange={e => setFiltDocente(e.target.value)} label="Docente"
                                            notched displayEmpty
                                            sx={{ fontFamily: fontText, borderRadius: 2 }}>
                                            <MenuItem value="" sx={{ fontFamily: fontText, color: '#aaa' }}>Todos los docentes</MenuItem>
                                            {docentes.map(d => <MenuItem key={d._id} value={d._id} sx={{ fontFamily: fontText }}>{d.nombre}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Button fullWidth size="small"
                                        onClick={() => { setFiltCarrera(''); setFiltCuatri(''); setFiltDocente(''); }}
                                        sx={{ fontFamily: fontText, textTransform: 'none', color: '#d32f2f' }}>
                                        Limpiar filtros
                                    </Button>
                                </Grid>
                            </Grid>
                        </Card>

                        {/* Tarjetas de materias */}
                        {loading ? (
                            [1, 2, 3].map(i => <Skeleton key={i} variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 3 }} />)
                        ) : materiasFiltradas.length === 0 ? (
                            <Card sx={{ borderRadius: 3, p: 6, textAlign: 'center' }}>
                                <SchoolIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                                <Typography sx={{ fontFamily: fontText, color: 'text.secondary' }}>
                                    No hay materias. Usa "Nueva Materia" para agregar.
                                </Typography>
                            </Card>
                        ) : (
                            <Grid container spacing={2}>
                                {materiasFiltradas.map(m => (
                                    <Grid item xs={12} sm={6} md={4} key={m._id}>
                                        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderLeft: '4px solid #1976d2', p: 2.5, height: '100%' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '0.95rem', color: '#1e1e2d', mb: 0.3 }}>
                                                        {m.nombre}
                                                    </Typography>
                                                    <Typography sx={{ fontFamily: fontText, fontSize: '0.72rem', color: '#999', mb: 1.2, fontWeight: 600, letterSpacing: 0.5 }}>
                                                        {m.codigo}
                                                    </Typography>
                                                </Box>
                                                <Tooltip title="Eliminar materia">
                                                    <IconButton size="small" onClick={() => handleDeleteMateria(m._id, m.nombre)}
                                                        sx={{ color: '#ef5350', ml: 1 }}>
                                                        <DeleteOutlineIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>

                                            <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', mb: 1.5 }}>
                                                <Chip label={m.carrera} size="small"
                                                    sx={{ fontFamily: fontText, fontSize: '0.65rem', bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 600 }} />
                                                <Chip label={`${m.cuatrimestre}° cuatri`} size="small"
                                                    sx={{ fontFamily: fontText, fontSize: '0.65rem', bgcolor: '#e0f2f1', color: '#00695c', fontWeight: 600 }} />
                                                <Chip label={`${m.horasSemanales}h/sem`} size="small"
                                                    sx={{ fontFamily: fontText, fontSize: '0.65rem', bgcolor: '#f3e5f5', color: '#6a1b9a', fontWeight: 600 }} />
                                            </Box>

                                            <Divider sx={{ mb: 1.2 }} />

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar sx={{ width: 26, height: 26, bgcolor: '#1976d2', fontSize: '0.72rem' }}>
                                                    {m.docente?.nombre?.charAt(0) || '?'}
                                                </Avatar>
                                                <Box>
                                                    <Typography sx={{ fontFamily: fontText, fontSize: '0.78rem', fontWeight: 600, color: '#333' }}>
                                                        {m.docente?.nombre || 'Sin docente asignado'}
                                                    </Typography>
                                                    <Typography sx={{ fontFamily: fontText, fontSize: '0.68rem', color: '#888' }}>
                                                        {m.docente?.especialidad || ''}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </>
                )}

                {/* ══════════════════════════════════════
                    TAB 1 — INSCRIPCIONES POR GRUPO
                ══════════════════════════════════════ */}
                {tab === 1 && (
                    <Grid container spacing={3}>
                        {/* Panel izquierdo: filtros de búsqueda */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', p: 2.5 }}>
                                <Typography sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '0.9rem', color: '#1e1e2d', mb: 2 }}>
                                    Consultar Grupo
                                </Typography>

                                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                    <InputLabel shrink sx={{ fontFamily: fontText, bgcolor: 'white', px: 0.5 }}>Carrera</InputLabel>
                                    <Select value={consultaCarrera} onChange={e => { setConsultaCarrera(e.target.value); setAlumnosGrupo([]); }}
                                        label="Carrera" notched displayEmpty sx={{ fontFamily: fontText, borderRadius: 2 }}>
                                        <MenuItem value="" sx={{ fontFamily: fontText, color: '#aaa' }}>Selecciona carrera</MenuItem>
                                        {CARRERAS_UTSH.map(c => <MenuItem key={c} value={c} sx={{ fontFamily: fontText }}>{c}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                    <InputLabel shrink sx={{ fontFamily: fontText, bgcolor: 'white', px: 0.5 }}>Cuatrimestre</InputLabel>
                                    <Select value={consultaCuatri} onChange={e => { setConsultaCuatri(e.target.value); setAlumnosGrupo([]); }}
                                        label="Cuatrimestre" notched displayEmpty sx={{ fontFamily: fontText, borderRadius: 2 }}>
                                        <MenuItem value="" sx={{ fontFamily: fontText, color: '#aaa' }}>Selecciona cuatrimestre</MenuItem>
                                        {CUATRIMESTRES.map(n => <MenuItem key={n} value={String(n)} sx={{ fontFamily: fontText }}>{n}°</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
                                    <InputLabel shrink sx={{ fontFamily: fontText, bgcolor: 'white', px: 0.5 }}>Grupo (opcional)</InputLabel>
                                    <Select value={consultaGrupo} onChange={e => { setConsultaGrupo(e.target.value); setAlumnosGrupo([]); }}
                                        label="Grupo (opcional)" notched displayEmpty sx={{ fontFamily: fontText, borderRadius: 2 }}>
                                        <MenuItem value="" sx={{ fontFamily: fontText, color: '#aaa' }}>Todos los grupos</MenuItem>
                                        {GRUPOS.map(g => <MenuItem key={g} value={g} sx={{ fontFamily: fontText }}>Grupo {g}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <Button fullWidth variant="contained" onClick={handleBuscarGrupo}
                                    disabled={!consultaCarrera || !consultaCuatri || loadingConsulta}
                                    sx={{ fontFamily: fontText, textTransform: 'none', fontWeight: 700, borderRadius: 2, bgcolor: '#1976d2' }}>
                                    {loadingConsulta ? 'Buscando...' : 'Buscar alumnos'}
                                </Button>

                                {/* Resumen */}
                                {alumnosGrupo.length > 0 && (
                                    <Box sx={{ mt: 2.5, bgcolor: '#e3f2fd', borderRadius: 2, p: 2 }}>
                                        <Typography sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '0.85rem', color: '#1565c0' }}>
                                            {alumnosGrupo.length} alumno(s) encontrado(s)
                                        </Typography>
                                        <Typography sx={{ fontFamily: fontText, fontSize: '0.75rem', color: '#555', mt: 0.5 }}>
                                            {consultaCarrera} · {consultaCuatri}°{consultaGrupo ? ` · Grupo ${consultaGrupo}` : ' · Todos los grupos'}
                                        </Typography>
                                    </Box>
                                )}
                            </Card>
                        </Grid>

                        {/* Panel derecho: lista de alumnos del grupo */}
                        <Grid item xs={12} md={8}>
                            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                                <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                                    <Typography sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '0.9rem', color: '#1e1e2d' }}>
                                        Alumnos del grupo
                                        {alumnosGrupo.length > 0 && (
                                            <Chip label={alumnosGrupo.length} size="small"
                                                sx={{ ml: 1, fontFamily: fontText, fontWeight: 700, bgcolor: '#1976d2', color: 'white', fontSize: '0.7rem' }} />
                                        )}
                                    </Typography>
                                    {alumnosGrupo.length > 0 && (
                                        <Button variant="contained" size="small" startIcon={<AddCircleOutlineIcon />}
                                            onClick={() => {
                                                setFormGrupo({
                                                    ...emptyGrupo,
                                                    carrera: consultaCarrera,
                                                    cuatrimestre: consultaCuatri,
                                                    grupo: consultaGrupo,
                                                });
                                                setErrGrupo(''); setOkGrupo(''); setResultGrupo(null);
                                                setOpenGrupo(true);
                                            }}
                                            sx={{ fontFamily: fontText, textTransform: 'none', bgcolor: '#00897b', borderRadius: 2 }}>
                                            Inscribir materia al grupo
                                        </Button>
                                    )}
                                </Box>

                                {alumnosGrupo.length === 0 ? (
                                    <Box sx={{ p: 6, textAlign: 'center' }}>
                                        <GroupsIcon sx={{ fontSize: 52, color: '#ccc', mb: 1 }} />
                                        <Typography sx={{ fontFamily: fontText, color: 'text.secondary' }}>
                                            Selecciona carrera y cuatrimestre para ver los alumnos
                                        </Typography>
                                    </Box>
                                ) : (
                                    <List sx={{ p: 0 }}>
                                        {alumnosGrupo.map((alumno, idx) => (
                                            <React.Fragment key={alumno._id}>
                                                {/* Fila del alumno */}
                                                <ListItem
                                                    onClick={() => handleExpandirAlumno(alumno._id)}
                                                    sx={{ py: 1.8, px: 3, cursor: 'pointer', '&:hover': { bgcolor: '#f5f9ff' }, transition: 'background 0.15s' }}>
                                                    <ListItemIcon sx={{ minWidth: 44 }}>
                                                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#1976d2', fontSize: '0.82rem' }}>
                                                            {alumno.nombre.charAt(0)}
                                                        </Avatar>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Typography sx={{ fontFamily: fontText, fontWeight: 600, fontSize: '0.88rem' }}>
                                                                {alumno.nombre}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <Typography sx={{ fontFamily: fontText, fontSize: '0.75rem', color: '#888' }}>
                                                                {alumno.matricula} · Grupo {alumno.grupo}
                                                            </Typography>
                                                        }
                                                    />
                                                    <Chip
                                                        label={alumnoExpandido === alumno._id ? 'Ocultar materias' : 'Ver materias'}
                                                        size="small"
                                                        sx={{
                                                            fontFamily: fontText, fontSize: '0.7rem', cursor: 'pointer',
                                                            bgcolor: alumnoExpandido === alumno._id ? '#e3f2fd' : '#f5f5f5',
                                                            color: alumnoExpandido === alumno._id ? '#1565c0' : '#666'
                                                        }}
                                                    />
                                                </ListItem>

                                                {/* Materias del alumno expandido */}
                                                {alumnoExpandido === alumno._id && (
                                                    <Box sx={{ bgcolor: '#f8faff', borderLeft: '3px solid #1976d2', mx: 3, mb: 1, borderRadius: '0 8px 8px 0', p: 1.5 }}>
                                                        {!inscripcionesAlumno[alumno._id] ? (
                                                            <Skeleton variant="text" width="60%" />
                                                        ) : inscripcionesAlumno[alumno._id].length === 0 ? (
                                                            <Typography sx={{ fontFamily: fontText, fontSize: '0.78rem', color: '#aaa', textAlign: 'center', py: 1 }}>
                                                                Sin materias inscritas
                                                            </Typography>
                                                        ) : (
                                                            inscripcionesAlumno[alumno._id].map(insc => (
                                                                <Box key={insc._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.6 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <CheckCircleIcon sx={{ fontSize: 14, color: '#00897b' }} />
                                                                        <Typography sx={{ fontFamily: fontText, fontSize: '0.78rem', fontWeight: 600, color: '#333' }}>
                                                                            {insc.materia?.nombre || '—'}
                                                                        </Typography>
                                                                        <Typography sx={{ fontFamily: fontText, fontSize: '0.7rem', color: '#999' }}>
                                                                            · {insc.materia?.docente?.nombre || ''}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Tooltip title="Dar de baja">
                                                                        <IconButton size="small"
                                                                            onClick={e => { e.stopPropagation(); handleQuitarMateria(insc._id, alumno._id); }}
                                                                            sx={{ color: '#ef5350', p: 0.5 }}>
                                                                            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Box>
                                                            ))
                                                        )}
                                                    </Box>
                                                )}

                                                {idx < alumnosGrupo.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                )}
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </Box>

            {/* ── Modal: Nueva Materia ── */}
            <Dialog open={openMateria} onClose={() => !savingM && setOpenMateria(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}>
                <Box sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)', px: 4, py: 3, color: 'white' }}>
                    <Typography sx={{ fontFamily: fontText, fontWeight: 300, opacity: 0.85 }}>Agregar al catálogo</Typography>
                    <Typography sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '1.4rem' }}>Nueva Materia</Typography>
                </Box>
                <DialogContent sx={{ px: 4, py: 3, bgcolor: '#fafafa' }}>
                    <Grid container spacing={2.5}>

                        {/* Nombre — fila completa */}
                        <Grid item xs={12}>
                            <TextField fullWidth size="small" label="Nombre de la materia" name="nombre"
                                value={formMateria.nombre}
                                onChange={e => setFormMateria({ ...formMateria, nombre: e.target.value })}
                                InputLabelProps={{ style: { fontFamily: fontText } }}
                                InputProps={{ style: { fontFamily: fontText } }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                        </Grid>

                        {/* Código + Horas */}
                        <Grid item xs={7}>
                            <TextField fullWidth size="small" label="Código (ej. TI-WEB-01)" name="codigo"
                                value={formMateria.codigo}
                                onChange={e => setFormMateria({ ...formMateria, codigo: e.target.value })}
                                InputLabelProps={{ style: { fontFamily: fontText } }}
                                InputProps={{ style: { fontFamily: fontText } }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField fullWidth size="small" label="Horas semanales" name="horasSemanales"
                                type="number" value={formMateria.horasSemanales}
                                onChange={e => setFormMateria({ ...formMateria, horasSemanales: e.target.value })}
                                InputLabelProps={{ style: { fontFamily: fontText } }}
                                InputProps={{ style: { fontFamily: fontText }, inputProps: { min: 1, max: 20 } }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                        </Grid>

                        {/* Carrera — fila completa */}
                        <Grid item xs={12}>
                            <FormControl fullWidth size="small">
                                <InputLabel shrink sx={{ fontFamily: fontText, bgcolor: '#fafafa', px: 0.5 }}>Carrera</InputLabel>
                                <Select name="carrera" value={formMateria.carrera} label="Carrera"
                                    notched displayEmpty
                                    onChange={e => setFormMateria({ ...formMateria, carrera: e.target.value })}
                                    sx={{ fontFamily: fontText, borderRadius: 2, bgcolor: 'white' }}>
                                    <MenuItem value="" sx={{ fontFamily: fontText, color: '#aaa' }}>Selecciona una carrera</MenuItem>
                                    {CARRERAS_UTSH.map(c => <MenuItem key={c} value={c} sx={{ fontFamily: fontText }}>{c}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Cuatrimestre + Docente */}
                        <Grid item xs={12} sm={5}>
                            <FormControl fullWidth size="small">
                                <InputLabel shrink sx={{ fontFamily: fontText, bgcolor: '#fafafa', px: 0.5 }}>Cuatrimestre</InputLabel>
                                <Select name="cuatrimestre" value={formMateria.cuatrimestre} label="Cuatrimestre"
                                    notched displayEmpty
                                    onChange={e => setFormMateria({ ...formMateria, cuatrimestre: e.target.value })}
                                    sx={{ fontFamily: fontText, borderRadius: 2, bgcolor: 'white' }}>
                                    <MenuItem value="" sx={{ fontFamily: fontText, color: '#aaa' }}>Selecciona</MenuItem>
                                    {CUATRIMESTRES.map(n => <MenuItem key={n} value={n} sx={{ fontFamily: fontText }}>{n}° Cuatrimestre</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={7}>
                            <FormControl fullWidth size="small">
                                <InputLabel shrink sx={{ fontFamily: fontText, bgcolor: '#fafafa', px: 0.5 }}>Docente</InputLabel>
                                <Select name="docente" value={formMateria.docente} label="Docente"
                                    notched displayEmpty
                                    onChange={e => setFormMateria({ ...formMateria, docente: e.target.value })}
                                    sx={{ fontFamily: fontText, borderRadius: 2, bgcolor: 'white' }}>
                                    <MenuItem value="" sx={{ fontFamily: fontText, color: '#aaa' }}>Selecciona un docente</MenuItem>
                                    {docentes.length === 0 && (
                                        <MenuItem disabled sx={{ fontFamily: fontText }}>No hay docentes registrados</MenuItem>
                                    )}
                                    {docentes.map(d => (
                                        <MenuItem key={d._id} value={d._id}>
                                            <Box>
                                                <Typography sx={{ fontFamily: fontText, fontSize: '0.85rem', fontWeight: 600 }}>{d.nombre}</Typography>
                                                <Typography sx={{ fontFamily: fontText, fontSize: '0.72rem', color: '#888' }}>
                                                    {d.departamento} · {d.especialidad}
                                                </Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {errMateria && <Grid item xs={12}><Alert severity="error" sx={{ fontFamily: fontText, borderRadius: 2 }}>{errMateria}</Alert></Grid>}
                        {okMateria && <Grid item xs={12}><Alert severity="success" sx={{ fontFamily: fontText, borderRadius: 2 }}>{okMateria}</Alert></Grid>}
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 4, pb: 3, pt: 2, bgcolor: '#fafafa', gap: 1 }}>
                    <Button onClick={() => setOpenMateria(false)} disabled={savingM}
                        sx={{ fontFamily: fontText, textTransform: 'none', color: '#888', borderRadius: 2, border: '1px solid #e0e0e0', px: 3 }}>
                        Cancelar
                    </Button>
                    <Button onClick={handleCrearMateria} variant="contained" disabled={savingM} fullWidth
                        sx={{
                            fontFamily: fontText, textTransform: 'none', fontWeight: 700, borderRadius: 2, py: 1.2,
                            background: 'linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)',
                            '&:disabled': { background: '#e0e0e0' }
                        }}>
                        {savingM ? 'Creando...' : 'Crear Materia'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Modal: Inscribir grupo/carrera completo ── */}
            <Dialog open={openGrupo} onClose={() => !savingG && setOpenGrupo(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}>
                <Box sx={{ background: 'linear-gradient(135deg, #00897b 0%, #1976d2 100%)', px: 4, py: 3, color: 'white' }}>
                    <Typography sx={{ fontFamily: fontText, fontWeight: 300, opacity: 0.85 }}>Inscripción masiva</Typography>
                    <Typography sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '1.4rem' }}>Inscribir Grupo a Materia</Typography>
                    <Typography sx={{ fontFamily: fontText, fontSize: '0.82rem', opacity: 0.85, mt: 0.5 }}>
                        Se inscribirán todos los alumnos que coincidan con los criterios
                    </Typography>
                </Box>

                <DialogContent sx={{ px: 4, py: 3, bgcolor: '#fafafa' }}>
                    <Grid container spacing={2.5}>

                        {/* Carrera */}
                        <Grid item xs={12}>
                            <FormControl fullWidth size="small">
                                <InputLabel shrink sx={{ fontFamily: fontText, bgcolor: '#fafafa', px: 0.5 }}>Carrera</InputLabel>
                                <Select value={formGrupo.carrera} label="Carrera"
                                    notched displayEmpty
                                    onChange={e => setFormGrupo({ ...formGrupo, carrera: e.target.value, materiaId: '' })}
                                    sx={{ fontFamily: fontText, borderRadius: 2, bgcolor: 'white' }}>
                                    <MenuItem value="" sx={{ fontFamily: fontText, color: '#aaa' }}>Selecciona una carrera</MenuItem>
                                    {CARRERAS_UTSH.map(c => <MenuItem key={c} value={c} sx={{ fontFamily: fontText }}>{c}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Cuatrimestre */}
                        <Grid item xs={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel shrink sx={{ fontFamily: fontText, bgcolor: '#fafafa', px: 0.5 }}>Cuatrimestre</InputLabel>
                                <Select value={formGrupo.cuatrimestre} label="Cuatrimestre"
                                    notched displayEmpty
                                    onChange={e => setFormGrupo({ ...formGrupo, cuatrimestre: e.target.value, materiaId: '' })}
                                    sx={{ fontFamily: fontText, borderRadius: 2, bgcolor: 'white' }}>
                                    <MenuItem value="" sx={{ fontFamily: fontText, color: '#aaa' }}>Selecciona</MenuItem>
                                    {CUATRIMESTRES.map(n => <MenuItem key={n} value={String(n)} sx={{ fontFamily: fontText }}>{n}°</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Grupo — opcional */}
                        <Grid item xs={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel shrink sx={{ fontFamily: fontText, bgcolor: '#fafafa', px: 0.5 }}>Grupo (opcional)</InputLabel>
                                <Select value={formGrupo.grupo} label="Grupo (opcional)"
                                    notched displayEmpty
                                    onChange={e => setFormGrupo({ ...formGrupo, grupo: e.target.value })}
                                    sx={{ fontFamily: fontText, borderRadius: 2, bgcolor: 'white' }}>
                                    <MenuItem value="" sx={{ fontFamily: fontText, color: '#aaa' }}>Todos los grupos</MenuItem>
                                    {GRUPOS.map(g => <MenuItem key={g} value={g} sx={{ fontFamily: fontText }}>Grupo {g}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Materia — filtrada por carrera+cuatrimestre */}
                        <Grid item xs={12}>
                            <FormControl fullWidth size="small">
                                <InputLabel shrink sx={{ fontFamily: fontText, bgcolor: '#fafafa', px: 0.5 }}>Materia a inscribir</InputLabel>
                                <Select value={formGrupo.materiaId} label="Materia a inscribir"
                                    notched displayEmpty
                                    onChange={e => setFormGrupo({ ...formGrupo, materiaId: e.target.value })}
                                    sx={{ fontFamily: fontText, borderRadius: 2, bgcolor: 'white' }}>
                                    <MenuItem value="" sx={{ fontFamily: fontText, color: '#aaa' }}>Selecciona una materia</MenuItem>
                                    {materiasFiltroGrupo.length === 0 ? (
                                        <MenuItem disabled sx={{ fontFamily: fontText }}>
                                            No hay materias para esta carrera y cuatrimestre
                                        </MenuItem>
                                    ) : (
                                        materiasFiltroGrupo.map(m => (
                                            <MenuItem key={m._id} value={m._id}>
                                                <Box>
                                                    <Typography sx={{ fontFamily: fontText, fontSize: '0.85rem', fontWeight: 600 }}>{m.nombre}</Typography>
                                                    <Typography sx={{ fontFamily: fontText, fontSize: '0.72rem', color: '#888' }}>
                                                        {m.codigo} · {m.docente?.nombre || 'Sin docente'}
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Resultado de la inscripción */}
                        {resultGrupo && (
                            <Grid item xs={12}>
                                <Box sx={{ bgcolor: '#e8f5e9', borderRadius: 2, p: 2, border: '1px solid #a5d6a7' }}>
                                    <Typography sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '0.9rem', color: '#2e7d32', mb: 1 }}>
                                        ✅ Inscripción completada
                                    </Typography>
                                    <Grid container spacing={1}>
                                        {[
                                            { label: 'Inscritos nuevos', value: resultGrupo.insertados, color: '#2e7d32' },
                                            { label: 'Ya inscritos', value: resultGrupo.duplicados, color: '#f57c00' },
                                            { label: 'Total alumnos', value: resultGrupo.total, color: '#1565c0' },
                                        ].map(stat => (
                                            <Grid item xs={4} key={stat.label}>
                                                <Box sx={{ textAlign: 'center', bgcolor: 'white', borderRadius: 1.5, py: 1 }}>
                                                    <Typography sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '1.4rem', color: stat.color }}>
                                                        {stat.value}
                                                    </Typography>
                                                    <Typography sx={{ fontFamily: fontText, fontSize: '0.68rem', color: '#888' }}>
                                                        {stat.label}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </Grid>
                        )}

                        {errGrupo && <Grid item xs={12}><Alert severity="error" sx={{ fontFamily: fontText, borderRadius: 2 }}>{errGrupo}</Alert></Grid>}
                        {okGrupo && !resultGrupo && <Grid item xs={12}><Alert severity="success" sx={{ fontFamily: fontText, borderRadius: 2 }}>{okGrupo}</Alert></Grid>}
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ px: 4, pb: 3, pt: 1, bgcolor: '#fafafa', gap: 1 }}>
                    <Button onClick={() => setOpenGrupo(false)} disabled={savingG}
                        sx={{ fontFamily: fontText, textTransform: 'none', color: '#888', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                        {resultGrupo ? 'Cerrar' : 'Cancelar'}
                    </Button>
                    {!resultGrupo && (
                        <Button onClick={handleInscribirGrupo} variant="contained" disabled={savingG} fullWidth
                            sx={{
                                fontFamily: fontText, textTransform: 'none', fontWeight: 700, borderRadius: 2, py: 1.2,
                                background: 'linear-gradient(135deg, #00897b 0%, #1976d2 100%)',
                                '&:disabled': { background: '#e0e0e0' }
                            }}>
                            {savingG ? 'Inscribiendo...' : 'Confirmar Inscripción Masiva'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}