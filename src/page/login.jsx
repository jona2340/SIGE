import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    Link as MuiLink
} from '@mui/material';
// Importamos useNavigate para poder hacer las redirecciones automáticas
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { sigeStyles } from '../styles/sigeStyles';

export default function Login() {
    const [role, setRole] = useState('estudiante');
    const [formData, setFormData] = useState({
        usuario: '',
        password: ''
    });

    // Inicializamos el hook de navegación
    const navigate = useNavigate();

    const handleRoleChange = (event, newRole) => {
        // Evita que el usuario deseleccione todos los botones
        if (newRole !== null) {
            setRole(newRole);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login Submit:', { role, ...formData });

        // Lógica de redirección según el rol seleccionado
        if (role === 'estudiante') {
            navigate('/dashboard/estudiante');
        } else if (role === 'docente') {
            navigate('/dashboard/docente');
        } else if (role === 'admin') {
            navigate('/dashboard/admin');
        }
    };

    const fontText = '"Montserrat", sans-serif';

    // Estilo base para los ToggleButtons (para no repetir código)
    const toggleButtonStyle = {
        textTransform: 'none',
        fontWeight: 'bold',
        fontFamily: fontText,
        '&.Mui-selected': {
            bgcolor: '#1e1e2d',
            color: 'white',
            '&:hover': { bgcolor: '#2c2c3f' }
        }
    };

    return (
        <Box sx={sigeStyles.pageContainer}>
            <Box sx={sigeStyles.header}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <SchoolIcon sx={{ fontSize: 40 }} />
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2, fontFamily: fontText }}>
                            Universidad Tecnológica de la Sierra Hidalguense
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontFamily: fontText }}>
                            Sistema Integral de Gestión Educativa
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', fontFamily: fontText }}>SIGE</Typography>
            </Box>
            <Box sx={sigeStyles.mainContent}>
                <Card sx={{ ...sigeStyles.authCard, maxWidth: 450 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, fontFamily: fontText }}>Iniciar Sesión</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: fontText }}>Accede al sistema SIGE</Typography>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1, fontFamily: fontText }}>
                                Tipo de Usuario
                            </Typography>

                            {/* Selector de 3 Roles */}
                            <ToggleButtonGroup
                                value={role}
                                exclusive
                                onChange={handleRoleChange}
                                fullWidth
                                sx={{ mb: 3, height: '40px' }}
                            >
                                <ToggleButton value="estudiante" sx={toggleButtonStyle}>
                                    Estudiante
                                </ToggleButton>
                                <ToggleButton value="docente" sx={toggleButtonStyle}>
                                    Docente
                                </ToggleButton>
                                <ToggleButton value="admin" sx={toggleButtonStyle}>
                                    Admin
                                </ToggleButton>
                            </ToggleButtonGroup>

                            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1, fontFamily: fontText }}>Usuario</Typography>
                            <TextField
                                fullWidth
                                name="usuario"
                                placeholder="Ingresa tu usuario o matrícula"
                                value={formData.usuario}
                                onChange={handleChange}
                                sx={{ mb: 2, ...sigeStyles.inputField }}
                                InputProps={{ style: { fontFamily: fontText } }}
                            />

                            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1, fontFamily: fontText }}>Contraseña</Typography>
                            <TextField
                                fullWidth
                                type="password"
                                name="password"
                                placeholder="Ingresa tu contraseña"
                                value={formData.password}
                                onChange={handleChange}
                                sx={{ mb: 3, ...sigeStyles.inputField }}
                                InputProps={{ style: { fontFamily: fontText } }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ ...sigeStyles.primaryButton, fontFamily: fontText }}
                            >
                                Iniciar Sesión
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>
            <Box sx={{ py: 3, textAlign: 'center', color: 'text.secondary', position: 'relative' }}>
                <Typography variant="body2" sx={{ fontFamily: fontText }}>Universidad Tecnológica de la Sierra Hidalguense</Typography>
                <Typography variant="body2" sx={{ fontFamily: fontText }}>Sistema Integral de Gestión Educativa</Typography>
                <Box sx={{ position: 'absolute', right: 24, bottom: 24 }}>
                    <HelpOutlineIcon sx={{ color: '#1e1e2d', fontSize: 32, cursor: 'pointer' }} />
                </Box>
            </Box>
        </Box>
    );
}