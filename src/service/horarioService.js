function authHeaders() {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
}

const BASE = '/api/horarios';

export const getMateriasInscritas = (carrera, cuatrimestre, grupo) =>
    fetch(`${BASE}/materias-inscritas?carrera=${encodeURIComponent(carrera)}&cuatrimestre=${cuatrimestre}&grupo=${grupo}`, { headers: authHeaders() }).then(r => r.json());

export const getHorario = (carrera, cuatrimestre, grupo) =>
    fetch(`${BASE}?carrera=${encodeURIComponent(carrera)}&cuatrimestre=${cuatrimestre}&grupo=${grupo}`, { headers: authHeaders() }).then(r => r.json());

export const upsertHorario = (data) =>
    fetch(`${BASE}`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json());

export const deleteHorario = (carrera, cuatrimestre, grupo) =>
    fetch(`${BASE}?carrera=${encodeURIComponent(carrera)}&cuatrimestre=${cuatrimestre}&grupo=${grupo}`, { method: 'DELETE', headers: authHeaders() }).then(r => r.json());

export const getHorarioDocente = (docenteId) =>
    fetch(`${BASE}/docente/${docenteId}`, { headers: authHeaders() }).then(r => r.json());