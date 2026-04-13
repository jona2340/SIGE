import React, { useState } from 'react';
import {
    AppBar, Toolbar, IconButton, Typography, Avatar, Box, Badge, Menu, MenuItem,
    ListItemIcon, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Grid
} from '@mui/material';

// Íconos
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

export default function AdminNavbar({ handleDrawerToggle, drawerWidth = 260 }) {
    const [anchorElProfile, setAnchorElProfile] = useState(null);
    const [anchorElAdd, setAnchorElAdd] = useState(null);

    // Estados para el Modal de Registro
    const [openModal, setOpenModal] = useState(false);
    const [userType, setUserType] = useState(''); // 'Estudiante', 'Docente', 'Administrador'
    const [profilePhoto, setProfilePhoto] = useState(null);

    // Estado unificado ocupando los campos de tus archivos originales
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        // Campos de estudiante
        matricula: '',
        cuatrimestre_actual: '',
        // Campos de docente
        numero_empleado: '',
        departamento_o_academia: '',
        // Campos de admin
        area_responsabilidad: ''
    });

    const fontText = '"Montserrat", sans-serif';

    const handleProfileClick = (event) => setAnchorElProfile(event.currentTarget);
    const handleProfileClose = () => setAnchorElProfile(null);
    const handleAddClick = (event) => setAnchorElAdd(event.currentTarget);
    const handleAddClose = () => setAnchorElAdd(null);

    const handleOpenModal = (type) => {
        setUserType(type);
        setProfilePhoto(null);
        // Limpiamos el formulario al abrir
        setFormData({
            nombre: '', apellidos: '', email: '', password: '',
            matricula: '', cuatrimestre_actual: '',
            numero_empleado: '', departamento_o_academia: '', area_responsabilidad: ''
        });
        setOpenModal(true);
        handleAddClose();
    };

    const handleCloseModal = () => setOpenModal(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePhoto(URL.createObjectURL(file));
        }
    };

    const handleSaveUser = (e) => {
        e.preventDefault();
        console.log(`Guardando nuevo ${userType}...`, { foto: profilePhoto, ...formData });
        // Aquí se enviaría la data al backend
        handleCloseModal();
    };

    return (
        <>
            <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` }, bgcolor: 'white', color: '#333', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' }, color: '#1976d2' }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" sx={{ fontFamily: fontText, fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
                            Panel de Administración
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>

                        {/* Botón de Agregar Usuario */}
                        <Button variant="outlined" startIcon={<PersonAddIcon />} onClick={handleAddClick} sx={{ fontFamily: fontText, textTransform: 'none', fontWeight: 600, color: '#1976d2', borderColor: '#1976d2', borderRadius: 2, display: { xs: 'none', md: 'flex' } }}>
                            Nuevo Registro
                        </Button>
                        <IconButton onClick={handleAddClick} sx={{ color: '#1976d2', display: { xs: 'flex', md: 'none' } }}>
                            <PersonAddIcon />
                        </IconButton>

                        {/* Menú Desplegable de Agregar Usuario */}
                        <Menu anchorEl={anchorElAdd} open={Boolean(anchorElAdd)} onClose={handleAddClose} PaperProps={{ elevation: 0, sx: { overflow: 'visible', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))', mt: 1.5, borderRadius: 2 } }} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                            <MenuItem onClick={() => handleOpenModal('Estudiante')} sx={{ fontFamily: fontText }}>Nuevo Estudiante</MenuItem>
                            <MenuItem onClick={() => handleOpenModal('Docente')} sx={{ fontFamily: fontText }}>Nuevo Docente</MenuItem>
                            <MenuItem onClick={() => handleOpenModal('Administrador')} sx={{ fontFamily: fontText }}>Nuevo Administrador</MenuItem>
                        </Menu>

                        {/* Campana y Perfil */}
                        <IconButton sx={{ color: '#666' }}>
                            <Badge badgeContent={12} color="warning"><NotificationsIcon /></Badge>
                        </IconButton>

                        <Box onClick={handleProfileClick} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', '&:hover': { bgcolor: '#f3f4f6' } }}>
                            <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                                <Typography variant="body2" sx={{ fontFamily: fontText, fontWeight: 600, color: '#333', lineHeight: 1.2 }}>Admin. General</Typography>
                                <Typography variant="caption" sx={{ fontFamily: fontText, color: '#1976d2', fontWeight: 500 }}>Super Admin</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#1976d2', width: 38, height: 38 }}><AdminPanelSettingsIcon fontSize="small" /></Avatar>
                        </Box>

                        <Menu anchorEl={anchorElProfile} open={Boolean(anchorElProfile)} onClose={handleProfileClose} PaperProps={{ elevation: 0, sx: { overflow: 'visible', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))', mt: 1.5, minWidth: 200, borderRadius: 2 } }} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                            <MenuItem sx={{ fontFamily: fontText }}><ListItemIcon><PersonIcon fontSize="small" sx={{ color: '#1976d2' }} /></ListItemIcon>Mi Perfil</MenuItem>
                            <MenuItem sx={{ fontFamily: fontText }}><ListItemIcon><SettingsIcon fontSize="small" sx={{ color: '#666' }} /></ListItemIcon>Ajustes del Sistema</MenuItem>
                            <Divider />
                            <MenuItem sx={{ fontFamily: fontText, color: '#d32f2f' }}><ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#d32f2f' }} /></ListItemIcon>Cerrar Sesión</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* MODAL DINÁMICO OCUPANDO TUS REGISTROS */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontFamily: fontText, fontWeight: 700, borderBottom: '1px solid #eee', bgcolor: userType === 'Estudiante' ? '#00897b' : userType === 'Docente' ? '#1e1e2d' : '#1976d2', color: 'white' }}>
                    Registrar {userType}
                </DialogTitle>
                <form onSubmit={handleSaveUser}>
                    <DialogContent sx={{ mt: 2 }}>

                        {/* 1. SECCIÓN: Foto de Perfil */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                            <input accept="image/*" style={{ display: 'none' }} id="upload-profile-photo" type="file" onChange={handlePhotoUpload} />
                            <label htmlFor="upload-profile-photo">
                                <IconButton component="span" sx={{ position: 'relative', p: 0 }}>
                                    <Avatar src={profilePhoto} sx={{ width: 100, height: 100, bgcolor: '#f0f0f0', color: '#999', border: '2px dashed #ccc' }}>
                                        {!profilePhoto && <PhotoCameraIcon fontSize="large" />}
                                    </Avatar>
                                    <Avatar sx={{ width: 30, height: 30, bgcolor: '#1976d2', position: 'absolute', bottom: 0, right: 0, border: '2px solid white' }}>
                                        <PhotoCameraIcon sx={{ fontSize: 16 }} />
                                    </Avatar>
                                </IconButton>
                            </label>
                            <Typography variant="caption" sx={{ mt: 1, fontFamily: fontText, color: '#666' }}>Subir foto de perfil</Typography>
                        </Box>

                        {/* 2. SECCIÓN: Campos del Formulario */}
                        <Grid container spacing={2}>
                            {/* Campos Universales */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block', fontFamily: fontText }}>Nombre(s)</Typography>
                                <TextField fullWidth name="nombre" value={formData.nombre} onChange={handleChange} size="small" required InputProps={{ style: { fontFamily: fontText } }} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block', fontFamily: fontText }}>Apellidos</Typography>
                                <TextField fullWidth name="apellidos" value={formData.apellidos} onChange={handleChange} size="small" required InputProps={{ style: { fontFamily: fontText } }} />
                            </Grid>

                            {/* Campos específicos de ESTUDIANTE (De tu archivo register.student.jsx) */}
                            {userType === 'Estudiante' && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block', fontFamily: fontText }}>Matrícula</Typography>
                                        <TextField fullWidth name="matricula" value={formData.matricula} onChange={handleChange} size="small" required InputProps={{ style: { fontFamily: fontText } }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block', fontFamily: fontText }}>Cuatrimestre</Typography>
                                        <TextField fullWidth select name="cuatrimestre_actual" value={formData.cuatrimestre_actual} onChange={handleChange} size="small" required InputProps={{ style: { fontFamily: fontText } }}>
                                            <MenuItem value="" disabled>Selecciona...</MenuItem>
                                            {[1, 2, 3, 4, 5, 6].map((num) => (
                                                <MenuItem key={num} value={num} sx={{ fontFamily: fontText }}>{num}° Cuatrimestre</MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </>
                            )}

                            {/* Campos específicos de DOCENTE (De tu archivo register.docent.jsx) */}
                            {userType === 'Docente' && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block', fontFamily: fontText }}>No. de Empleado</Typography>
                                        <TextField fullWidth name="numero_empleado" value={formData.numero_empleado} onChange={handleChange} size="small" required InputProps={{ style: { fontFamily: fontText } }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block', fontFamily: fontText }}>Academia / Departamento</Typography>
                                        <TextField fullWidth name="departamento_o_academia" value={formData.departamento_o_academia} onChange={handleChange} size="small" required InputProps={{ style: { fontFamily: fontText } }} />
                                    </Grid>
                                </>
                            )}

                            {/* Campos específicos de ADMINISTRADOR */}
                            {userType === 'Administrador' && (
                                <Grid item xs={12}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block', fontFamily: fontText }}>Área de Responsabilidad</Typography>
                                    <TextField fullWidth name="area_responsabilidad" value={formData.area_responsabilidad} onChange={handleChange} placeholder="Ej. Servicios Escolares, Sistemas" size="small" required InputProps={{ style: { fontFamily: fontText } }} />
                                </Grid>
                            )}

                            {/* Correo y Contraseña Universales */}
                            <Grid item xs={12}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block', fontFamily: fontText }}>Correo Institucional</Typography>
                                <TextField fullWidth type="email" name="email" value={formData.email} onChange={handleChange} size="small" required InputProps={{ style: { fontFamily: fontText } }} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block', fontFamily: fontText }}>Contraseña de Acceso</Typography>
                                <TextField fullWidth type="password" name="password" value={formData.password} onChange={handleChange} size="small" required InputProps={{ style: { fontFamily: fontText } }} />
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'center', gap: 2 }}>
                        <Button onClick={handleCloseModal} variant="outlined" sx={{ fontFamily: fontText, color: '#666', borderColor: '#ccc', textTransform: 'none', px: 4 }}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="contained" sx={{ fontFamily: fontText, bgcolor: userType === 'Estudiante' ? '#00897b' : userType === 'Docente' ? '#1e1e2d' : '#1976d2', textTransform: 'none', px: 4 }}>
                            Guardar {userType}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}