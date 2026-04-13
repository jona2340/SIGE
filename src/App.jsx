import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './page/login';
import DashboardEstudiante from './page/dashboard.student';
import DashboardDocente from './page/dashboard.docent';
import DashboardAdmin from './page/dashboard.admin';

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" replace />} />


      <Route path="/login" element={<Login />} />

      <Route path="/dashboard/estudiante" element={<DashboardEstudiante />} />
      <Route path="/dashboard/docente" element={<DashboardDocente />} />
      <Route path="/dashboard/admin" element={<DashboardAdmin />} />

      <Route path="*" element={
        <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>404 - Página no encontrada</h2>
          <p>La ruta que buscas no existe en el sistema SIGE.</p>
        </div>
      } />
    </Routes>
  );
}