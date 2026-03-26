import React, { useState } from 'react';
import {
    Box, Card, CardContent, Typography, TextField, Button, Grid, Link as MuiLink
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { sigeStyles } from '../styles/sigeStyles';

export default function RegisterDocent() {
    const [formData, setFormData] = useState({
        usuario_id: `DOC-${Date.now()}`,
        email: '',
        password: '',
        numero_empleado: '',
        nombre: '',
        apellidos: '',
        departamento_o_academia: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Registro Docente Submit:', formData);
    };

    return (
        <Box sx={sigeStyles.pageContainer}>
            {/* Header General */}
            <Box sx={sigeStyles.header}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <SchoolIcon sx={{ fontSize: 40 }} />
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                            Universidad Tecnológica de la Sierra Hidalguense
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>SIGE</Typography>
            </Box>

            {/* Main Content */}
            <Box sx={sigeStyles.mainContent}>
                <Card sx={{ ...sigeStyles.authCard, maxWidth: 500, overflow: 'hidden' }}>

                    {/* Franja de color estilo Header de Tarjeta (Usamos un tono oscuro para diferenciar del alumno) */}
                    <Box sx={{ bgcolor: '#1e1e2d', py: 2, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, letterSpacing: 1 }}>
                            REGISTRO DE DOCENTE
                        </Typography>
                    </Box>

                    <CardContent sx={{ p: 4 }}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {/* Fila 1: 2 Columnas */}
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Nombre(s)</Typography>
                                    <TextField fullWidth name="nombre" value={formData.nombre} onChange={handleChange} sx={sigeStyles.inputField} required />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Apellidos</Typography>
                                    <TextField fullWidth name="apellidos" value={formData.apellidos} onChange={handleChange} sx={sigeStyles.inputField} required />
                                </Grid>

                                {/* Filas 2 en adelante: 1 Columna (Ancho completo) */}
                                <Grid item xs={12}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>No. de Empleado</Typography>
                                    <TextField fullWidth name="numero_empleado" value={formData.numero_empleado} onChange={handleChange} sx={sigeStyles.inputField} required />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Academia / Departamento</Typography>
                                    <TextField fullWidth name="departamento_o_academia" value={formData.departamento_o_academia} onChange={handleChange} sx={sigeStyles.inputField} required />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Correo Institucional</Typography>
                                    <TextField fullWidth type="email" name="email" value={formData.email} onChange={handleChange} sx={sigeStyles.inputField} required />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Contraseña</Typography>
                                    <TextField fullWidth type="password" name="password" value={formData.password} onChange={handleChange} sx={sigeStyles.inputField} required />
                                </Grid>
                            </Grid>

                            {/* Botón a todo el ancho */}
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 4, ...sigeStyles.darkButton }}>
                                REGISTRAR AHORA
                            </Button>

                            <Box sx={{ textAlign: 'center', mt: 3 }}>
                                <MuiLink component={RouterLink} to="/login" underline="hover" sx={{ color: '#1e1e2d', fontWeight: 500, fontSize: '0.875rem' }}>
                                    ¿Ya tienes cuenta? Inicia sesión aquí
                                </MuiLink>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            </Box>

            {/* Footer */}
            <Box sx={{ py: 3, textAlign: 'center', color: 'text.secondary', position: 'relative' }}>
                <Typography variant="body2">Universidad Tecnológica de la Sierra Hidalguense</Typography>
                <Box sx={{ position: 'absolute', right: 24, bottom: 24 }}>
                    <HelpOutlineIcon sx={{ color: '#1e1e2d', fontSize: 32, cursor: 'pointer' }} />
                </Box>
            </Box>
        </Box>
    );
}