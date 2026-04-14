import React, { useState } from 'react';
import {
    Box, Card, CardContent, Typography, TextField,
    Button, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { sigeStyles } from '../styles/sigeStyles';
import { loginUser } from '../service/authService';

const fontText = '"Montserrat", sans-serif';

const ROL_MAP = {
    estudiante: 'STUDENT',
    docente: 'TEACHER',
    admin: 'ADMIN',
};

const ROUTE_MAP = {
    estudiante: '/dashboard/estudiante',
    docente: '/dashboard/docente',
    admin: '/dashboard/admin',
};

export default function Login() {
    const [role, setRole] = useState('estudiante');
    const [formData, setFormData] = useState({ usuario: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRoleChange = (event, newRole) => {
        if (newRole !== null) {
            setRole(newRole);
            setError(''); // limpiar error al cambiar rol
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(''); // limpiar error al escribir
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await loginUser(
                formData.usuario,
                formData.password,
                ROL_MAP[role]
            );

            // Guardar sesión en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirigir al dashboard correspondiente
            navigate(ROUTE_MAP[role]);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, fontFamily: fontText }}>
                                Iniciar Sesión
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: fontText }}>
                                Accede al sistema SIGE
                            </Typography>
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
                                <ToggleButton value="estudiante" sx={toggleButtonStyle}>Estudiante</ToggleButton>
                                <ToggleButton value="docente" sx={toggleButtonStyle}>Docente</ToggleButton>
                                <ToggleButton value="admin" sx={toggleButtonStyle}>Admin</ToggleButton>
                            </ToggleButtonGroup>

                            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1, fontFamily: fontText }}>
                                Usuario / Matrícula
                            </Typography>
                            <TextField
                                fullWidth
                                name="usuario"
                                placeholder="Ingresa tu usuario o matrícula"
                                value={formData.usuario}
                                onChange={handleChange}
                                disabled={loading}
                                sx={{ mb: 2, ...sigeStyles.inputField }}
                                InputProps={{ style: { fontFamily: fontText } }}
                            />

                            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1, fontFamily: fontText }}>
                                Contraseña
                            </Typography>
                            <TextField
                                fullWidth
                                type="password"
                                name="password"
                                placeholder="Ingresa tu contraseña"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                sx={{ mb: 2, ...sigeStyles.inputField }}
                                InputProps={{ style: { fontFamily: fontText } }}
                            />

                            {/* Mensaje de error del backend */}
                            {error && (
                                <Box sx={{ bgcolor: '#fdecea', border: '1px solid #f5c6cb', borderRadius: 2, px: 2, py: 1.5, mb: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#d32f2f', fontFamily: fontText, fontWeight: 500 }}>
                                        ⚠ {error}
                                    </Typography>
                                </Box>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    ...sigeStyles.primaryButton,
                                    fontFamily: fontText,
                                    opacity: loading ? 0.75 : 1,
                                }}
                            >
                                {loading ? 'Verificando...' : 'Iniciar Sesión'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>

            <Box sx={{ py: 3, textAlign: 'center', color: 'text.secondary', position: 'relative' }}>
                <Typography variant="body2" sx={{ fontFamily: fontText }}>
                    Universidad Tecnológica de la Sierra Hidalguense
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: fontText }}>
                    Sistema Integral de Gestión Educativa
                </Typography>
                <Box sx={{ position: 'absolute', right: 24, bottom: 24 }}>
                    <HelpOutlineIcon sx={{ color: '#1e1e2d', fontSize: 32, cursor: 'pointer' }} />
                </Box>
            </Box>
        </Box>
    );
}