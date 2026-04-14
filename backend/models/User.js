// DISEÑO: Usamos Mongoose Discriminators en lugar de tener 3 colecciones separadas.
// Ventaja: todos los usuarios viven en UNA colección "users", lo que simplifica
// búsquedas globales (ej. "buscar usuario por email sin importar su rol").
// Cada discriminator hereda el esquema base y añade sus campos específicos,
// con un campo __t (kind) que Mongoose gestiona automáticamente para el filtrado.

import mongoose from 'mongoose';

// --- Esquema Base ---
// Solo los campos que son comunes a TODOS los usuarios del sistema
const userSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        // La contraseña SIEMPRE se almacena hasheada. La lógica de hash
        // está en el controlador para mantener el modelo limpio (sin hooks complejos).
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
            minlength: 8,
        },
        // Campo de matrícula/ID único por institución
        matricula: {
            type: String,
            required: [true, 'La matrícula/ID es obligatoria'],
            unique: true,
            trim: true,
        },
        // El rol es el discriminador clave. Mongoose lo usará internamente
        // para saber qué submodelo instanciar en cada consulta.
        rol: {
            type: String,
            enum: ['ADMIN', 'STUDENT', 'TEACHER'],
            required: [true, 'El rol es obligatorio'],
        },
        fotoPerfil: {
            type: String,
            default: '', // Guardará el string en Base64 o la URL de la imagen
        },
    },
    {
        // timestamps agrega automáticamente createdAt y updatedAt
        timestamps: true,
        // discriminatorKey define el campo que Mongoose usa para identificar
        // el tipo de documento. Usamos 'rol' para que coincida semánticamente
        // con nuestro dominio, en lugar del default '__t'.
        discriminatorKey: 'rol',
        collection: 'users', // Todo en una sola colección
    }
);

const User = mongoose.model('User', userSchema);
export default User;