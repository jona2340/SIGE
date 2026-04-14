import React, { useState, useEffect } from 'react';
import {
    Box, Drawer, Typography, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, Divider, Grid, Card, CardContent, Button, Chip, Avatar,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Select, MenuItem, FormControl, InputLabel, Alert, Skeleton,
    IconButton, Tooltip, Link, InputAdornment, Stack, Badge
} from '@mui/material';
import AdminNavbar from '../components/layout/AdminNavbar.jsx';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { getStoredUser, logoutUser } from '../service/authService';
import { getAllUsers, registerUser, deleteUser } from '../service/adminService';

const drawerWidth = 260;
const fontText = '"Montserrat", sans-serif';

const emptyForm = {
    nombre: '', email: '', matricula: '', password: '',
    rol: 'STUDENT',
    carrera: '', area: '', cuatrimestre: '', grupo: '',
    departamento: '', especialidad: '',
    nivelAcceso: 1,
    fotoPerfil: ''
};

const ROL_COLORS = { STUDENT: '#00897b', TEACHER: '#1976d2', ADMIN: '#d32f2f' };
const ROL_LABELS = { STUDENT: 'Estudiante', TEACHER: 'Docente', ADMIN: 'Admin' };

const StyledInput = ({ Icon, ...props }) => (
    <TextField
        fullWidth
        variant="outlined"
        sx={{
            bgcolor: '#f7f7f7',
            borderRadius: '12px',
            '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'transparent' },
                '&.Mui-focused fieldset': { borderColor: '#1976d2' },
            },
            ...props.sx,
        }}
        InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    {Icon && <Icon sx={{ color: '#9e9e9e' }} />}
                </InputAdornment>
            ),
            ...props.InputProps,
        }}
        {...props}
    />
);

export default function DashboardAdmin() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [adminUser, setAdminUser] = useState(null);

    const [usuarios, setUsuarios] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [fetchError, setFetchError] = useState('');

    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setAdminUser(getStoredUser());
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        setFetchError('');
        try {
            const data = await getAllUsers();
            setUsuarios(data.data);
        } catch (err) {
            setFetchError(err.message);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const handleOpenModal = (defaultRol = 'STUDENT') => {
        setFormData({ ...emptyForm, rol: defaultRol });
        setFormError('');
        setFormSuccess('');
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        if (!submitting) setOpenModal(false);
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (formError) setFormError('');
    };

    // CORRECCIÓN APLICADA AQUÍ ABAJO 👇
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setFormError('Por favor selecciona una imagen válida.');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setFormError('La imagen debe pesar menos de 2MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                // Usamos una función de callback para asegurar que no se sobreescriban otros campos
                setFormData((prev) => ({ ...prev, fotoPerfil: reader.result }));
                setFormError('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitUser = async () => {
        setSubmitting(true);
        setFormError('');
        setFormSuccess('');

        const payload = {
            nombre: formData.nombre,
            email: formData.email,
            matricula: formData.matricula,
            password: formData.password,
            rol: formData.rol,
            fotoPerfil: formData.fotoPerfil,
        };

        if (formData.rol === 'STUDENT') {
            payload.carrera = formData.carrera;
            payload.area = formData.area;
            payload.cuatrimestre = Number(formData.cuatrimestre);
            payload.grupo = formData.grupo;
        } else if (formData.rol === 'TEACHER') {
            payload.departamento = formData.departamento;
            payload.especialidad = formData.especialidad;
        } else if (formData.rol === 'ADMIN') {
            payload.nivelAcceso = Number(formData.nivelAcceso);
        }

        try {
            await registerUser(payload);
            setFormSuccess('✅ Usuario registrado exitosamente.');
            await fetchUsers();
            setTimeout(() => setOpenModal(false), 1200);
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (userId, nombre) => {
        if (!window.confirm(`¿Eliminar a ${nombre}? Esta acción no se puede deshacer.`)) return;
        try {
            await deleteUser(userId);
            setUsuarios((prev) => prev.filter((u) => u._id !== userId));
        } catch (err) {
            alert('Error al eliminar: ' + err.message);
        }
    };

    const totalEstudiantes = usuarios.filter(u => u.rol === 'STUDENT').length;
    const totalDocentes = usuarios.filter(u => u.rol === 'TEACHER').length;
    const totalAdmins = usuarios.filter(u => u.rol === 'ADMIN').length;


    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#111827', color: 'white' }}>
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: fontText, letterSpacing: 1 }}>SIGE UTSH</Typography>
                <Typography variant="caption" sx={{ color: '#42a5f5', fontFamily: fontText, fontWeight: 600 }}>{adminUser?.nombre || 'ADMINISTRACIÓN CENTRAL'}</Typography>
            </Box>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            <List sx={{ flexGrow: 1, px: 2, mt: 2 }}>
            </List>
            <Box sx={{ p: 2 }}>
                <ListItemButton onClick={logoutUser} sx={{ borderRadius: 2, bgcolor: 'rgba(211, 47, 47, 0.1)', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.2)' } }}>
                    <ListItemIcon sx={{ color: '#ef5350', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Salir del Sistema" primaryTypographyProps={{ fontFamily: fontText, color: '#ef5350', fontWeight: 500 }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f9' }}>
            <AdminNavbar handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth} onOpenModal={handleOpenModal} />

            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>{drawerContent}</Drawer>
                <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', bgcolor: '#111827' } }} open>{drawerContent}</Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: 4, mt: { xs: 7, sm: 8 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h5" sx={{ fontFamily: fontText, fontWeight: 700, color: '#1e1e2d' }}>Panel de Control Maestro</Typography>
                    <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => handleOpenModal('STUDENT')} sx={{ bgcolor: '#1976d2', textTransform: 'none', fontFamily: fontText, borderRadius: 2, px: 3 }}>Nuevo Usuario</Button>
                </Box>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {[
                        { label: 'Estudiantes', value: totalEstudiantes, color: '#00897b' },
                        { label: 'Docentes', value: totalDocentes, color: '#1976d2' },
                        { label: 'Administradores', value: totalAdmins, color: '#ed6c02' },
                        { label: 'Total Usuarios', value: usuarios.length, color: '#1e1e2d' },
                    ].map((kpi, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{ borderRadius: 3, borderLeft: `5px solid ${kpi.color}`, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                                <CardContent sx={{ py: 2.5 }}>
                                    <Typography variant="caption" sx={{ fontFamily: fontText, color: 'text.secondary', fontWeight: 600 }}>
                                        {kpi.label.toUpperCase()}
                                    </Typography>
                                    {loadingUsers ? (
                                        <Skeleton variant="text" width={60} height={60} />
                                    ) : (
                                        <Typography variant="h4" sx={{ fontFamily: fontText, fontWeight: 700, mt: 0.5 }}>
                                            {kpi.value}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                        <Typography variant="h6" sx={{ fontFamily: fontText, fontWeight: 600, fontSize: '1rem' }}>Usuarios Registrados</Typography>
                        <Button size="small" onClick={fetchUsers} sx={{ fontFamily: fontText, textTransform: 'none' }}>Actualizar</Button>
                    </Box>

                    {fetchError && (
                        <Alert severity="error" sx={{ m: 2, fontFamily: fontText }}>{fetchError}</Alert>
                    )}

                    <List sx={{ p: 0 }}>
                        {loadingUsers ? (
                            [1, 2, 3].map((i) => (
                                <ListItem key={i} sx={{ py: 2, px: 3 }}>
                                    <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Skeleton variant="text" width="40%" />
                                        <Skeleton variant="text" width="60%" />
                                    </Box>
                                </ListItem>
                            ))
                        ) : usuarios.length === 0 ? (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography sx={{ fontFamily: fontText, color: 'text.secondary' }}>
                                    No hay usuarios registrados aún.
                                </Typography>
                            </Box>
                        ) : (
                            usuarios.map((item, idx) => (
                                <React.Fragment key={item._id}>
                                    <ListItem sx={{ py: 2, px: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>

                                            {/* Avatar rediseñado para mostrar fotoPerfil de forma prominente */}
                                            <Avatar
                                                src={item.fotoPerfil ? item.fotoPerfil : undefined}
                                                sx={{
                                                    bgcolor: ROL_COLORS[item.rol] || '#999',
                                                    width: 48,
                                                    height: 48,
                                                    border: '2px solid white',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                                }}
                                            >
                                                {!item.fotoPerfil && item.nombre ? item.nombre.charAt(0).toUpperCase() : ''}
                                            </Avatar>

                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography sx={{ fontFamily: fontText, fontWeight: 600, fontSize: '0.95rem' }}>{item.nombre}</Typography>
                                                <Typography sx={{ fontFamily: fontText, color: 'text.secondary', fontSize: '0.8rem' }}>{item.email} · {item.matricula}</Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Chip label={ROL_LABELS[item.rol] || item.rol} size="small" sx={{ fontFamily: fontText, fontWeight: 600, fontSize: '0.7rem', bgcolor: ROL_COLORS[item.rol] + '20', color: ROL_COLORS[item.rol] }} />
                                                {item._id !== adminUser?._id && (
                                                    <Tooltip title="Eliminar usuario">
                                                        <IconButton size="small" onClick={() => handleDeleteUser(item._id, item.nombre)} sx={{ color: '#ef5350' }}>
                                                            <DeleteOutlineIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        </Box>
                                    </ListItem>
                                    {idx !== usuarios.length - 1 && <Divider />}
                                </React.Fragment>
                            ))
                        )}
                    </List>
                </Card>
            </Box>

            {/* --- MODAL DE REGISTRO --- */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px', padding: '20px', fontFamily: fontText } }}>
                <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>Hola de nuevo,</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>Registrar Cuenta</Typography>
                </DialogTitle>

                <DialogContent dividers sx={{ borderColor: '#eee', pt: 3 }}>
                    <Stack spacing={2} sx={{ mt: 1 }}>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    <IconButton
                                        component="label"
                                        sx={{ bgcolor: '#1976d2', color: 'white', width: 34, height: 34, boxShadow: 2, '&:hover': { bgcolor: '#1565c0' } }}
                                    >
                                        <PhotoCameraIcon sx={{ fontSize: 18 }} />
                                        <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
                                    </IconButton>
                                }
                            >
                                <Avatar
                                    src={formData.fotoPerfil}
                                    sx={{ width: 85, height: 85, bgcolor: '#f0f0f0', border: '3px solid white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                                >
                                    <PersonOutlineIcon sx={{ fontSize: 45, color: '#9e9e9e' }} />
                                </Avatar>
                            </Badge>
                        </Box>

                        <FormControl fullWidth size="small">
                            <InputLabel sx={{ fontFamily: fontText }}>Rol</InputLabel>
                            <Select name="rol" value={formData.rol} onChange={handleFormChange} label="Rol" sx={{ borderRadius: '12px' }}>
                                <MenuItem value="STUDENT" sx={{ fontFamily: fontText }}>Estudiante</MenuItem>
                                <MenuItem value="TEACHER" sx={{ fontFamily: fontText }}>Docente</MenuItem>
                                <MenuItem value="ADMIN" sx={{ fontFamily: fontText }}>Administrador</MenuItem>
                            </Select>
                        </FormControl>

                        <StyledInput Icon={PersonOutlineIcon} placeholder="Nombre completo" name="nombre" value={formData.nombre} onChange={handleFormChange} />
                        <StyledInput Icon={MailOutlineIcon} placeholder="Email institucional" name="email" value={formData.email} onChange={handleFormChange} />
                        <StyledInput Icon={BadgeOutlinedIcon} placeholder="Matrícula / ID" name="matricula" value={formData.matricula} onChange={handleFormChange} />
                        <StyledInput Icon={LockOpenOutlinedIcon} placeholder="Contraseña" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleFormChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Campos de ESTUDIANTE */}
                        {formData.rol === 'STUDENT' && (
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6}>
                                    <StyledInput select placeholder="Carrera" name="carrera" value={formData.carrera} onChange={handleFormChange} Icon={SchoolIcon}>
                                        <MenuItem value="Tecnologías de la Información">Tecnologías de la Información</MenuItem>
                                        <MenuItem value="Mecatrónica">Mecatrónica</MenuItem>
                                        <MenuItem value="Desarrollo de Negocios">Desarrollo de Negocios</MenuItem>
                                        <MenuItem value="Contaduría">Contaduría</MenuItem>
                                        <MenuItem value="Enfermería">Enfermería</MenuItem>
                                        <MenuItem value="Terapia Física">Terapia Física</MenuItem>
                                        <MenuItem value="Diseño Textil">Diseño Textil</MenuItem>
                                        <MenuItem value="Recursos Naturales">Recursos Naturales</MenuItem>
                                    </StyledInput>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledInput placeholder="Área" name="area" value={formData.area} onChange={handleFormChange} />
                                </Grid>
                                <Grid item xs={6}>
                                    <StyledInput select placeholder="Cuatrimestre" name="cuatrimestre" value={formData.cuatrimestre} onChange={handleFormChange}>
                                        {[...Array(10).keys()].map((num) => (<MenuItem key={num + 1} value={num + 1}>{num + 1}</MenuItem>))}
                                    </StyledInput>
                                </Grid>
                                <Grid item xs={6}>
                                    <StyledInput select placeholder="Grupo" name="grupo" value={formData.grupo} onChange={handleFormChange}>
                                        {['A', 'B', 'C', 'D'].map((letra) => (<MenuItem key={letra} value={letra}>{letra}</MenuItem>))}
                                    </StyledInput>
                                </Grid>
                            </Grid>
                        )}

                        {/* Campos de DOCENTE */}
                        {formData.rol === 'TEACHER' && (
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6}>
                                    <StyledInput select placeholder="Departamento" name="departamento" value={formData.departamento} onChange={handleFormChange} Icon={ApartmentOutlinedIcon}>
                                        <MenuItem value="Ciencias Exactas y Básicas">Ciencias Exactas y Básicas</MenuItem>
                                        <MenuItem value="Económico-Administrativa">Económico-Administrativa</MenuItem>
                                        <MenuItem value="Tecnologías de la Información">Tecnologías de la Información</MenuItem>
                                        <MenuItem value="Mecánica y Manufactura">Mecánica y Manufactura</MenuItem>
                                        <MenuItem value="Ciencias de la Salud">Ciencias de la Salud</MenuItem>
                                        <MenuItem value="Diseño y Arte">Diseño y Arte</MenuItem>
                                    </StyledInput>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledInput select placeholder="Especialidad" name="especialidad" value={formData.especialidad} onChange={handleFormChange} Icon={StarBorderOutlinedIcon}>
                                        <MenuItem value="Desarrollo de Software Multiplataforma">Desarrollo de Software Multiplataforma</MenuItem>
                                        <MenuItem value="Infraestructura de Redes Digitales">Infraestructura de Redes Digitales</MenuItem>
                                        <MenuItem value="Automatización">Automatización</MenuItem>
                                        <MenuItem value="Finanzas">Finanzas</MenuItem>
                                        <MenuItem value="Mercadotecnia">Mercadotecnia</MenuItem>
                                        <MenuItem value="Salud Pública">Salud Pública</MenuItem>
                                        <MenuItem value="Rehabilitación">Rehabilitación</MenuItem>
                                        <MenuItem value="Confección Textil">Confección Textil</MenuItem>
                                    </StyledInput>
                                </Grid>
                            </Grid>
                        )}

                        {/* Campos de ADMIN */}
                        {formData.rol === 'ADMIN' && (
                            <FormControl fullWidth size="small">
                                <InputLabel sx={{ fontFamily: fontText }}>Nivel de Acceso</InputLabel>
                                <Select name="nivelAcceso" value={formData.nivelAcceso} onChange={handleFormChange} label="Nivel de Acceso" sx={{ borderRadius: '12px' }}>
                                    <MenuItem value={1} sx={{ fontFamily: fontText }}>1 — Solo lectura</MenuItem>
                                    <MenuItem value={2} sx={{ fontFamily: fontText }}>2 — Gestión</MenuItem>
                                    <MenuItem value={3} sx={{ fontFamily: fontText }}>3 — Superadmin</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        {formError && <Alert severity="error" sx={{ fontFamily: fontText, borderRadius: '12px' }}>{formError}</Alert>}
                        {formSuccess && <Alert severity="success" sx={{ fontFamily: fontText, borderRadius: '12px' }}>{formSuccess}</Alert>}
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
                    <Button onClick={handleSubmitUser} variant="contained" fullWidth disabled={submitting} sx={{ fontFamily: fontText, textTransform: 'none', bgcolor: '#1976d2', borderRadius: '20px', px: 3, py: 1.5, '&:hover': { bgcolor: '#1565c0' } }}>
                        {submitting ? 'Registrando...' : 'Registrar Cuenta'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}