import User from './User.js';
import mongoose from 'mongoose';

export const AREAS_UTSH = [
    'DIRECCIÓN DE CIENCIAS ECONÓMICO ADMINISTRATIVAS',
    'DIRECCIÓN DE CIENCIAS NATURALES E INGENIERÍA',
    'DIRECCIÓN DE TECNOLOGÍAS DE LA INFORMACIÓN',
    'DIRECCIÓN DE CIENCIAS EXACTAS',
    'DIRECCIÓN DE CIENCIAS DE LA SALUD',
];

const studentSchema = new mongoose.Schema({
    carrera: {
        type: String,
        required: [true, 'La carrera es obligatoria'],
        enum: ['Tecnologías de la Información', 'Mecatrónica', 'Desarrollo de Negocios', 'Contaduría', 'Enfermería', 'Terapia Física', 'Diseño Textil', 'Recursos Naturales', 'Mantenimiento Industrial'],
    },
    area: {
        type: String,
        required: [true, 'El área es obligatoria'],
        enum: AREAS_UTSH,
        trim: true,
    },
    cuatrimestre: {
        type: Number,
        required: [true, 'El cuatrimestre es obligatorio'],
        min: [1, 'El cuatrimestre mínimo es 1'],
        max: [10, 'El cuatrimestre máximo en la UTSH es 10'],
    },
    grupo: {
        type: String,
        required: [true, 'El grupo es obligatorio'],
        enum: ['A', 'B', 'C', 'D'],
        uppercase: true,
    },
});

const Student = User.discriminator('STUDENT', studentSchema);
export default Student;