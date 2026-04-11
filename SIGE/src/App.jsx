import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './page/login';
import RegisterEstudent from './page/register.student';
import RegisterDocent from './page/register.docent';
import DashboardEstudiante from './page/dashboard.student';
import DashboardDocente from './page/dashboard.docent';

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" replace />} />


      <Route path="/login" element={<Login />} />
      <Route path="/registro/estudiante" element={<RegisterEstudent />} />
      <Route path="/registro/docente" element={<RegisterDocent />} />

      <Route path="/dashboard/estudiante" element={<DashboardEstudiante />} />
      <Route path="/dashboard/docente" element={<DashboardDocente />} />

      <Route path="*" element={
        <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>404 - Página no encontrada</h2>
          <p>La ruta que buscas no existe en el sistema SIGE.</p>
        </div>
      } />
    </Routes>
  );
}