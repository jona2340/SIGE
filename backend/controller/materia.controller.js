import Materia from '../models/Materia.js';
import Inscripcion from '../models/Inscripcion.js';
import User from '../models/User.js';

// ── POST /api/materias — Crear materia
export const createMateria = async (req, res) => {
    try {
        const materia = await Materia.create(req.body);
        const populated = await materia.populate('docente', 'nombre email especialidad');
        return res.status(201).json({ success: true, data: populated });
    } catch (error) {
        if (error.code === 11000)
            return res.status(409).json({ success: false, message: 'Ya existe una materia con ese código.' });
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(422).json({ success: false, message: messages.join(' | ') });
        }
        return res.status(500).json({ success: false, message: 'Error al crear la materia.' });
    }
};

// ── GET /api/materias — Listar con filtros opcionales
export const getMaterias = async (req, res) => {
    try {
        const { carrera, cuatrimestre, docente } = req.query;
        const filter = {};
        if (carrera) filter.carrera = carrera;
        if (cuatrimestre) filter.cuatrimestre = Number(cuatrimestre);
        if (docente) filter.docente = docente;

        const materias = await Materia.find(filter)
            .populate('docente', 'nombre email departamento especialidad')
            .sort({ carrera: 1, cuatrimestre: 1, nombre: 1 });

        return res.status(200).json({ success: true, data: materias });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al obtener materias.' });
    }
};

// ── GET /api/materias/docentes — Todos los docentes
export const getDocentesPorCarrera = async (req, res) => {
    try {
        const docentes = await User.find({ rol: 'TEACHER' }, 'nombre email departamento especialidad matricula');
        return res.status(200).json({ success: true, data: docentes });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al obtener docentes.' });
    }
};

// ── POST /api/materias/inscribir-grupo
// Inscribe a TODOS los alumnos que coincidan con carrera + cuatrimestre (+ grupo opcional)
// en UNA materia. Ignora duplicados (ya inscritos).
export const inscribirGrupo = async (req, res) => {
    try {
        const { materiaId, carrera, cuatrimestre, grupo } = req.body;

        if (!materiaId || !carrera || !cuatrimestre) {
            return res.status(400).json({
                success: false,
                message: 'materiaId, carrera y cuatrimestre son requeridos.',
            });
        }

        // Verificar que la materia exista
        const materia = await Materia.findById(materiaId);
        if (!materia) {
            return res.status(404).json({ success: false, message: 'Materia no encontrada.' });
        }

        // Construir filtro de alumnos
        const filtroAlumnos = {
            rol: 'STUDENT',
            carrera,
            cuatrimestre: Number(cuatrimestre),
        };
        if (grupo) filtroAlumnos.grupo = grupo;

        const alumnos = await User.find(filtroAlumnos, '_id nombre matricula');

        if (alumnos.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron alumnos con los criterios indicados.',
            });
        }

        // Insertar inscripciones ignorando duplicados (ordered: false)
        const docs = alumnos.map(a => ({ alumno: a._id, materia: materiaId }));

        let insertados = 0;
        let duplicados = 0;

        const results = await Promise.allSettled(
            docs.map(d => Inscripcion.create(d))
        );

        results.forEach(r => {
            if (r.status === 'fulfilled') insertados++;
            else duplicados++;
        });

        return res.status(201).json({
            success: true,
            message: `${insertados} alumno(s) inscritos correctamente. ${duplicados} ya estaban inscritos.`,
            data: { insertados, duplicados, total: alumnos.length },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error al inscribir grupo.' });
    }
};

// ── POST /api/materias/inscribir — Inscribir alumno individual
export const inscribirAlumno = async (req, res) => {
    try {
        const { alumnoId, materiaId } = req.body;
        const [alumno, materia] = await Promise.all([
            User.findById(alumnoId),
            Materia.findById(materiaId),
        ]);
        if (!alumno || alumno.rol !== 'STUDENT')
            return res.status(404).json({ success: false, message: 'Alumno no encontrado.' });
        if (!materia)
            return res.status(404).json({ success: false, message: 'Materia no encontrada.' });

        const inscripcion = await Inscripcion.create({ alumno: alumnoId, materia: materiaId });
        await inscripcion.populate([
            { path: 'alumno', select: 'nombre matricula' },
            { path: 'materia', select: 'nombre codigo' },
        ]);
        return res.status(201).json({ success: true, data: inscripcion });
    } catch (error) {
        if (error.code === 11000)
            return res.status(409).json({ success: false, message: 'El alumno ya está inscrito en esta materia.' });
        return res.status(500).json({ success: false, message: 'Error al inscribir alumno.' });
    }
};

// ── GET /api/materias/alumno/:alumnoId
export const getMateriasDeAlumno = async (req, res) => {
    try {
        const inscripciones = await Inscripcion.find({ alumno: req.params.alumnoId })
            .populate({ path: 'materia', populate: { path: 'docente', select: 'nombre' } });
        return res.status(200).json({ success: true, data: inscripciones });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al obtener materias del alumno.' });
    }
};

// ── DELETE /api/materias/inscripcion/:id
export const eliminarInscripcion = async (req, res) => {
    try {
        await Inscripcion.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, message: 'Inscripción eliminada.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al eliminar inscripción.' });
    }
};

// ── DELETE /api/materias/:id
export const deleteMateria = async (req, res) => {
    try {
        await Materia.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, message: 'Materia eliminada.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al eliminar materia.' });
    }
};

// ── GET /api/materias/:materiaId/inscripciones
// Obtiene todos los alumnos inscritos en una materia específica
export const getInscripcionesPorMateria = async (req, res) => {
    try {
        const { materiaId } = req.params;

        // Buscamos todas las inscripciones de esta materia
        const inscripciones = await Inscripcion.find({ materia: materiaId })
            // Hacemos populate para traer los datos reales del alumno
            .populate({
                path: 'alumno',
                select: 'nombre email matricula fotoPerfil rol'
            })
            // Opcional: también traemos los datos de la materia
            .populate({
                path: 'materia',
                select: 'nombre codigo cuatrimestre carrera'
            });

        // Retornamos exactamente la estructura que espera el Frontend: { success: true, data: [...] }
        return res.status(200).json({ success: true, data: inscripciones });
    } catch (error) {
        console.error("Error al obtener inscripciones de la materia:", error);
        return res.status(500).json({ success: false, message: 'Error al obtener los alumnos de la materia.' });
    }
};

// ── PATCH /api/materias/inscripcion/:inscripcionId/calificacion
// Actualiza la calificación de un alumno en una materia
export const actualizarCalificacion = async (req, res) => {
    try {
        const { inscripcionId } = req.params;
        const { calificacion } = req.body;

        // Validación básica
        if (calificacion < 0 || calificacion > 10) {
            return res.status(400).json({ success: false, message: 'La calificación debe estar entre 0 y 10.' });
        }

        // Actualizamos la inscripción
        const inscripcionActualizada = await Inscripcion.findByIdAndUpdate(
            inscripcionId,
            { calificacion: calificacion },
            { new: true } // Para que nos devuelva el documento ya actualizado
        );

        if (!inscripcionActualizada) {
            return res.status(404).json({ success: false, message: 'Inscripción no encontrada.' });
        }

        return res.status(200).json({ success: true, data: inscripcionActualizada });
    } catch (error) {
        console.error("Error al actualizar calificación:", error);
        return res.status(500).json({ success: false, message: 'Error al actualizar la calificación.' });
    }
};