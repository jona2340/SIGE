import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Grid, MenuItem, Link as MuiLink
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { sigeStyles } from '../styles/sigeStyles';

export default function RegisterEstudent() {
  const [formData, setFormData] = useState({
    usuario_id: `EST-${Date.now()}`,
    email: '',
    password: '',
    matricula: '',
    nombre: '',
    apellidos: '',
    cuatrimestre_actual: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registro Estudiante Submit:', formData);
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
        {/* Agregamos overflow: 'hidden' para que la franja de color respete los bordes curvos de la tarjeta */}
        <Card sx={{ ...sigeStyles.authCard, maxWidth: 500, overflow: 'hidden' }}>
          
          {/* Franja de color estilo Header de Tarjeta (Como en tu imagen de referencia) */}
          <Box sx={{ bgcolor: '#00897b', py: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, letterSpacing: 1 }}>
              REGISTRO DE ESTUDIANTE
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
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Matrícula</Typography>
                  <TextField fullWidth name="matricula" value={formData.matricula} onChange={handleChange} sx={sigeStyles.inputField} required />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Cuatrimestre</Typography>
                  <TextField fullWidth select name="cuatrimestre_actual" value={formData.cuatrimestre_actual} onChange={handleChange} sx={sigeStyles.inputField} displayEmpty required>
                    <MenuItem value="" disabled>Selecciona...</MenuItem>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <MenuItem key={num} value={num}>{num}° Cuatrimestre</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Correo Electrónico</Typography>
                  <TextField fullWidth type="email" name="email" value={formData.email} onChange={handleChange} sx={sigeStyles.inputField} required />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Contraseña</Typography>
                  <TextField fullWidth type="password" name="password" value={formData.password} onChange={handleChange} sx={sigeStyles.inputField} required />
                </Grid>
              </Grid>

              {/* Botón a todo el ancho */}
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 4, ...sigeStyles.primaryButton }}>
                REGISTRAR AHORA
              </Button>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <MuiLink component={RouterLink} to="/login" underline="hover" sx={{ color: '#00897b', fontWeight: 500, fontSize: '0.875rem' }}>
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