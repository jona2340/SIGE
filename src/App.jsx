import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './page/login';
import DashboardEstudiante from './page/dashboard.student';
import DashboardDocente from './page/dashboard.docent';
import DashboardAdmin from './page/dashboard.admin';
import ProtectedRoute from './components/common/ProtectedRoute';
import GestionUsuarios from './page/admin/GestionUsuarios';

export default function App() {
  return (
    <Routes>

      {/* Redirige la raíz al login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas — solo accesibles con token + rol correcto */}
      <Route
        path="/dashboard/estudiante"
        element={
          <ProtectedRoute allowedRol="STUDENT">
            <DashboardEstudiante />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/docente"
        element={
          <ProtectedRoute allowedRol="TEACHER">
            <DashboardDocente />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRol="ADMIN">
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/usuarios"
        element={
          <ProtectedRoute allowedRol="ADMIN">
            <GestionUsuarios />
          </ProtectedRoute>
        }
      />

      {/* Ruta 404 */}
      <Route path="*" element={
        <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>404 - Página no encontrada</h2>
          <p>La ruta que buscas no existe en el sistema SIGE.</p>
        </div>
      } />

    </Routes>
  );
}