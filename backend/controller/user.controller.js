import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Admin from '../models/Admin.js';

// Mapa rol → modelo discriminator
const MODEL_MAP = {
    STUDENT: Student,
    TEACHER: Teacher,
    ADMIN: Admin,
};

// ─────────────────────────────────────────
// POST /api/users/register
// ─────────────────────────────────────────
export const createUser = async (req, res) => {
    try {
        const { password, rol, ...rest } = req.body;

        const UserModel = MODEL_MAP[rol?.toUpperCase()];
        if (!UserModel) {
            return res.status(400).json({
                success: false,
                message: `Rol inválido. Los roles válidos son: ${Object.keys(MODEL_MAP).join(', ')}`,
            });
        }

        const existingUser = await User.findOne({
            $or: [{ email: rest.email }, { matricula: rest.matricula }],
        });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe un usuario con ese email o matrícula.',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await UserModel.create({
            ...rest,
            password: hashedPassword,
            rol: rol.toUpperCase(),
        });

        const { password: _, ...userResponse } = newUser.toObject();

        return res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente.',
            data: userResponse,
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(422).json({ success: false, message: messages.join(' | ') });
        }
        console.error('Error en createUser:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// ─────────────────────────────────────────
// PUT /api/users/:id — editar usuario (solo admin)
// ─────────────────────────────────────────
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Campos que NO se pueden modificar desde este endpoint
        const { password, rol, _id, __v, createdAt, updatedAt, ...updateFields } = req.body;

        // Si se envía una nueva contraseña, hashearla
        if (password && password.trim().length >= 8) {
            updateFields.password = await bcrypt.hash(password.trim(), 12);
        }

        // Verificar duplicados de email/matrícula en OTRO usuario
        if (updateFields.email || updateFields.matricula) {
            const conflict = await User.findOne({
                _id: { $ne: id },
                $or: [
                    ...(updateFields.email ? [{ email: updateFields.email }] : []),
                    ...(updateFields.matricula ? [{ matricula: updateFields.matricula }] : []),
                ],
            });
            if (conflict) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe otro usuario con ese email o matrícula.',
                });
            }
        }

        const updated = await User.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, runValidators: true, select: '-password' }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Usuario actualizado correctamente.',
            data: updated,
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(422).json({ success: false, message: messages.join(' | ') });
        }
        console.error('Error en updateUser:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// GET /api/users/all — obtener todos los usuarios (solo admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al obtener usuarios.' });
    }
};

// DELETE /api/users/:id — eliminar usuario (solo admin)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }
        return res.status(200).json({ success: true, message: 'Usuario eliminado correctamente.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al eliminar usuario.' });
    }
};

// ─────────────────────────────────────────
// POST /api/users/login
// ─────────────────────────────────────────
export const loginUser = async (req, res) => {
    try {
        const { matricula, password, rol } = req.body;

        if (!matricula || !password || !rol) {
            return res.status(400).json({
                success: false,
                message: 'Matrícula, contraseña y rol son requeridos.',
            });
        }

        const user = await User.findOne({ matricula, rol: rol.toUpperCase() });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas.',
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas.',
            });
        }

        const token = jwt.sign(
            { id: user._id, rol: user.rol, nombre: user.nombre },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        const { password: _, ...userSafe } = user.toObject();

        return res.status(200).json({
            success: true,
            token,
            user: userSafe,
        });

    } catch (error) {
        console.error('Error en loginUser:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};