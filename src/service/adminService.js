const BASE_URL = '/api/users';

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
}

export async function getAllUsers() {
    const response = await fetch(`${BASE_URL}/all`, { headers: authHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener usuarios');
    return data;
}

export async function registerUser(userData) {
    const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al registrar usuario');
    return data;
}

export async function deleteUser(userId) {
    const response = await fetch(`${BASE_URL}/${userId}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al eliminar usuario');
    return data;
}