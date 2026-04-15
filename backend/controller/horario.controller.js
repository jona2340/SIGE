import Horario from '../models/Horario.js';
import Inscripcion from '../models/Inscripcion.js';
import User from '../models/User.js';
import Materia from '../models/Materia.js';

// ── GET /api/horarios/materias-inscritas
// Devuelve las materias únicas inscritas por al menos un alumno
// del grupo indicado — para poblar el selector del constructor.
export const getMateriasInscritas = async (req, res) => {
    try {
        const { carrera, cuatrimestre, grupo } = req.query;

        if (!carrera || !cuatrimestre || !grupo) {
            return res.status(400).json({ success: false, message: 'carrera, cuatrimestre y grupo son requeridos.' });
        }

        // 1. Encontrar alumnos del grupo
        const alumnos = await User.find({
            rol: 'STUDENT',
            carrera,
            cuatrimestre: Number(cuatrimestre),
            grupo,
        }, '_id');

        if (alumnos.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        const alumnoIds = alumnos.map(a => a._id);

        // 2. Inscripciones activas de esos alumnos
        const inscripciones = await Inscripcion.find({
            alumno: { $in: alumnoIds },
            estado: { $in: ['ACTIVA', 'APROBADA'] },
        }).populate({
            path: 'materia',
            populate: { path: 'docente', select: 'nombre' },
        });

        // 3. Deduplicar materias
        const materiasMap = new Map();
        inscripciones.forEach(i => {
            if (i.materia && !materiasMap.has(String(i.materia._id))) {
                materiasMap.set(String(i.materia._id), i.materia);
            }
        });

        return res.status(200).json({ success: true, data: Array.from(materiasMap.values()) });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error al obtener materias inscritas.' });
    }
};

// ── GET /api/horarios — Obtener horario de un grupo
export const getHorario = async (req, res) => {
    try {
        const { carrera, cuatrimestre, grupo } = req.query;
        const filter = {};
        if (carrera) filter.carrera = carrera;
        if (cuatrimestre) filter.cuatrimestre = Number(cuatrimestre);
        if (grupo) filter.grupo = grupo;

        const horario = await Horario.findOne(filter)
            .populate({ path: 'bloques.materia', populate: { path: 'docente', select: 'nombre' } });

        return res.status(200).json({ success: true, data: horario || null });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al obtener horario.' });
    }
};

// ── POST /api/horarios — Crear o reemplazar horario completo
export const upsertHorario = async (req, res) => {
    try {
        const { carrera, cuatrimestre, grupo, bloques } = req.body;

        if (!carrera || !cuatrimestre || !grupo) {
            return res.status(400).json({ success: false, message: 'carrera, cuatrimestre y grupo son requeridos.' });
        }

        // Validar conflictos dentro del mismo horario
        // (mismo día y solapamiento de horas)
        for (let i = 0; i < bloques.length; i++) {
            for (let j = i + 1; j < bloques.length; j++) {
                const a = bloques[i];
                const b = bloques[j];
                if (a.dia === b.dia) {
                    const aIni = timeToMin(a.horaInicio), aFin = timeToMin(a.horaFin);
                    const bIni = timeToMin(b.horaInicio), bFin = timeToMin(b.horaFin);
                    if (aIni < bFin && bIni < aFin) {
                        return res.status(422).json({
                            success: false,
                            message: `Conflicto de horario el ${a.dia} entre ${a.horaInicio}-${a.horaFin} y ${b.horaInicio}-${b.horaFin}`,
                        });
                    }
                }
            }
        }

        const horario = await Horario.findOneAndUpdate(
            { carrera, cuatrimestre: Number(cuatrimestre), grupo },
            { carrera, cuatrimestre: Number(cuatrimestre), grupo, bloques, activo: true },
            { upsert: true, new: true, runValidators: true }
        ).populate({ path: 'bloques.materia', populate: { path: 'docente', select: 'nombre' } });

        return res.status(200).json({ success: true, data: horario, message: 'Horario guardado correctamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error al guardar horario.' });
    }
};

// ── DELETE /api/horarios — Eliminar horario de un grupo
export const deleteHorario = async (req, res) => {
    try {
        const { carrera, cuatrimestre, grupo } = req.query;
        await Horario.findOneAndDelete({ carrera, cuatrimestre: Number(cuatrimestre), grupo });
        return res.status(200).json({ success: true, message: 'Horario eliminado.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al eliminar horario.' });
    }
};
// Obtiene exclusivamente los bloques de clase que imparte un docente específico
export const getHorarioDocente = async (req, res) => {
    try {
        const { docenteId } = req.params;

        // 1. Encontrar qué materias imparte este docente
        const materias = await Materia.find({ docente: docenteId });
        const materiaIds = materias.map(m => m._id);

        if (materiaIds.length === 0) {
            // El docente no tiene materias asignadas, devolvemos un arreglo vacío
            return res.status(200).json({ success: true, data: [] });
        }

        // 2. Buscar todos los horarios de todos los grupos que contengan alguna de esas materias
        const horarios = await Horario.find({ 'bloques.materia': { $in: materiaIds } })
            .populate({
                path: 'bloques.materia',
                select: 'nombre codigo carrera'
            });

        // 3. Extraer SOLO los bloques (clases) que le tocan a este docente
        let bloquesDocente = [];

        horarios.forEach(horario => {
            horario.bloques.forEach(bloque => {
                // Verificamos si la materia de este bloque es una de las del docente
                const esDelDocente = materiaIds.some(
                    id => id.toString() === (bloque.materia._id || bloque.materia).toString()
                );

                if (esDelDocente) {
                    // Convertimos a objeto plano para inyectar datos del grupo
                    const bloqueSuelto = bloque.toObject ? bloque.toObject() : bloque;

                    // Le inyectamos la información del grupo para que el Frontend la muestre
                    bloqueSuelto.carrera = horario.carrera;
                    bloqueSuelto.cuatrimestre = horario.cuatrimestre;
                    bloqueSuelto.grupo = horario.grupo;

                    bloquesDocente.push(bloqueSuelto);
                }
            });
        });

        return res.status(200).json({ success: true, data: bloquesDocente });
    } catch (error) {
        console.error("Error al obtener horario del docente:", error);
        return res.status(500).json({ success: false, message: 'Error al obtener horario del docente.' });
    }
};
// Utilidad: convierte "08:30" → 510 (minutos)
function timeToMin(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
}