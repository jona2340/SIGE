import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Importación de las vistas
import Login from './page/login';
import RegisterEstudent from './page/register.student';
import RegisterDocent from './page/register.docent';

export default function App() {
  return (
    <Routes>
      {/* Redirección por defecto al Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rutas principales */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro/estudiante" element={<RegisterEstudent />} />
      <Route path="/registro/docente" element={<RegisterDocent />} />

      {/* Ruta para capturar errores 404 (Página no encontrada) */}
      <Route path="*" element={
        <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>404 - Página no encontrada</h2>
          <p>La ruta que buscas no existe en el SIGE.</p>
        </div>
      } />
    </Routes>
  );
}