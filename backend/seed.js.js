// Script para poblar la base de datos con usuarios de prueba.
// Ejecutar UNA sola vez con: node seed.js
// Después puedes borrarlo o guardarlo para resets futuros.

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Importamos los modelos discriminator
import Student from './models/Student.js';
import Teacher from './models/Teacher.js';
import Admin from './models/Admin.js';
import User from './models/User.js';

const usuarios = [
    // =========================
    // 🎓 ESTUDIANTES
    // =========================
    {
        Model: Student,
        data: {
            nombre: 'Ricardo Ruiz López',
            email: 'ricardo@utsh.edu.mx',
            matricula: '2024-001',
            rol: 'STUDENT',
            carrera: 'Tecnologías de la Información',
            area: 'Desarrollo de Software',
            cuatrimestre: 5,
            grupo: 'A',
            fotoPerfil: 'https://ui-avatars.com/api/?name=Ricardo+Ruiz&background=0D8ABC&color=fff',
        },
        password: 'alumno123',
    },
    {
        Model: Student,
        data: {
            nombre: 'Ana Martínez Pérez',
            email: 'ana@utsh.edu.mx',
            matricula: '2024-002',
            rol: 'STUDENT',
            carrera: 'Mecatrónica',
            area: 'Automatización',
            cuatrimestre: 3,
            grupo: 'B',
            fotoPerfil: 'https://randomuser.me/api/portraits/women/44.jpg',
        },
        password: 'alumno123',
    },
    {
        Model: Student,
        data: {
            nombre: 'Luis Fernando Gómez',
            email: 'luis.gomez@utsh.edu.mx',
            matricula: '2024-003',
            rol: 'STUDENT',
            carrera: 'Tecnologías de la Información',
            area: 'Infraestructura de Redes',
            cuatrimestre: 8,
            grupo: 'A',
            fotoPerfil: 'https://randomuser.me/api/portraits/men/32.jpg',
        },
        password: 'alumno123',
    },
    {
        Model: Student,
        data: {
            nombre: 'Sofía Castro Reyes',
            email: 'sofia.castro@utsh.edu.mx',
            matricula: '2024-004',
            rol: 'STUDENT',
            carrera: 'Desarrollo de Negocios',
            area: 'Mercadotecnia',
            cuatrimestre: 2,
            grupo: 'C',
            fotoPerfil: 'https://ui-avatars.com/api/?name=Sofia+Castro&background=F59E0B&color=fff',
        },
        password: 'alumno123',
    },
    {
        Model: Student,
        data: {
            nombre: 'Diego Alejandro Vargas',
            email: 'diego.vargas@utsh.edu.mx',
            matricula: '2024-005',
            rol: 'STUDENT',
            carrera: 'Mantenimiento Industrial',
            area: 'Instalaciones',
            cuatrimestre: 5,
            grupo: 'B',
            fotoPerfil: 'https://randomuser.me/api/portraits/men/65.jpg',
        },
        password: 'alumno123',
    },
    {
        Model: Student,
        data: {
            nombre: 'Valeria Rojas',
            email: 'valeria.rojas@utsh.edu.mx',
            matricula: '2024-006',
            rol: 'STUDENT',
            carrera: 'Tecnologías de la Información',
            area: 'Desarrollo de Software',
            cuatrimestre: 5,
            grupo: 'A',
            fotoPerfil: 'https://randomuser.me/api/portraits/women/68.jpg',
        },
        password: 'alumno123',
    },
    {
        Model: Student,
        data: {
            nombre: 'Javier Domínguez',
            email: 'javier.dom@utsh.edu.mx',
            matricula: '2024-007',
            rol: 'STUDENT',
            carrera: 'Contaduría',
            area: 'Finanzas',
            cuatrimestre: 7,
            grupo: 'A',
            fotoPerfil: 'https://ui-avatars.com/api/?name=Javier+Dominguez&background=10B981&color=fff',
        },
        password: 'alumno123',
    },

    // =========================
    // 👨‍🏫 DOCENTES
    // =========================
    {
        Model: Teacher,
        data: {
            nombre: 'Dra. Elena Solís Mora',
            email: 'esolis@utsh.edu.mx',
            matricula: 'D-045',
            rol: 'TEACHER',
            departamento: 'Ciencias Exactas y Básicas',
            especialidad: 'Desarrollo de Software Multiplataforma',
            fotoPerfil: 'https://randomuser.me/api/portraits/women/22.jpg',
        },
        password: 'docente123',
    },
    {
        Model: Teacher,
        data: {
            nombre: 'Ing. Carlos Hernández',
            email: 'carlos@utsh.edu.mx',
            matricula: 'D-046',
            rol: 'TEACHER',
            departamento: 'Tecnologías de la Información',
            especialidad: 'Infraestructura de Redes Digitales',
            fotoPerfil: 'https://randomuser.me/api/portraits/men/46.jpg',
        },
        password: 'docente123',
    },
    {
        Model: Teacher,
        data: {
            nombre: 'Mtra. Patricia Mendoza',
            email: 'pmendoza@utsh.edu.mx',
            matricula: 'D-047',
            rol: 'TEACHER',
            departamento: 'Desarrollo de Negocios',
            especialidad: 'Estrategias de Marketing',
            fotoPerfil: 'https://ui-avatars.com/api/?name=Patricia+Mendoza&background=8B5CF6&color=fff',
        },
        password: 'docente123',
    },
    {
        Model: Teacher,
        data: {
            nombre: 'Ing. Roberto Fuentes',
            email: 'rfuentes@utsh.edu.mx',
            matricula: 'D-048',
            rol: 'TEACHER',
            departamento: 'Mecatrónica',
            especialidad: 'Sistemas Embebidos',
            fotoPerfil: 'https://randomuser.me/api/portraits/men/29.jpg',
        },
        password: 'docente123',
    },
    {
        Model: Teacher,
        data: {
            nombre: 'Lic. Laura Medina',
            email: 'lmedina@utsh.edu.mx',
            matricula: 'D-049',
            rol: 'TEACHER',
            departamento: 'Idiomas',
            especialidad: 'Inglés Técnico',
            fotoPerfil: 'https://randomuser.me/api/portraits/women/12.jpg',
        },
        password: 'docente123',
    },

    // =========================
    // 🛠 ADMINISTRADORES
    // =========================
    {
        Model: Admin,
        data: {
            nombre: 'Coordinador Martínez',
            email: 'admin@utsh.edu.mx',
            matricula: 'ADM-001',
            rol: 'ADMIN',
            nivelAcceso: 3,
            fotoPerfil: 'https://ui-avatars.com/api/?name=Admin+Martinez&background=EF4444&color=fff',
        },
        password: 'admin123',
    },
    {
        Model: Admin,
        data: {
            nombre: 'Soporte Técnico',
            email: 'soporte@utsh.edu.mx',
            matricula: 'ADM-002',
            rol: 'ADMIN',
            nivelAcceso: 2,
            fotoPerfil: 'https://ui-avatars.com/api/?name=Soporte+Tecnico&background=3B82F6&color=fff',
        },
        password: 'admin123',
    },
    {
        Model: Admin,
        data: {
            nombre: 'Dirección Académica',
            email: 'direccion@utsh.edu.mx',
            matricula: 'ADM-003',
            rol: 'ADMIN',
            nivelAcceso: 3,
            fotoPerfil: 'https://ui-avatars.com/api/?name=Direccion+Academica&background=111827&color=fff',
        },
        password: 'admin123',
    },
    {
        Model: Admin,
        data: {
            nombre: 'Control Escolar',
            email: 'controlescolar@utsh.edu.mx',
            matricula: 'ADM-004',
            rol: 'ADMIN',
            nivelAcceso: 1,
            fotoPerfil: 'https://randomuser.me/api/portraits/women/50.jpg',
        },
        password: 'admin123',
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        // Limpiamos usuarios existentes para evitar duplicados
        await User.deleteMany({});
        console.log('🗑  Colección users limpiada');

        for (const usuario of usuarios) {
            const hashedPassword = await bcrypt.hash(usuario.password, 12);
            await usuario.Model.create({
                ...usuario.data,
                password: hashedPassword,
            });
            console.log(`✔  ${usuario.data.rol} creado → matrícula: ${usuario.data.matricula} | password: ${usuario.password}`);
        }

        console.log('\n🎉 Seed completado. Credenciales de prueba:\n');
        console.log('  ROL        | MATRÍCULA  | CONTRASEÑA');
        console.log('  -----------|------------|------------');
        console.log('  STUDENT    | 2024-001   | alumno123');
        console.log('  TEACHER    | D-045      | docente123');
        console.log('  ADMIN      | ADM-001    | admin123');

    } catch (error) {
        console.error('❌ Error en el seed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Desconectado de MongoDB');
    }
}

seed();