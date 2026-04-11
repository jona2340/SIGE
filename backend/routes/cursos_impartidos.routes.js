const express = require("express");
const router = express.Router();
const cursosController = require("../controllers/cursos_impartidos.controller");

router.get("/GetAll", cursosController.getCursos);
router.get("/GetCursoById/:id", cursosController.getCursoById);
router.post("/CreateCurso/", cursosController.createCurso);
router.patch("/UpdateCurso/:id", cursosController.updateCurso);
router.delete("/DeleteCurso/:id", cursosController.deleteCurso);

module.exports = router;