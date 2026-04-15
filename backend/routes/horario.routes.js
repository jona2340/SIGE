import { Router } from 'express';
import {
    getMateriasInscritas,
    getHorario,
    upsertHorario,
    deleteHorario,
    getHorarioDocente
} from '../controller/horario.controller.js';

const router = Router();

router.get('/materias-inscritas', getMateriasInscritas);
router.get('/', getHorario);
router.post('/', upsertHorario);
router.delete('/', deleteHorario);
router.get('/docente/:docenteId', getHorarioDocente);

export default router;