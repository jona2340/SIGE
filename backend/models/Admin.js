import User from './User.js';
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    // nivelAcceso: 1 = solo lectura, 2 = gestión, 3 = superadmin
    nivelAcceso: {
        type: Number,
        enum: [1, 2, 3],
        default: 1,
        required: [true, 'El nivel de acceso es obligatorio'],
    },
});

const Admin = User.discriminator('ADMIN', adminSchema);
export default Admin;