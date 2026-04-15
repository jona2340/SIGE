import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Drawer, Divider, Typography, Card, Chip, Avatar, IconButton, Tooltip,
    TextField, Select, MenuItem, FormControl, InputLabel,
    Button, InputAdornment, Alert, Grid, Badge, ListItemButton,
    ListItemIcon, ListItemText
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import LogoutIcon from '@mui/icons-material/Logout';
import { getAllUsers, deleteUser } from '../../service/adminService';
import { getStoredUser, logoutUser } from '../../service/authService';
import AdminNavbar from '../../components/layout/AdminNavbar.jsx';

const drawerWidth = 260;
const fontText = '"Montserrat", sans-serif';

// ── Áreas institucionales de la UTSH ──────────────────────────────────────────
const AREAS_UTSH = [
    'DIRECCIÓN DE CIENCIAS ECONÓMICO ADMINISTRATIVAS',
    'DIRECCIÓN DE CIENCIAS NATURALES E INGENIERÍA',
    'DIRECCIÓN DE TECNOLOGÍAS DE LA INFORMACIÓN',
    'DIRECCIÓN DE CIENCIAS EXACTAS',
    'DIRECCIÓN DE CIENCIAS DE LA SALUD',
];

const ROL_CONFIG = {
    STUDENT: { label: 'Estudiante', color: '#00897b', bg: '#e0f2f1' },
    TEACHER: { label: 'Docente', color: '#1565c0', bg: '#e3f2fd' },
    ADMIN: { label: 'Admin', color: '#b71c1c', bg: '#ffebee' },
};

function exportToCSV(rows) {
    const headers = ['Nombre', 'Email', 'Matrícula', 'Rol', 'Área', 'Detalle', 'Fecha'];
    const lines = rows.map(r => [
        r.nombre, r.email, r.matricula, r.rol,
        r.area || '—',
        r.rol === 'STUDENT' ? `${r.carrera} · ${r.cuatrimestre}° · Grp ${r.grupo}` :
            r.rol === 'TEACHER' ? `${r.departamento} · ${r.especialidad}` : `Nivel ${r.nivelAcceso}`,
        new Date(r.createdAt).toLocaleDateString('es-MX'),
    ].map(v => `"${v ?? ''}"`).join(','));
    const blob = new Blob([[headers.join(','), ...lines].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'usuarios_sige.csv'; a.click();
    URL.revokeObjectURL(url);
}

export default function GestionUsuarios() {
    const adminUser = getStoredUser();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');
    const [search, setSearch] = useState('');
    const [filterRol, setFilterRol] = useState('TODOS');
    const [filterArea, setFilterArea] = useState('TODAS');   // ← nuevo filtro
    const [filterCarrera, setFilterCarrera] = useState('TODAS');
    const [filterDept, setFilterDept] = useState('TODOS');
    const [filterCuatri, setFilterCuatri] = useState('TODOS');
    const [filterGrupo, setFilterGrupo] = useState('TODOS');

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setLoading(true); setFetchError('');
        try {
            const data = await getAllUsers();
            setUsuarios(data.data);
        } catch (err) { setFetchError(err.message); }
        finally { setLoading(false); }
    };

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const carreras = useMemo(() => ['TODAS', ...new Set(usuarios.filter(u => u.carrera).map(u => u.carrera))], [usuarios]);
    const deptos = useMemo(() => ['TODOS', ...new Set(usuarios.filter(u => u.departamento).map(u => u.departamento))], [usuarios]);
    const cuatris = useMemo(() => ['TODOS', ...new Set(usuarios.filter(u => u.cuatrimestre).map(u => String(u.cuatrimestre))).values()].sort(), [usuarios]);
    const grupos = useMemo(() => ['TODOS', ...new Set(usuarios.filter(u => u.grupo).map(u => u.grupo)).values()].sort(), [usuarios]);

    const rows = useMemo(() => {
        return usuarios
            .filter(u => {
                const txt = search.toLowerCase();
                const matchSearch = !txt || u.nombre.toLowerCase().includes(txt) || u.email.toLowerCase().includes(txt) || u.matricula.toLowerCase().includes(txt);
                const matchRol = filterRol === 'TODOS' || u.rol === filterRol;
                const matchArea = filterArea === 'TODAS' || u.area === filterArea;   // ← aplicar filtro área
                const matchCarr = filterCarrera === 'TODAS' || u.carrera === filterCarrera;
                const matchDept = filterDept === 'TODOS' || u.departamento === filterDept;
                const matchCuatri = filterCuatri === 'TODOS' || String(u.cuatrimestre) === filterCuatri;
                const matchGrupo = filterGrupo === 'TODOS' || u.grupo === filterGrupo;
                return matchSearch && matchRol && matchArea && matchCarr && matchDept && matchCuatri && matchGrupo;
            })
            .map(u => ({ ...u, id: u._id }));
    }, [usuarios, search, filterRol, filterArea, filterCarrera, filterDept, filterCuatri, filterGrupo]);

    const handleDelete = async (id, nombre) => {
        if (!window.confirm(`¿Eliminar a ${nombre}? Esta acción no se puede deshacer.`)) return;
        try {
            await deleteUser(id);
            setUsuarios(prev => prev.filter(u => u._id !== id));
        } catch (err) { alert('Error: ' + err.message); }
    };

    const resetFilters = () => {
        setSearch(''); setFilterRol('TODOS'); setFilterArea('TODAS');
        setFilterCarrera('TODAS'); setFilterDept('TODOS');
        setFilterCuatri('TODOS'); setFilterGrupo('TODOS');
    };

    const activeFiltersCount = [
        filterRol !== 'TODOS', filterArea !== 'TODAS',
        filterCarrera !== 'TODAS', filterDept !== 'TODOS',
        filterCuatri !== 'TODOS', filterGrupo !== 'TODOS',
    ].filter(Boolean).length;

    const columns = [
        {
            field: 'nombre', headerName: 'Nombre', flex: 1.5, minWidth: 180,
            renderCell: ({ row }) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
                    <Avatar
                        src={row.fotoPerfil ? row.fotoPerfil : undefined}
                        sx={{ bgcolor: ROL_CONFIG[row.rol]?.color, width: 32, height: 32, fontSize: '0.8rem' }}
                    >
                        {!row.fotoPerfil && row.nombre ? row.nombre.charAt(0).toUpperCase() : ''}
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontFamily: fontText, fontWeight: 600, fontSize: '0.82rem', lineHeight: 1.2 }}>
                            {row.nombre}
                        </Typography>
                        <Typography sx={{ fontFamily: fontText, fontSize: '0.72rem', color: 'text.secondary' }}>
                            {row.email}
                        </Typography>
                    </Box>
                </Box>
            ),
        },
        {
            field: 'matricula', headerName: 'Matrícula', width: 120,
            renderCell: ({ value }) => (
                <Typography sx={{ fontFamily: fontText, fontSize: '0.82rem', fontWeight: 500 }}>{value}</Typography>
            ),
        },
        {
            field: 'rol', headerName: 'Rol', width: 110,
            renderCell: ({ value }) => {
                const cfg = ROL_CONFIG[value] || {};
                return (
                    <Chip label={cfg.label || value} size="small"
                        sx={{
                            fontFamily: fontText, fontWeight: 700, fontSize: '0.7rem',
                            bgcolor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30`
                        }} />
                );
            },
        },
        // ── Columna Área ─────────────────────────────────────────────────────────
        {
            field: 'area', headerName: 'Área', flex: 1.4, minWidth: 200,
            renderCell: ({ value }) => value ? (
                <Tooltip title={value}>
                    <Typography sx={{
                        fontFamily: fontText, fontSize: '0.75rem', color: '#1565c0',
                        fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                        {value.replace('DIRECCIÓN DE ', '')}
                    </Typography>
                </Tooltip>
            ) : (
                <Typography sx={{ fontFamily: fontText, fontSize: '0.75rem', color: '#bbb' }}>—</Typography>
            ),
        },
        {
            field: 'detalle', headerName: 'Detalle del Rol', flex: 1.2, minWidth: 160,
            valueGetter: (_, row) => {
                if (row.rol === 'STUDENT') return `${row.carrera || '—'} · ${row.cuatrimestre || '—'}° · Grp ${row.grupo || '—'}`;
                if (row.rol === 'TEACHER') return `${row.departamento || '—'} · ${row.especialidad || '—'}`;
                if (row.rol === 'ADMIN') return `Nivel de acceso ${row.nivelAcceso}`;
                return '—';
            },
            renderCell: ({ value }) => (
                <Typography sx={{ fontFamily: fontText, fontSize: '0.78rem', color: '#555' }}>{value}</Typography>
            ),
        },
        {
            field: 'createdAt', headerName: 'Registro', width: 110,
            renderCell: ({ value }) => (
                <Typography sx={{ fontFamily: fontText, fontSize: '0.78rem', color: '#888' }}>
                    {value ? new Date(value).toLocaleDateString('es-MX') : '—'}
                </Typography>
            ),
        },
        {
            field: 'acciones', headerName: '', width: 60, sortable: false, filterable: false,
            renderCell: ({ row }) => (
                row._id !== adminUser?._id ? (
                    <Tooltip title="Eliminar usuario">
                        <IconButton size="small" onClick={() => handleDelete(row._id, row.nombre)}
                            sx={{ color: '#ef5350', '&:hover': { bgcolor: '#ffebee' } }}>
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                ) : null
            ),
        },
    ];

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
                <ListItemButton
                    onClick={logoutUser}
                    sx={{ borderRadius: 2, bgcolor: 'rgba(211, 47, 47, 0.1)', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.2)' } }}
                >
                    <ListItemIcon sx={{ color: '#ef5350', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Salir del Sistema"
                        primaryTypographyProps={{ fontFamily: fontText, color: '#ef5350', fontWeight: 500 }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f9' }}>

            <AdminNavbar handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth} />

            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
                    {drawerContent}
                </Drawer>
                <Drawer variant="permanent"
                    sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', bgcolor: '#111827' } }}
                    open>
                    {drawerContent}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, mt: { xs: 7, sm: 8 }, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>
                            Gestión de Usuarios
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: fontText, color: 'text.secondary', mt: 0.5 }}>
                            {loading ? 'Cargando...' : `${rows.length} de ${usuarios.length} usuarios`}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={() => exportToCSV(rows)}
                            disabled={loading || rows.length === 0}
                            sx={{ fontFamily: fontText, textTransform: 'none', borderColor: '#1976d2', color: '#1976d2', borderRadius: 2 }}>
                            Exportar CSV
                        </Button>
                    </Box>
                </Box>

                <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', mb: 2.5, p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Badge badgeContent={activeFiltersCount} color="primary">
                            <FilterListIcon sx={{ color: '#555', fontSize: 20 }} />
                        </Badge>
                        <Typography sx={{ fontFamily: fontText, fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>
                            Filtros
                        </Typography>
                        {activeFiltersCount > 0 && (
                            <Button size="small" onClick={resetFilters}
                                sx={{ fontFamily: fontText, textTransform: 'none', fontSize: '0.75rem', ml: 1, color: '#d32f2f' }}>
                                Limpiar filtros
                            </Button>
                        )}
                        <IconButton size="small" onClick={fetchUsers} sx={{ ml: 'auto', color: '#666' }}>
                            <Tooltip title="Recargar datos"><RefreshIcon fontSize="small" /></Tooltip>
                        </IconButton>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField fullWidth size="small" placeholder="Buscar por nombre, email, matrícula..."
                                value={search} onChange={e => setSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#aaa' }} /></InputAdornment>,
                                    style: { fontFamily: fontText, fontSize: '0.85rem' }
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        </Grid>

                        <Grid item xs={6} sm={3} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel sx={{ fontFamily: fontText, fontSize: '0.85rem' }}>Rol</InputLabel>
                                <Select value={filterRol} onChange={e => setFilterRol(e.target.value)} label="Rol"
                                    sx={{ fontFamily: fontText, fontSize: '0.85rem', borderRadius: 2 }}>
                                    <MenuItem value="TODOS" sx={{ fontFamily: fontText }}>Todos</MenuItem>
                                    <MenuItem value="STUDENT" sx={{ fontFamily: fontText }}>Estudiante</MenuItem>
                                    <MenuItem value="TEACHER" sx={{ fontFamily: fontText }}>Docente</MenuItem>
                                    <MenuItem value="ADMIN" sx={{ fontFamily: fontText }}>Admin</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* ── Filtro Área (visible para TODOS, STUDENT y TEACHER) ── */}
                        {(filterRol === 'TODOS' || filterRol === 'STUDENT' || filterRol === 'TEACHER') && (
                            <Grid item xs={6} sm={3} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel sx={{ fontFamily: fontText, fontSize: '0.85rem' }}>Área</InputLabel>
                                    <Select value={filterArea} onChange={e => setFilterArea(e.target.value)} label="Área"
                                        sx={{ fontFamily: fontText, fontSize: '0.85rem', borderRadius: 2 }}>
                                        <MenuItem value="TODAS" sx={{ fontFamily: fontText }}>Todas</MenuItem>
                                        {AREAS_UTSH.map(a => (
                                            <MenuItem key={a} value={a} sx={{ fontFamily: fontText, fontSize: '0.8rem', whiteSpace: 'normal' }}>
                                                {a.replace('DIRECCIÓN DE ', '')}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}

                        {(filterRol === 'TODOS' || filterRol === 'STUDENT') && (
                            <Grid item xs={6} sm={3} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel sx={{ fontFamily: fontText, fontSize: '0.85rem' }}>Carrera</InputLabel>
                                    <Select value={filterCarrera} onChange={e => setFilterCarrera(e.target.value)} label="Carrera"
                                        sx={{ fontFamily: fontText, fontSize: '0.85rem', borderRadius: 2 }}>
                                        {carreras.map(c => <MenuItem key={c} value={c} sx={{ fontFamily: fontText }}>{c === 'TODAS' ? 'Todas' : c}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}

                        {(filterRol === 'TODOS' || filterRol === 'TEACHER') && (
                            <Grid item xs={6} sm={3} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel sx={{ fontFamily: fontText, fontSize: '0.85rem' }}>Departamento</InputLabel>
                                    <Select value={filterDept} onChange={e => setFilterDept(e.target.value)} label="Departamento"
                                        sx={{ fontFamily: fontText, fontSize: '0.85rem', borderRadius: 2 }}>
                                        {deptos.map(d => <MenuItem key={d} value={d} sx={{ fontFamily: fontText }}>{d === 'TODOS' ? 'Todos' : d}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}

                        {(filterRol === 'TODOS' || filterRol === 'STUDENT') && (
                            <Grid item xs={6} sm={3} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel sx={{ fontFamily: fontText, fontSize: '0.85rem' }}>Cuatrimestre</InputLabel>
                                    <Select value={filterCuatri} onChange={e => setFilterCuatri(e.target.value)} label="Cuatrimestre"
                                        sx={{ fontFamily: fontText, fontSize: '0.85rem', borderRadius: 2 }}>
                                        {cuatris.map(c => <MenuItem key={c} value={c} sx={{ fontFamily: fontText }}>{c === 'TODOS' ? 'Todos' : `${c}°`}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}

                        {(filterRol === 'TODOS' || filterRol === 'STUDENT') && (
                            <Grid item xs={6} sm={3} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel sx={{ fontFamily: fontText, fontSize: '0.85rem' }}>Grupo</InputLabel>
                                    <Select value={filterGrupo} onChange={e => setFilterGrupo(e.target.value)} label="Grupo"
                                        sx={{ fontFamily: fontText, fontSize: '0.85rem', borderRadius: 2 }}>
                                        {grupos.map(g => <MenuItem key={g} value={g} sx={{ fontFamily: fontText }}>{g === 'TODOS' ? 'Todos' : g}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                    </Grid>

                    {activeFiltersCount > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                            {filterRol !== 'TODOS' && <Chip size="small" label={`Rol: ${ROL_CONFIG[filterRol]?.label}`} onDelete={() => setFilterRol('TODOS')} sx={{ fontFamily: fontText, fontSize: '0.75rem' }} />}
                            {filterArea !== 'TODAS' && <Chip size="small" label={`Área: ${filterArea.replace('DIRECCIÓN DE ', '')}`} onDelete={() => setFilterArea('TODAS')} sx={{ fontFamily: fontText, fontSize: '0.75rem' }} />}
                            {filterCarrera !== 'TODAS' && <Chip size="small" label={`Carrera: ${filterCarrera}`} onDelete={() => setFilterCarrera('TODAS')} sx={{ fontFamily: fontText, fontSize: '0.75rem' }} />}
                            {filterDept !== 'TODOS' && <Chip size="small" label={`Depto: ${filterDept}`} onDelete={() => setFilterDept('TODOS')} sx={{ fontFamily: fontText, fontSize: '0.75rem' }} />}
                            {filterCuatri !== 'TODOS' && <Chip size="small" label={`Cuatrimestre: ${filterCuatri}°`} onDelete={() => setFilterCuatri('TODOS')} sx={{ fontFamily: fontText, fontSize: '0.75rem' }} />}
                            {filterGrupo !== 'TODOS' && <Chip size="small" label={`Grupo: ${filterGrupo}`} onDelete={() => setFilterGrupo('TODOS')} sx={{ fontFamily: fontText, fontSize: '0.75rem' }} />}
                        </Box>
                    )}
                </Card>

                {fetchError && <Alert severity="error" sx={{ mb: 2, fontFamily: fontText }}>{fetchError}</Alert>}

                <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        autoHeight
                        pageSizeOptions={[10, 25, 50]}
                        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                        disableRowSelectionOnClick
                        localeText={{
                            noRowsLabel: 'No se encontraron usuarios con los filtros aplicados',
                            footerRowSelected: count => `${count} fila(s) seleccionada(s)`,
                            MuiTablePagination: {
                                labelRowsPerPage: 'Filas por página:',
                                labelDisplayedRows: ({ from, to, count }) => `${from}–${to} de ${count}`,
                            },
                        }}
                        slots={{
                            noRowsOverlay: () => (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', py: 6, color: 'text.secondary' }}>
                                    <PersonOffIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                                    <Typography sx={{ fontFamily: fontText, fontSize: '0.9rem' }}>
                                        No hay usuarios que coincidan con los filtros
                                    </Typography>
                                    <Button size="small" onClick={resetFilters} sx={{ fontFamily: fontText, textTransform: 'none', mt: 1 }}>
                                        Limpiar filtros
                                    </Button>
                                </Box>
                            ),
                        }}
                        sx={{
                            border: 'none',
                            fontFamily: fontText,
                            '& .MuiDataGrid-columnHeader': {
                                bgcolor: '#f8f9fa', fontFamily: fontText, fontWeight: 700,
                                fontSize: '0.78rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em',
                            },
                            '& .MuiDataGrid-row': { '&:hover': { bgcolor: '#f0f7ff' } },
                            '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f0f0', alignItems: 'center' },
                            '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #f0f0f0', fontFamily: fontText },
                            '& .MuiTablePagination-root': { fontFamily: fontText },
                        }}
                    />
                </Card>
            </Box>
        </Box>
    );
}