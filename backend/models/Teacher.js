import User from './User.js';
import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
    departamento: {
        type: String,
        required: [true, 'El departamento es obligatorio'],
        // Departamentos académicos de la UTSH
        enum: ['Ciencias Exactas y Básicas', 'Económico-Administrativa', 'Tecnologías de la Información', 'Mecánica y Manufactura', 'Ciencias de la Salud', 'Diseño y Arte','Desarrollo de Negocios', 'Mecatrónica','Idiomas'],
    },
    especialidad: {
        type: String,
        required: [true, 'La especialidad es obligatoria'],
        // Especialidades de los docentes
        enum: ['Desarrollo de Software Multiplataforma', 'Infraestructura de Redes Digitales', 'Automatización', 'Finanzas', 'Mercadotecnia', 'Salud Pública', 'Rehabilitación', 'Confección Textil', 'Estrategias de Marketing', 'Sistemas Embebidos', 'Inglés Técnico'],
    },
});

const Teacher = User.discriminator('TEACHER', teacherSchema);
export default Teacher;