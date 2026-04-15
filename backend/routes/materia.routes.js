import { Router } from 'express';
import {
    createMateria, getMaterias, getDocentesPorCarrera,
    inscribirGrupo, inscribirAlumno,
    getMateriasDeAlumno, eliminarInscripcion, deleteMateria,
    getInscripcionesPorMateria, actualizarCalificacion
} from '../controller/materia.controller.js';

const router = Router();

router.get('/', getMaterias);
router.get('/docentes', getDocentesPorCarrera);
router.get('/alumno/:alumnoId', getMateriasDeAlumno);
router.post('/', createMateria);
router.post('/inscribir-grupo', inscribirGrupo);   // ← nueva
router.post('/inscribir', inscribirAlumno);
router.delete('/inscripcion/:id', eliminarInscripcion);
router.delete('/:id', deleteMateria);
router.get('/:materiaId/inscripciones', getInscripcionesPorMateria);
router.patch('/inscripcion/:inscripcionId/calificacion', actualizarCalificacion);
export default router;