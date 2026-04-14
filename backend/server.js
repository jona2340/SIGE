// Punto de entrada de la aplicación.
// Aquí se inicializa Express, se conecta MongoDB y se montan las rutas.

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/** * CONFIGURACIÓN DE MIDDLEWARE 
 * Se aumenta el límite a 10mb para permitir la recepción de imágenes en Base64
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Montamos el router de usuarios bajo el prefijo /api/users
app.use('/api/users', userRoutes);

// Conexión a MongoDB y arranque del servidor
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Conectado a MongoDB');
        app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
    })
    .catch((err) => console.error('❌ Error de conexión a MongoDB:', err));