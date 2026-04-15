// Relaciona un alumno con una materia (muchos a muchos).
// Permite llevar calificación y asistencia por materia.
import mongoose from 'mongoose';

const inscripcionSchema = new mongoose.Schema({
    alumno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    materia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Materia',
        required: true,
    },
    calificacion: {
        type: Number,
        min: 0,
        max: 10,
        default: null,
    },
    estado: {
        type: String,
        enum: ['ACTIVA', 'APROBADA', 'REPROBADA', 'BAJA'],
        default: 'ACTIVA',
    },
}, { timestamps: true });

// Un alumno no puede estar inscrito dos veces en la misma materia
inscripcionSchema.index({ alumno: 1, materia: 1 }, { unique: true });

const Inscripcion = mongoose.model('Inscripcion', inscripcionSchema);
export default Inscripcion;