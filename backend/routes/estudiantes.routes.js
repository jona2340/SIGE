const express = require("express");
const router = express.Router();
const estudiantesController = require("../controllers/estudiantes.controller");

router.get("/GetAll", estudiantesController.getEstudiantes);
router.get("/GetEstudianteById/:id", estudiantesController.getEstudianteById);
router.post("/CreateEstudiante", estudiantesController.createEstudiante);
router.patch("/UpdateEstudiante/:id", estudiantesController.updateEstudiante);
router.delete("/DeleteEstudiante/:id", estudiantesController.deleteEstudiante);

module.exports = router;