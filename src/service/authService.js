const BASE_URL = '/api/users';

export async function loginUser(matricula, password, rol) {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula, password, rol }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al iniciar sesión');
    return data;
}

export function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

export function getStoredUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
}

export function getToken() {
    return localStorage.getItem('token');
}