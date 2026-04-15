function authHeaders() {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
}

const BASE = '/api/materias';

export const getMaterias = (params = {}) => fetch(`${BASE}?${new URLSearchParams(params)}`, { headers: authHeaders() }).then(r => r.json());
export const getDocentes = () => fetch(`${BASE}/docentes`, { headers: authHeaders() }).then(r => r.json());
export const createMateria = (data) => fetch(`${BASE}`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json());
export const deleteMateria = (id) => fetch(`${BASE}/${id}`, { method: 'DELETE', headers: authHeaders() }).then(r => r.json());
export const getMateriasDeAlumno = (alumnoId) => fetch(`${BASE}/alumno/${alumnoId}`, { headers: authHeaders() }).then(r => r.json());
export const inscribirAlumno = (data) => fetch(`${BASE}/inscribir`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json());
export const eliminarInscripcion = (id) => fetch(`${BASE}/inscripcion/${id}`, { method: 'DELETE', headers: authHeaders() }).then(r => r.json());
export const inscribirGrupo = (data) => fetch(`${BASE}/inscribir-grupo`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json());

/**
 * Obtiene los alumnos inscritos en una materia específica.
 * El backend debe hacer populate de 'alumno' y devolver los datos del usuario.
 * Ruta esperada: GET /api/materias/:materiaId/inscripciones
 */
export const getAlumnosDeMateria = (materiaId) =>
    fetch(`${BASE}/${materiaId}/inscripciones`, { headers: authHeaders() }).then(r => r.json());

/**
 * Actualiza la calificación de una inscripción específica.
 * Ruta esperada: PATCH /api/materias/inscripcion/:inscripcionId/calificacion
 * Body: { calificacion: Number (0–10) }
 */
export const actualizarCalificacion = (inscripcionId, calificacion) =>
    fetch(`${BASE}/inscripcion/${inscripcionId}/calificacion`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ calificacion }),
    }).then(r => r.json());