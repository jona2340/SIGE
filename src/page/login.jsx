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
import { Link as RouterLink } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Importamos nuestro archivo de estilos centralizado
import { sigeStyles } from '../styles/sigeStyles';

export default function Login() {
    const [role, setRole] = useState('estudiante');
    const [formData, setFormData] = useState({
        usuario: '',
        password: ''
    });

    const handleRoleChange = (event, newRole) => {
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
    };

    // Declaramos la fuente para inyectarla fácilmente en las propiedades sx
    const fontText = '"Montserrat", sans-serif';

    return (
        <Box sx={sigeStyles.pageContainer}>
            {/* Header */}
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

            {/* Main Content */}
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
                            <ToggleButtonGroup
                                value={role}
                                exclusive
                                onChange={handleRoleChange}
                                fullWidth
                                sx={{ mb: 3, height: '40px' }}
                            >
                                <ToggleButton
                                    value="estudiante"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        fontFamily: fontText,
                                        '&.Mui-selected': { bgcolor: '#1e1e2d', color: 'white', '&:hover': { bgcolor: '#2c2c3f' } }
                                    }}
                                >
                                    Estudiante
                                </ToggleButton>
                                <ToggleButton
                                    value="docente"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        fontFamily: fontText,
                                        '&.Mui-selected': { bgcolor: '#1e1e2d', color: 'white', '&:hover': { bgcolor: '#2c2c3f' } }
                                    }}
                                >
                                    Docente
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

                            {/* Enlaces de navegación con React Router */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3, gap: 1.5 }}>
                                <MuiLink href="#" underline="hover" sx={{ color: 'text.secondary', fontSize: '0.875rem', fontFamily: fontText }}>
                                    ¿Olvidaste tu contraseña?
                                </MuiLink>
                                <MuiLink component={RouterLink} to="/registro/estudiante" underline="hover" sx={{ color: '#00897b', fontWeight: 500, fontSize: '0.875rem', fontFamily: fontText }}>
                                    ¿Eres de nuevo ingreso? Regístrate como Estudiante
                                </MuiLink>
                                <MuiLink component={RouterLink} to="/registro/docente" underline="hover" sx={{ color: '#00897b', fontWeight: 500, fontSize: '0.875rem', fontFamily: fontText }}>
                                    Registro de personal Docente
                                </MuiLink>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            </Box>

            {/* Footer */}
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