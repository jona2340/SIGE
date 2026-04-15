// Una materia pertenece a una carrera y es impartida por un docente.
// Los alumnos se inscriben a materias a través del modelo Inscripcion.
import mongoose from 'mongoose';

const materiaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la materia es obligatorio'],
        trim: true,
    },
    codigo: {
        type: String,
        required: [true, 'El código es obligatorio'],
        unique: true,
        uppercase: true,
        trim: true,
    },
    carrera: {
        type: String,
        required: [true, 'La carrera es obligatoria'],
    },
    cuatrimestre: {
        type: Number,
        required: true,
        min: 1,
        max: 12,
    },
    // Referencia al docente que imparte la materia
    docente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El docente es obligatorio'],
    },
    horasSemanales: {
        type: Number,
        default: 4,
    },
    activa: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Materia = mongoose.model('Materia', materiaSchema);
export default Materia;