const db = require("./config/db");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const CarrerasRoutes = require("./routes/carreras.routes");
const UserRoutes = require("./routes/usuarios.routes");
const PeriodoRoutes = require("./routes/periodos.routes");
const DocentesRoutes = require("./routes/docentes.routes");
const MateriaRoutes = require("./routes/materias.routes");
const EstudiantesRoutes = require("./routes/estudiantes.routes");
const GruposRoutes = require("./routes/grupos.routes");
const InscripcionesRoutes = require("./routes/inscripciones.routes");
const Cursos_Impartidos = require("./routes/cursos_impartidos.routes");
const CalificaionesRoutes = require("./routes/calificaciones.routes");

app.use("/carreras", CarrerasRoutes);
app.use("/users", UserRoutes);
app.use("/periodos", PeriodoRoutes);
app.use("/docentes", DocentesRoutes);
app.use("/materias", MateriaRoutes);
app.use("/estudiantes", EstudiantesRoutes);
app.use("/grupos", GruposRoutes);
app.use("/inscripciones", InscripcionesRoutes);
app.use("/cursos_impartidos", Cursos_Impartidos);
app.use("/calificaciones", CalificaionesRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});