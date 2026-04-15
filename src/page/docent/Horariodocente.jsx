import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Box, Typography, Card, Chip, Avatar, Tooltip,
    Button, Skeleton, Drawer, Divider, ListItemButton,
    ListItemIcon, ListItemText,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DownloadIcon from '@mui/icons-material/Download';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ClassIcon from '@mui/icons-material/Class';
import LogoutIcon from '@mui/icons-material/Logout';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DocentNavbar from '../../components/layout/DocentNavbar.jsx';
import { getStoredUser, logoutUser } from '../../service/authService.js';
import { getHorarioDocente } from '../../service/horarioService.js';

// 🚀 Librerías para el PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const drawerWidth = 260;
const fontText = '"Montserrat", sans-serif';
const accentColor = '#1e1e2d'; // 🚀 Color oscuro del docente

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

const COLORES = [
    { bg: '#e3f2fd', border: '#1976d2', text: '#0d47a1', dot: '#1976d2' },
    { bg: '#e8f5e9', border: '#2e7d32', text: '#1b5e20', dot: '#2e7d32' },
    { bg: '#fff3e0', border: '#e65100', text: '#bf360c', dot: '#e65100' },
    { bg: '#f3e5f5', border: '#7b1fa2', text: '#4a148c', dot: '#7b1fa2' },
    { bg: '#e0f7fa', border: '#00838f', text: '#004d40', dot: '#00838f' },
    { bg: '#fce4ec', border: '#c62828', text: '#b71c1c', dot: '#c62828' },
    { bg: '#ede7f6', border: '#4527a0', text: '#311b92', dot: '#4527a0' },
    { bg: '#f1f8e9', border: '#558b2f', text: '#33691e', dot: '#558b2f' },
];

const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

const HOUR_HEIGHT = 64; 
const GRID_START = 7 * 60; 

function generarEjeHoras(minHora, maxHora) {
    const horas = [];
    for (let h = minHora; h <= maxHora; h++) {
        horas.push(`${String(h).padStart(2, '0')}:00`);
    }
    return horas;
}

export default function HorarioDocente() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [bloques, setBloques] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedUser = getStoredUser();
        setUser(storedUser);
        if (storedUser) cargarHorario(storedUser);
    }, []);

    const cargarHorario = async (u) => {
        setCargando(true);
        setError('');
        try {
            const res = await getHorarioDocente(u._id);
            if (res.success && res.data) {
                setBloques((res.data.bloques || res.data || []).map((b) => ({
                    id: b._id,
                    materiaId: String(b.materia?._id || b.materia),
                    nombre: b.materia?.nombre || 'Materia',
                    // 🚀 Mostramos la carrera y grupo en lugar del docente
                    detallesClase: `${b.carrera || b.materia?.carrera || ''} - Gpo ${b.grupo || ''}`, 
                    dia: b.dia,
                    horaInicio: b.horaInicio,
                    horaFin: b.horaFin,
                    aula: b.aula || '',
                })));
            } else {
                setBloques([]);
            }
        } catch {
            setError('No se pudo cargar el horario. Intenta de nuevo más tarde.');
        } finally {
            setCargando(false);
        }
    };

    const colorMap = useMemo(() => {
        const map = {};
        let idx = 0;
        bloques.forEach(b => {
            if (!map[b.materiaId]) {
                map[b.materiaId] = COLORES[idx % COLORES.length];
                idx++;
            }
        });
        return map;
    }, [bloques]);

    const { horaMin, horaMax } = useMemo(() => {
        if (bloques.length === 0) return { horaMin: 8, horaMax: 15 };
        const mins = bloques.map(b => Math.floor(toMin(b.horaInicio) / 60));
        const maxs = bloques.map(b => Math.ceil(toMin(b.horaFin) / 60));
        return { horaMin: Math.min(...mins), horaMax: Math.max(...maxs) };
    }, [bloques]);

    const ejeHoras = useMemo(() => generarEjeHoras(horaMin, horaMax), [horaMin, horaMax]);
    const gridHeight = (horaMax - horaMin + 1) * HOUR_HEIGHT;
    const adjustedStart = horaMin * 60;

    const bloquesPorDia = useMemo(() => {
        const map = {};
        DIAS.forEach(d => { map[d] = []; });
        bloques.forEach(b => { if (map[b.dia]) map[b.dia].push(b); });
        return map;
    }, [bloques]);

    const materiasUnicas = useMemo(() => {
        const ids = new Set(bloques.map(b => b.materiaId));
        return ids.size;
    }, [bloques]);

    // 🚀 NUEVA Función para DESCARGAR PDF REAL ──
    const descargarPDFReal = () => {
        const doc = new jsPDF('landscape'); 

        // Encabezado del PDF
        doc.setFontSize(20);
        doc.setTextColor(30, 30, 45); // #1e1e2d
        doc.text('Horario Docente - SIGE UTSH', 14, 20);

        doc.setFontSize(11);
        doc.setTextColor(80, 80, 80);
        doc.text(`Docente: ${user?.nombre || 'N/A'}`, 14, 28);
        doc.text(`Matrícula: ${user?.matricula || 'N/A'}`, 14, 34);
        doc.text(`${user?.departamento || 'N/A'} · Especialidad: ${user?.especialidad || 'N/A'}`, 14, 40);

        const head = [['HORA', ...DIAS.map(d => d.toUpperCase())]];

        const horasSet = new Set();
        bloques.forEach(b => {
            for (let t = toMin(b.horaInicio); t < toMin(b.horaFin); t += 60) {
                horasSet.add(t);
            }
        });
        const horasOrdenadas = [...horasSet].sort((a, b) => a - b);

        const body = [];
        const skipCells = {};

        horasOrdenadas.forEach((minH, rowIndex) => {
            const horaLabel = `${String(Math.floor(minH / 60)).padStart(2, '0')}:00`;
            const horaFin = `${String(Math.floor((minH + 60) / 60)).padStart(2, '0')}:00`;
            
            const row = [{ content: `${horaLabel} - ${horaFin}`, styles: { fontStyle: 'bold', halign: 'center', fillColor: [248, 249, 250] } }];

            DIAS.forEach((dia, colIndex) => {
                if (skipCells[`${rowIndex}_${colIndex}`]) return;

                const bloque = bloques.find(b => b.dia === dia && toMin(b.horaInicio) <= minH && toMin(b.horaFin) > minH);

                if (bloque && toMin(bloque.horaInicio) === minH) {
                    const durMin = toMin(bloque.horaFin) - toMin(bloque.horaInicio);
                    const rowSpan = Math.ceil(durMin / 60);

                    for (let i = 1; i < rowSpan; i++) {
                        skipCells[`${rowIndex + i}_${colIndex}`] = true;
                    }

                    row.push({
                        content: `${bloque.nombre}\n\n${bloque.detallesClase}\n${bloque.horaInicio} - ${bloque.horaFin}${bloque.aula ? '\nAula: ' + bloque.aula : ''}`,
                        rowSpan: rowSpan,
                        styles: { fillColor: [240, 242, 245], halign: 'center', valign: 'middle', fontSize: 9 } 
                    });
                } else {
                    row.push('');
                }
            });
            body.push(row);
        });

        autoTable(doc, {
            head: head,
            body: body,
            startY: 48,
            theme: 'grid',
            styles: { cellPadding: 4, lineColor: [220, 220, 220] },
            headStyles: { fillColor: [30, 30, 45], halign: 'center' } // #1e1e2d header
        });

        doc.save(`Horario_Docente_${user?.matricula || 'UTSH'}.pdf`);
    };

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: accentColor, color: 'white' }}>
            <Box sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: fontText, letterSpacing: 1, mb: 2 }}>SIGE UTSH</Typography>
                <Avatar src={user?.fotoPerfil || undefined} sx={{ width: 80, height: 80, border: '3px solid #7986cb', mb: 1, bgcolor: '#7986cb' }}>
                    {!user?.fotoPerfil && user?.nombre ? user.nombre.charAt(0).toUpperCase() : ''}
                </Avatar>
                <Typography variant="body2" sx={{ color: '#7986cb', fontFamily: fontText, mt: 0.5, fontWeight: 600 }}>{user?.nombre || 'Cargando...'}</Typography>
                <Typography variant="caption" sx={{ color: '#aaa', fontFamily: fontText }}>{user?.matricula || ''}</Typography>
            </Box>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ p: 2 }}>
                <ListItemButton onClick={logoutUser} sx={{ borderRadius: 2, bgcolor: 'rgba(211, 47, 47, 0.1)', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.2)' } }}>
                    <ListItemIcon sx={{ color: '#ef5350', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Cerrar Sesión" primaryTypographyProps={{ fontFamily: fontText, color: '#ef5350', fontWeight: 500 }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    const renderGrid = () => {
        if (cargando) {
            return (
                <Box sx={{ p: 3 }}>
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} variant="rectangular" height={80} sx={{ borderRadius: 2, mb: 2 }} />
                    ))}
                </Box>
            );
        }
        if (error) {
            return (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 2 }}>
                    <ErrorOutlineIcon sx={{ fontSize: 52, color: '#ef5350' }} />
                    <Typography sx={{ fontFamily: fontText, color: '#ef5350', fontWeight: 600 }}>{error}</Typography>
                    <Button variant="outlined" onClick={() => cargarHorario(user)} sx={{ fontFamily: fontText, textTransform: 'none', borderRadius: 2, borderColor: '#ef5350', color: '#ef5350' }}>
                        Reintentar
                    </Button>
                </Box>
            );
        }
        if (bloques.length === 0) {
            return (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
                    <CalendarMonthIcon sx={{ fontSize: 64, color: '#b0bec5' }} />
                    <Typography sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '1.1rem', color: '#546e7a' }}>
                        No hay clases asignadas en el horario
                    </Typography>
                    <Typography sx={{ fontFamily: fontText, fontSize: '0.85rem', color: '#90a4ae', textAlign: 'center', maxWidth: 340 }}>
                        Tu horario aparecerá aquí una vez que sea configurado por tu coordinador académico.
                    </Typography>
                </Box>
            );
        }

        return (
            <Box sx={{ overflowX: 'auto', pb: 2 }}>
                <Box sx={{ minWidth: 720 }}>
                    {/* Header de días */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '64px repeat(5, 1fr)', gap: 0, mb: 0 }}>
                        <Box sx={{ bgcolor: 'transparent' }} />
                        {DIAS.map(dia => (
                            <Box key={dia} sx={{
                                py: 1.5, px: 1, textAlign: 'center',
                                bgcolor: accentColor, color: 'white',
                                '&:first-of-type': { borderRadius: '12px 0 0 0' },
                                '&:last-of-type': { borderRadius: '0 12px 0 0' },
                            }}>
                                <Typography sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '0.8rem', letterSpacing: 0.5 }}>
                                    {dia.toUpperCase()}
                                </Typography>
                                <Typography sx={{ fontFamily: fontText, fontSize: '0.7rem', opacity: 0.8, mt: 0.2 }}>
                                    {bloquesPorDia[dia].length} clase{bloquesPorDia[dia].length !== 1 ? 's' : ''}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Cuadrícula */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '64px repeat(5, 1fr)', position: 'relative', border: '1px solid #e8eaed', borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
                        <Box sx={{ position: 'relative', height: gridHeight, bgcolor: '#fafafa', borderRight: '1px solid #e8eaed' }}>
                            {ejeHoras.map((hora, i) => (
                                <Box key={hora} sx={{ position: 'absolute', top: i * HOUR_HEIGHT - 9, width: '100%', textAlign: 'center', zIndex: 1 }}>
                                    <Typography sx={{ fontFamily: fontText, fontSize: '0.68rem', fontWeight: 600, color: '#90a4ae' }}>{hora}</Typography>
                                </Box>
                            ))}
                            {ejeHoras.map((hora, i) => (
                                <Box key={`line-${hora}`} sx={{ position: 'absolute', top: i * HOUR_HEIGHT, left: 0, right: 0, height: '1px', bgcolor: '#e8eaed', zIndex: 0 }} />
                            ))}
                        </Box>

                        {DIAS.map((dia, dIdx) => (
                            <Box key={dia} sx={{ position: 'relative', height: gridHeight, borderRight: dIdx < 4 ? '1px solid #e8eaed' : 'none', bgcolor: 'white' }}>
                                {ejeHoras.map((_, i) => <Box key={i} sx={{ position: 'absolute', top: i * HOUR_HEIGHT, left: 0, right: 0, height: '1px', bgcolor: '#f0f2f5' }} />)}
                                {ejeHoras.map((_, i) => <Box key={`half-${i}`} sx={{ position: 'absolute', top: i * HOUR_HEIGHT + HOUR_HEIGHT / 2, left: 0, right: 0, height: '1px', bgcolor: '#f5f6f8', borderTop: '1px dashed #e8eaed' }} />)}

                                {bloquesPorDia[dia].map((bloque) => {
                                    const color = colorMap[bloque.materiaId] || COLORES[0];
                                    const topOffset = ((toMin(bloque.horaInicio) - adjustedStart) / 60) * HOUR_HEIGHT;
                                    const heightPx = ((toMin(bloque.horaFin) - toMin(bloque.horaInicio)) / 60) * HOUR_HEIGHT;
                                    const durMin = toMin(bloque.horaFin) - toMin(bloque.horaInicio);
                                    const isShort = durMin <= 60;

                                    return (
                                        <Box key={bloque.id} sx={{
                                            position: 'absolute', top: topOffset + 2, left: 4, right: 4, height: heightPx - 4,
                                            bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: 2, px: 1, py: 0.5,
                                            overflow: 'hidden', cursor: 'default', transition: 'box-shadow 0.15s ease, transform 0.15s ease',
                                            '&:hover': { boxShadow: `0 4px 16px ${color.border}44`, transform: 'scale(1.01)', zIndex: 10 }, zIndex: 1,
                                        }}>
                                            <Typography sx={{ fontFamily: fontText, fontWeight: 700, fontSize: isShort ? '0.68rem' : '0.75rem', color: color.text, lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: isShort ? 1 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {bloque.nombre}
                                            </Typography>
                                            {!isShort && (
                                                <>
                                                    <Typography sx={{ fontFamily: fontText, fontSize: '0.65rem', color: color.text, opacity: 0.75, mt: 0.3, lineHeight: 1.2 }}>
                                                        {bloque.detallesClase}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mt: 0.5 }}>
                                                        <AccessTimeIcon sx={{ fontSize: 10, color: color.text, opacity: 0.6 }} />
                                                        <Typography sx={{ fontFamily: fontText, fontSize: '0.62rem', color: color.text, opacity: 0.75 }}>
                                                            {bloque.horaInicio}–{bloque.horaFin}
                                                        </Typography>
                                                        {bloque.aula && (
                                                            <>
                                                                <LocationOnIcon sx={{ fontSize: 10, color: color.text, opacity: 0.6, ml: 0.5 }} />
                                                                <Typography sx={{ fontFamily: fontText, fontSize: '0.62rem', color: color.text, opacity: 0.75 }}>
                                                                    {bloque.aula}
                                                                </Typography>
                                                            </>
                                                        )}
                                                    </Box>
                                                </>
                                            )}
                                            {isShort && (
                                                <Typography sx={{ fontFamily: fontText, fontSize: '0.62rem', color: color.text, opacity: 0.7 }}>
                                                    {bloque.horaInicio}–{bloque.horaFin}
                                                </Typography>
                                            )}
                                        </Box>
                                    );
                                })}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f9' }}>
            <DocentNavbar handleDrawerToggle={handleDrawerToggle} user={user} drawerWidth={drawerWidth} />

            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}>
                    {drawerContent}
                </Drawer>
                <Drawer variant="permanent"
                    sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, borderRight: 'none' } }} open>
                    {drawerContent}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: { xs: 7, sm: 8 } }}>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                            <CalendarMonthIcon sx={{ fontSize: 28, color: accentColor }} />
                            <Typography variant="h5" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>
                                Mi Horario Docente
                            </Typography>
                        </Box>
                        <Typography sx={{ fontFamily: fontText, fontSize: '0.85rem', color: '#888', ml: 5.5 }}>
                            {user ? `${user.departamento} · ${user.especialidad}` : 'Cargando...'}
                        </Typography>
                    </Box>

                    {bloques.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Descargar Horario Oficial">
                                <Button
                                    variant="contained"
                                    startIcon={<DownloadIcon />}
                                    onClick={descargarPDFReal} 
                                    sx={{
                                        fontFamily: fontText, textTransform: 'none', fontWeight: 700,
                                        borderRadius: 2, bgcolor: accentColor,
                                        '&:hover': { bgcolor: '#2d2d42' },
                                        boxShadow: '0 4px 12px rgba(30,30,45,0.3)',
                                    }}>
                                    Descargar PDF
                                </Button>
                            </Tooltip>
                        </Box>
                    )}
                </Box>

                {!cargando && bloques.length > 0 && (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
                        {[
                            { label: 'Grupos Distintos', value: materiasUnicas, icon: '👨‍🏫', color: '#1e1e2d' },
                            { label: 'Clases por semana', value: bloques.length, icon: '📅', color: '#1976d2' },
                            {
                                label: 'Horas frente a grupo',
                                value: `${bloques.reduce((acc, b) => acc + (toMin(b.horaFin) - toMin(b.horaInicio)), 0) / 60}h`,
                                icon: '⏱️',
                                color: '#d32f2f'
                            },
                        ].map(item => (
                            <Card key={item.label} sx={{ borderRadius: 2.5, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: `4px solid ${item.color}` }}>
                                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Typography sx={{ fontSize: '1.4rem' }}>{item.icon}</Typography>
                                    <Box>
                                        <Typography sx={{ fontFamily: fontText, fontSize: '0.72rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            {item.label}
                                        </Typography>
                                        <Typography sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '1.3rem', color: '#1e1e2d', lineHeight: 1.2 }}>
                                            {item.value}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Card>
                        ))}
                    </Box>
                )}

                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                    <Box sx={{ p: { xs: 2, sm: 3 } }}>
                        {renderGrid()}
                    </Box>
                </Card>

                {!cargando && bloques.length > 0 && (
                    <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', mt: 3, overflow: 'hidden' }}>
                        <Box sx={{ bgcolor: accentColor, px: 3, py: 2 }}>
                            <Typography sx={{ fontFamily: fontText, fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>
                                Clases y Grupos asignados
                            </Typography>
                        </Box>
                        <Box sx={{ p: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {Object.entries(
                                bloques.reduce((acc, b) => {
                                    if (!acc[b.materiaId]) acc[b.materiaId] = b;
                                    return acc;
                                }, {})
                            ).map(([id, bloque]) => {
                                const color = colorMap[id] || COLORES[0];
                                return (
                                    <Box key={id} sx={{
                                        display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 1.5, borderRadius: 2,
                                        border: `1.5px solid ${color.border}20`, bgcolor: color.bg, minWidth: 200, flex: '1 1 200px',
                                    }}>
                                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: color.dot, flexShrink: 0, mt: 0.4 }} />
                                        <Box>
                                            <Typography sx={{ fontFamily: fontText, fontWeight: 700, fontSize: '0.82rem', color: color.text, lineHeight: 1.3 }}>
                                                {bloque.nombre}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                                                <ClassIcon sx={{ fontSize: 11, color: color.text, opacity: 0.65 }} />
                                                <Typography sx={{ fontFamily: fontText, fontSize: '0.73rem', color: color.text, opacity: 0.75 }}>
                                                    {bloque.detallesClase}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Card>
                )}
            </Box>
        </Box>
    );
}