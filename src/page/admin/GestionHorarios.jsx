import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Drawer, Divider, Typography, Card, Chip, Avatar, IconButton, Tooltip,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert,
    Grid, FormControl, InputLabel, Select, MenuItem, TextField,
    ListItemButton, ListItemIcon, ListItemText, Skeleton,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveIcon from '@mui/icons-material/Save';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AdminNavbar from '../../components/layout/AdminNavbar.jsx';
import { logoutUser, getStoredUser } from '../../service/authService';
import { getMateriasInscritas, getHorario, upsertHorario, deleteHorario } from '../../service/horarioService';

const drawerWidth = 260;
const fontText = '"Montserrat", sans-serif';

// ── Catálogos ────────────────────────────────────────────────────────────────
const CARRERAS = [
    'Tecnologías de la Información', 'Mecatrónica', 'Desarrollo de Negocios',
    'Contaduría', 'Enfermería', 'Terapia Física',
    'Diseño Textil', 'Recursos Naturales', 'Mantenimiento Industrial',
];
const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const GRUPOS = ['A', 'B', 'C', 'D'];
const CUATRIS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Rangos de hora según cuatrimestre
const RANGO_MATUTINO = { min: '08:00', max: '15:00' }; // cuatris 1-5
const RANGO_VESPERTINO = { min: '15:00', max: '21:00' }; // cuatris 6-10

const COLORES_MATERIAS = [
    '#1976d2', '#00897b', '#7b1fa2', '#e65100',
    '#c62828', '#2e7d32', '#4527a0', '#00838f',
    '#558b2f', '#6d4c41',
];

// Convierte "08:30" → minutos desde medianoche
const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
// Convierte minutos → "08:30"
const toTime = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

// Genera slots de 30 min dentro de un rango
function generarSlots(min, max) {
    const slots = [];
    for (let t = toMin(min); t <= toMin(max); t += 30) slots.push(toTime(t));
    return slots;
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function GestionHorarios() {
    const adminUser = getStoredUser();
    const [mobileOpen, setMobileOpen] = useState(false);

    // ── Selector de grupo ──
    const [selCarrera, setSelCarrera] = useState('');
    const [selCuatri, setSelCuatri] = useState('');
    const [selGrupo, setSelGrupo] = useState('');
    const [buscando, setBuscando] = useState(false);

    // ── Datos cargados ──
    const [materias, setMaterias] = useState([]); // materias inscritas del grupo
    const [bloques, setBloques] = useState([]); // bloques del horario actual
    const [horarioId, setHorarioId] = useState(null);
    const [cargado, setCargado] = useState(false);

    // ── Modal agregar bloque ──
    const [openBloque, setOpenBloque] = useState(false);
    const [formBloque, setFormBloque] = useState({ materiaId: '', dia: '', horaInicio: '', horaFin: '', aula: '' });
    const [errBloque, setErrBloque] = useState('');

    // ── Guardar horario ──
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState({ type: '', text: '' });

    // ── Confirmar eliminar horario ──
    const [openDelete, setOpenDelete] = useState(false);

    // Rango de horas según cuatrimestre
    const rango = useMemo(() => Number(selCuatri) <= 5 ? RANGO_MATUTINO : RANGO_VESPERTINO, [selCuatri]);
    const slots = useMemo(() => generarSlots(rango.min, rango.max), [rango]);

    // Mapa materiaId → color
    const colorMap = useMemo(() => {
        const map = {};
        materias.forEach((m, i) => { map[String(m._id)] = COLORES_MATERIAS[i % COLORES_MATERIAS.length]; });
        return map;
    }, [materias]);

    // ── Buscar grupo ────────────────────────────────────────────────────────
    const handleBuscar = async () => {
        if (!selCarrera || !selCuatri || !selGrupo) return;
        setBuscando(true); setCargado(false); setBloques([]); setMaterias([]);
        setSaveMsg({ type: '', text: '' });
        try {
            const [mRes, hRes] = await Promise.all([
                getMateriasInscritas(selCarrera, selCuatri, selGrupo),
                getHorario(selCarrera, selCuatri, selGrupo),
            ]);
            setMaterias(mRes.data || []);
            if (hRes.data) {
                setHorarioId(hRes.data._id);
                // Normalizar bloques para el estado local
                setBloques((hRes.data.bloques || []).map(b => ({
                    _id: b._id,
                    materiaId: String(b.materia?._id || b.materia),
                    materiaNombre: b.materia?.nombre || '',
                    docenteNombre: b.materia?.docente?.nombre || '',
                    dia: b.dia,
                    horaInicio: b.horaInicio,
                    horaFin: b.horaFin,
                    aula: b.aula || '',
                })));
            } else {
                setHorarioId(null);
                setBloques([]);
            }
        } finally {
            setBuscando(false);
            setCargado(true);
        }
    };

    // ── Agregar bloque al estado local ──────────────────────────────────────
    const handleAgregarBloque = () => {
        const { materiaId, dia, horaInicio, horaFin, aula } = formBloque;
        if (!materiaId || !dia || !horaInicio || !horaFin) {
            setErrBloque('Completa todos los campos requeridos.');
            return;
        }
        if (toMin(horaFin) <= toMin(horaInicio)) {
            setErrBloque('La hora de fin debe ser mayor a la de inicio.');
            return;
        }
        // Detectar solapamiento en el mismo día
        const conflicto = bloques.find(b =>
            b.dia === dia &&
            toMin(b.horaInicio) < toMin(horaFin) &&
            toMin(horaInicio) < toMin(b.horaFin)
        );
        if (conflicto) {
            setErrBloque(`Conflicto con "${conflicto.materiaNombre}" (${conflicto.horaInicio}–${conflicto.horaFin}).`);
            return;
        }
        const materia = materias.find(m => String(m._id) === materiaId);
        setBloques(prev => [...prev, {
            materiaId,
            materiaNombre: materia?.nombre || '',
            docenteNombre: materia?.docente?.nombre || '',
            dia, horaInicio, horaFin, aula,
        }]);
        setFormBloque({ materiaId: '', dia: '', horaInicio: '', horaFin: '', aula: '' });
        setErrBloque('');
        setOpenBloque(false);
    };

    // ── Eliminar bloque del estado local ────────────────────────────────────
    const handleRemoveBloque = (idx) => {
        setBloques(prev => prev.filter((_, i) => i !== idx));
    };

    // ── Guardar horario en BD ────────────────────────────────────────────────
    const handleGuardar = async () => {
        setSaving(true); setSaveMsg({ type: '', text: '' });
        const payload = {
            carrera: selCarrera,
            cuatrimestre: Number(selCuatri),
            grupo: selGrupo,
            bloques: bloques.map(b => ({
                materia: b.materiaId,
                dia: b.dia,
                horaInicio: b.horaInicio,
                horaFin: b.horaFin,
                aula: b.aula,
            })),
        };
        const res = await upsertHorario(payload);
        if (res.success) {
            setSaveMsg({ type: 'success', text: '✅ Horario guardado correctamente.' });
            setHorarioId(res.data._id);
        } else {
            setSaveMsg({ type: 'error', text: res.message });
        }
        setSaving(false);
    };

    // ── Eliminar horario ─────────────────────────────────────────────────────
    const handleDeleteHorario = async () => {
        await deleteHorario(selCarrera, selCuatri, selGrupo);
        setBloques([]); setHorarioId(null);
        setOpenDelete(false);
        setSaveMsg({ type: 'info', text: 'Horario eliminado.' });
    };

    // ── Vista de rejilla por día ─────────────────────────────────────────────
    // Agrupa los bloques por día para la visualización
    const bloquesPorDia = useMemo(() => {
        const map = {};
        DIAS.forEach(d => { map[d] = []; });
        bloques.forEach((b, idx) => {
            if (map[b.dia]) map[b.dia].push({ ...b, idx });
        });
        // Ordenar por hora inicio dentro de cada día
        DIAS.forEach(d => { map[d].sort((a, b) => toMin(a.horaInicio) - toMin(b.horaInicio)); });
        return map;
    }, [bloques]);

    // ── Drawer ───────────────────────────────────────────────────────────────
    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#111827', color: 'white' }}>
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: fontText, letterSpacing: 1 }}>SIGE UTSH</Typography>
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

                {/* ── Header ── */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>
                            Gestión de Horarios
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: fontText, color: 'text.secondary', mt: 0.5 }}>
                            Cuatrimestres 1–5 → 08:00–15:00 · Cuatrimestres 6–10 → 15:00–21:00
                        </Typography>
                    </Box>
                    {cargado && bloques.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            {horarioId && (
                                <Button variant="outlined" color="error" startIcon={<DeleteOutlineIcon />}
                                    onClick={() => setOpenDelete(true)}
                                    sx={{ fontFamily: fontText, textTransform: 'none', borderRadius: 2 }}>
                                    Eliminar horario
                                </Button>
                            )}
                            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleGuardar} disabled={saving}
                                sx={{
                                    fontFamily: fontText, textTransform: 'none', fontWeight: 700, borderRadius: 2,
                                    background: 'linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)'
                                }}>
                                {saving ? 'Guardando...' : 'Guardar horario'}
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* ── Panel selector de grupo ── */}
                <Card sx={{ borderRadius: 3, p: 2.5, mb: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <Typography sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '0.88rem', color: '#333', mb: 2 }}>
                        Seleccionar grupo
                    </Typography>
                    <Grid container spacing={2} alignItems="flex-end">
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth size="small">
                                <InputLabel sx={{ fontFamily: fontText }}>Carrera</InputLabel>
                                <Select value={selCarrera} onChange={e => { setSelCarrera(e.target.value); setCargado(false); }} label="Carrera"
                                    sx={{ fontFamily: fontText, borderRadius: 2 }}>
                                    {CARRERAS.map(c => <MenuItem key={c} value={c} sx={{ fontFamily: fontText }}>{c}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel sx={{ fontFamily: fontText }}>Cuatrimestre</InputLabel>
                                <Select value={selCuatri} onChange={e => { setSelCuatri(e.target.value); setCargado(false); }} label="Cuatrimestre"
                                    sx={{ fontFamily: fontText, borderRadius: 2 }}>
                                    {CUATRIS.map(n => <MenuItem key={n} value={String(n)} sx={{ fontFamily: fontText }}>{n}°</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel sx={{ fontFamily: fontText }}>Grupo</InputLabel>
                                <Select value={selGrupo} onChange={e => { setSelGrupo(e.target.value); setCargado(false); }} label="Grupo"
                                    sx={{ fontFamily: fontText, borderRadius: 2 }}>
                                    {GRUPOS.map(g => <MenuItem key={g} value={g} sx={{ fontFamily: fontText }}>Grupo {g}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button fullWidth variant="contained" onClick={handleBuscar}
                                disabled={!selCarrera || !selCuatri || !selGrupo || buscando}
                                sx={{
                                    fontFamily: fontText, textTransform: 'none', fontWeight: 700, borderRadius: 2,
                                    bgcolor: '#1976d2', py: 1
                                }}>
                                {buscando ? 'Cargando...' : 'Cargar grupo'}
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Indicador de turno */}
                    {selCuatri && (
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTimeIcon sx={{ fontSize: 16, color: Number(selCuatri) <= 5 ? '#1976d2' : '#7b1fa2' }} />
                            <Typography sx={{
                                fontFamily: fontText, fontSize: '0.8rem',
                                color: Number(selCuatri) <= 5 ? '#1976d2' : '#7b1fa2', fontWeight: 600
                            }}>
                                Turno {Number(selCuatri) <= 5 ? 'matutino (08:00 – 15:00)' : 'vespertino (15:00 – 21:00)'}
                            </Typography>
                        </Box>
                    )}
                </Card>

                {/* ── Mensajes de guardado ── */}
                {saveMsg.text && (
                    <Alert severity={saveMsg.type || 'info'} sx={{ fontFamily: fontText, borderRadius: 2, mb: 3 }}
                        onClose={() => setSaveMsg({ type: '', text: '' })}>
                        {saveMsg.text}
                    </Alert>
                )}

                {/* ── Estado: sin cargar ── */}
                {!cargado && !buscando && (
                    <Card sx={{ borderRadius: 3, p: 8, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                        <EventNoteIcon sx={{ fontSize: 56, color: '#ccc', mb: 1 }} />
                        <Typography sx={{ fontFamily: fontText, color: 'text.secondary' }}>
                            Selecciona una carrera, cuatrimestre y grupo para gestionar su horario
                        </Typography>
                    </Card>
                )}

                {/* ── Estado: cargando ── */}
                {buscando && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {DIAS.map(d => <Skeleton key={d} variant="rectangular" height={80} sx={{ borderRadius: 3 }} />)}
                    </Box>
                )}

                {/* ════════════════════════════════════════════════
                    CONSTRUCTOR DE HORARIO
                ════════════════════════════════════════════════ */}
                {cargado && !buscando && (
                    <>
                        {/* Advertencia si no hay materias inscritas */}
                        {materias.length === 0 && (
                            <Alert severity="warning" icon={<WarningAmberIcon />}
                                sx={{ fontFamily: fontText, borderRadius: 2, mb: 3 }}>
                                Este grupo no tiene materias inscritas. Ve a <strong>Gestión de Materias</strong> e inscríbelos primero.
                            </Alert>
                        )}

                        {/* Leyenda de materias */}
                        {materias.length > 0 && (
                            <Card sx={{ borderRadius: 3, p: 2, mb: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Typography sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '0.85rem', color: '#333' }}>
                                        Materias del grupo ({materias.length})
                                    </Typography>
                                    <Button variant="outlined" size="small" startIcon={<AddCircleOutlineIcon />}
                                        onClick={() => { setFormBloque({ materiaId: '', dia: '', horaInicio: '', horaFin: '', aula: '' }); setErrBloque(''); setOpenBloque(true); }}
                                        sx={{ fontFamily: fontText, textTransform: 'none', borderRadius: 2, borderColor: '#1976d2', color: '#1976d2' }}>
                                        Agregar bloque
                                    </Button>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {materias.map(m => (
                                        <Chip key={m._id}
                                            avatar={<Avatar sx={{ bgcolor: colorMap[String(m._id)], color: 'white !important', fontSize: '0.7rem' }}>
                                                {m.nombre?.charAt(0)}
                                            </Avatar>}
                                            label={`${m.nombre} · ${m.docente?.nombre || 'Sin docente'}`}
                                            size="small"
                                            sx={{
                                                fontFamily: fontText, fontSize: '0.72rem', fontWeight: 600,
                                                bgcolor: colorMap[String(m._id)] + '18',
                                                color: colorMap[String(m._id)],
                                                border: `1px solid ${colorMap[String(m._id)]}40`
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Card>
                        )}

                        {/* ── Grilla de horario por días ── */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {DIAS.map(dia => (
                                <Card key={dia} sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                                    {/* Cabecera del día */}
                                    <Box sx={{ bgcolor: '#1e1e2d', px: 3, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography sx={{ fontFamily: fontText, fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>
                                            {dia}
                                        </Typography>
                                        <Typography sx={{ fontFamily: fontText, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                                            {bloquesPorDia[dia].length === 0 ? 'Sin clases asignadas' : `${bloquesPorDia[dia].length} clase(s)`}
                                        </Typography>
                                    </Box>

                                    {/* Bloques del día */}
                                    {bloquesPorDia[dia].length === 0 ? (
                                        <Box sx={{ px: 3, py: 2.5, textAlign: 'center' }}>
                                            <Typography sx={{ fontFamily: fontText, fontSize: '0.8rem', color: '#bbb' }}>
                                                Sin clases — usa "Agregar bloque" para asignar
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                            {bloquesPorDia[dia].map(bloque => {
                                                const color = colorMap[bloque.materiaId] || '#888';
                                                return (
                                                    <Box key={bloque.idx} sx={{
                                                        position: 'relative',
                                                        bgcolor: color + '15',
                                                        border: `2px solid ${color}`,
                                                        borderRadius: 2.5,
                                                        px: 2, py: 1.5,
                                                        minWidth: 180,
                                                        flex: '1 1 180px',
                                                        maxWidth: 280,
                                                    }}>
                                                        {/* Barra de color izquierda */}
                                                        <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, bgcolor: color, borderRadius: '8px 0 0 8px' }} />

                                                        <Tooltip title="Quitar bloque">
                                                            <IconButton size="small"
                                                                onClick={() => handleRemoveBloque(bloque.idx)}
                                                                sx={{
                                                                    position: 'absolute', top: 4, right: 4, color: '#ef5350', p: 0.3,
                                                                    '&:hover': { bgcolor: '#ffebee' }
                                                                }}>
                                                                <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Typography sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '0.82rem', color, mb: 0.3, pr: 3 }}>
                                                            {bloque.materiaNombre}
                                                        </Typography>
                                                        <Typography sx={{ fontFamily: fontText, fontSize: '0.73rem', color: '#555', mb: 0.2 }}>
                                                            🕐 {bloque.horaInicio} – {bloque.horaFin}
                                                        </Typography>
                                                        {bloque.docenteNombre && (
                                                            <Typography sx={{ fontFamily: fontText, fontSize: '0.7rem', color: '#777' }}>
                                                                👨‍🏫 {bloque.docenteNombre}
                                                            </Typography>
                                                        )}
                                                        {bloque.aula && (
                                                            <Chip label={`Aula: ${bloque.aula}`} size="small"
                                                                sx={{
                                                                    mt: 0.8, fontFamily: fontText, fontSize: '0.65rem', height: 20,
                                                                    bgcolor: 'white', color: '#555', border: '1px solid #ddd'
                                                                }} />
                                                        )}
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    )}
                                </Card>
                            ))}
                        </Box>

                        {/* Botón guardar flotante al final */}
                        {materias.length > 0 && bloques.length > 0 && (
                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                                {horarioId && (
                                    <Button variant="outlined" color="error" startIcon={<DeleteOutlineIcon />}
                                        onClick={() => setOpenDelete(true)}
                                        sx={{ fontFamily: fontText, textTransform: 'none', borderRadius: 2 }}>
                                        Eliminar horario
                                    </Button>
                                )}
                                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleGuardar} disabled={saving}
                                    sx={{
                                        fontFamily: fontText, textTransform: 'none', fontWeight: 700, borderRadius: 2, px: 4,
                                        background: 'linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)'
                                    }}>
                                    {saving ? 'Guardando...' : 'Guardar horario'}
                                </Button>
                            </Box>
                        )}
                    </>
                )}
            </Box>

            {/* ── Modal: Agregar bloque ── */}
            <Dialog open={openBloque} onClose={() => setOpenBloque(false)} maxWidth="xs" fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}>
                <Box sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)', px: 4, py: 3, color: 'white' }}>
                    <Typography sx={{ fontFamily: fontText, fontWeight: 300, opacity: 0.85 }}>Nuevo bloque</Typography>
                    <Typography sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '1.3rem' }}>Agregar Clase</Typography>
                    <Typography sx={{ fontFamily: fontText, fontSize: '0.78rem', opacity: 0.8, mt: 0.3 }}>
                        Turno: {Number(selCuatri) <= 5 ? `matutino ${rango.min}–${rango.max}` : `vespertino ${rango.min}–${rango.max}`}
                    </Typography>
                </Box>
                <DialogContent sx={{ px: 3, py: 3, bgcolor: '#fafafa' }}>
                    <Grid container spacing={2}>

                        {/* Materia */}
                        <Grid item xs={12}>
                            <FormControl fullWidth size="small">
                                <InputLabel sx={{ fontFamily: fontText }}>Materia</InputLabel>
                                <Select value={formBloque.materiaId} label="Materia"
                                    onChange={e => setFormBloque({ ...formBloque, materiaId: e.target.value })}
                                    sx={{ fontFamily: fontText, borderRadius: 2, bgcolor: 'white' }}>
                                    {materias.map(m => (
                                        <MenuItem key={m._id} value={String(m._id)}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: colorMap[String(m._id)], flexShrink: 0 }} />
                                                <Box>
                                                    <Typography sx={{ fontFamily: fontText, fontSize: '0.85rem', fontWeight: 600 }}>{m.nombre}</Typography>
                                                    <Typography sx={{ fontFamily: fontText, fontSize: '0.72rem', color: '#888' }}>{m.docente?.nombre || 'Sin docente'}</Typography>
                                                </Box>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Día */}
                        <Grid item xs={12}>
                            <FormControl fullWidth size="small">
                                <InputLabel sx={{ fontFamily: fontText }}>Día</InputLabel>
                                <Select value={formBloque.dia} label="Día"
                                    onChange={e => setFormBloque({ ...formBloque, dia: e.target.value })}
                                    sx={{ fontFamily: fontText, borderRadius: 2, bgcolor: 'white' }}>
                                    {DIAS.map(d => <MenuItem key={d} value={d} sx={{ fontFamily: fontText }}>{d}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Hora inicio */}
                        <Grid item xs={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel sx={{ fontFamily: fontText }}>Hora inicio</InputLabel>
                                <Select value={formBloque.horaInicio} label="Hora inicio"
                                    onChange={e => setFormBloque({ ...formBloque, horaInicio: e.target.value, horaFin: '' })}
                                    sx={{ fontFamily: fontText, borderRadius: 2, bgcolor: 'white' }}>
                                    {slots.slice(0, -1).map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fontText }}>{s}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Hora fin — solo slots posteriores a inicio */}
                        <Grid item xs={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel sx={{ fontFamily: fontText }}>Hora fin</InputLabel>
                                <Select value={formBloque.horaFin} label="Hora fin"
                                    disabled={!formBloque.horaInicio}
                                    onChange={e => setFormBloque({ ...formBloque, horaFin: e.target.value })}
                                    sx={{ fontFamily: fontText, borderRadius: 2, bgcolor: 'white' }}>
                                    {slots.filter(s => toMin(s) > toMin(formBloque.horaInicio || rango.min))
                                        .map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fontText }}>{s}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Aula (opcional) */}
                        <Grid item xs={12}>
                            <TextField fullWidth size="small" label="Aula (opcional)"
                                value={formBloque.aula}
                                onChange={e => setFormBloque({ ...formBloque, aula: e.target.value })}
                                placeholder="Ej: Lab TI-1, Aula 4..."
                                InputLabelProps={{ style: { fontFamily: fontText } }}
                                InputProps={{ style: { fontFamily: fontText } }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                        </Grid>

                        {errBloque && (
                            <Grid item xs={12}>
                                <Alert severity="error" sx={{ fontFamily: fontText, borderRadius: 2 }}>{errBloque}</Alert>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, pt: 1, bgcolor: '#fafafa', gap: 1 }}>
                    <Button onClick={() => setOpenBloque(false)}
                        sx={{ fontFamily: fontText, textTransform: 'none', color: '#888', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                        Cancelar
                    </Button>
                    <Button onClick={handleAgregarBloque} variant="contained" fullWidth
                        sx={{
                            fontFamily: fontText, textTransform: 'none', fontWeight: 700, borderRadius: 2, py: 1.2,
                            background: 'linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)'
                        }}>
                        Agregar al horario
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Modal: Confirmar eliminar horario ── */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)} maxWidth="xs" fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontFamily: fontText, fontWeight: 700, color: '#c62828' }}>
                    ¿Eliminar horario?
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontFamily: fontText, fontSize: '0.9rem', color: '#555' }}>
                        Se eliminará el horario completo de <strong>{selCarrera} · {selCuatri}° · Grupo {selGrupo}</strong>.
                        Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button onClick={() => setOpenDelete(false)}
                        sx={{ fontFamily: fontText, textTransform: 'none', color: '#666', borderRadius: 2 }}>
                        Cancelar
                    </Button>
                    <Button onClick={handleDeleteHorario} variant="contained" color="error"
                        sx={{ fontFamily: fontText, textTransform: 'none', fontWeight: 700, borderRadius: 2 }}>
                        Sí, eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}