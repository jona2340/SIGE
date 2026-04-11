const express = require("express");
const router = express.Router();
const materiasController = require("../controllers/materias.controller");

router.get("/GetAll", materiasController.getMaterias);
router.get("/GetMateriaById/:id", materiasController.getMateriaById);
router.get("/GetMateriaByCarrera/:carrera_id", materiasController.getMateriasByCarrera);
router.post("/CreateMateria", materiasController.createMateria);
router.patch("/UpdateMateria/:id", materiasController.updateMateria);
router.delete("/DeleteMaterias/:id", materiasController.deleteMateria);

module.exports = router;