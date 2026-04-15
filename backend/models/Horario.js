import mongoose from 'mongoose';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

const bloqueSchema = new mongoose.Schema({
    materia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Materia',
        required: true,
    },
    dia: {
        type: String,
        enum: DIAS,
        required: true,
    },
    horaInicio: {
        type: String, // "08:00"
        required: true,
    },
    horaFin: {
        type: String, // "10:00"
        required: true,
    },
    aula: {
        type: String,
        default: '',
        trim: true,
    },
}, { _id: true });

const horarioSchema = new mongoose.Schema({
    carrera: {
        type: String,
        required: true,
    },
    cuatrimestre: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
    grupo: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
        required: true,
    },
    // Un grupo solo puede tener UN horario activo por cuatrimestre
    bloques: [bloqueSchema],
    activo: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

// Índice único: solo un horario por grupo/carrera/cuatrimestre
horarioSchema.index({ carrera: 1, cuatrimestre: 1, grupo: 1 }, { unique: true });

const Horario = mongoose.model('Horario', horarioSchema);
export default Horario;