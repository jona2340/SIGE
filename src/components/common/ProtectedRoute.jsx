import { Navigate } from 'react-router-dom';

/**
 * Guarda las rutas privadas.
 * Si no hay token → redirige al login.
 * Si el rol no coincide → redirige al login.
 */
export default function ProtectedRoute({ children, allowedRol }) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRol && user.rol !== allowedRol) {
        return <Navigate to="/login" replace />;
    }

    return children;
}