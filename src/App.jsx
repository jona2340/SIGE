import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './page/login';
import DashboardEstudiante from './page/dashboard.student';
import MisMaterias from './page/stundent/MisMaterias';
import DashboardDocente from './page/dashboard.docent';
import DashboardAdmin from './page/dashboard.admin';
import ProtectedRoute from './components/common/ProtectedRoute';
import GestionUsuarios from './page/admin/GestionUsuarios';
import GestionMaterias from './page/admin/GestionMaterias';
import AlumnosMateria from './page/docent/Alumnosmateria ';
import ReportePromedio from './page/stundent/ReportePromedio';
import MateriasDocente from './page/docent/MateriasDocente';
import GestionHorarios from './page/admin/GestionHorarios';
import HorarioEstudiante from './page/stundent/Horarioestudiante ';
import HorarioDocente from './page/docent/Horariodocente';
export default function App() {
  return (
    <Routes>
      {/* Redirige la raíz al login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* ==========================================
          RUTAS DE ESTUDIANTE
      ========================================== */}
      <Route path="/dashboard/estudiante" element={<ProtectedRoute allowedRol="STUDENT"><DashboardEstudiante /></ProtectedRoute>} />
      <Route path="/estudiante/materias" element={<ProtectedRoute allowedRol="STUDENT"><MisMaterias /></ProtectedRoute>} />
      <Route path="/estudiante/reporte" element={<ReportePromedio />} />
      <Route path="/estudiante/horario" element={<HorarioEstudiante />} />

      {/* ==========================================
          RUTAS DE DOCENTE
      ========================================== */}
      <Route path="/dashboard/docente" element={<ProtectedRoute allowedRol="TEACHER"><DashboardDocente /></ProtectedRoute>} />
      <Route path="/docente/clases" element={<ProtectedRoute allowedRol="TEACHER"><MateriasDocente /></ProtectedRoute>} />
      <Route path="/docente/horario" element={<ProtectedRoute allowedRol="TEACHER"><HorarioDocente /></ProtectedRoute>} />

      {/* ==========================================
          RUTAS DE ADMINISTRADOR
      ========================================== */}
      <Route path="/dashboard/admin" element={<ProtectedRoute allowedRol="ADMIN"><DashboardAdmin /></ProtectedRoute>} />
      <Route path="/admin/usuarios" element={<ProtectedRoute allowedRol="ADMIN"><GestionUsuarios /></ProtectedRoute>} />
      <Route path="/admin/materias" element={<ProtectedRoute allowedRol="ADMIN"><GestionMaterias /></ProtectedRoute>} />
      <Route path="/docente/materia/:materiaId/alumnos" element={<AlumnosMateria />} />
      <Route path="/admin/horarios" element={<ProtectedRoute allowedRol="ADMIN"> <GestionHorarios /> </ProtectedRoute>} />
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