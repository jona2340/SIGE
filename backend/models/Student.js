import User from './User.js';
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    carrera: {
        type: String,
        required: [true, 'La carrera es obligatoria'],
        // Carreras representativas de la UTSH
        enum: ['Tecnologías de la Información', 'Mecatrónica', 'Desarrollo de Negocios', 'Contaduría', 'Enfermería', 'Terapia Física', 'Diseño Textil', 'Recursos Naturales', 'Mantenimiento Industrial'],
    },
    area: {
        type: String,
        required: [true, 'El área es obligatoria'],
        trim: true,
    },
    cuatrimestre: {
        type: Number,
        required: [true, 'El cuatrimestre es obligatorio'],
        min: [1, 'El cuatrimestre mínimo es 1'],
        max: [10, 'El cuatrimestre máximo en la UTSH es 10'], // Actualizado a 10
    },
    grupo: {
        type: String,
        required: [true, 'El grupo es obligatorio'],
        enum: ['A', 'B', 'C', 'D'], // Restringido de la A a la D
        uppercase: true,
    },
});

const Student = User.discriminator('STUDENT', studentSchema);
export default Student;