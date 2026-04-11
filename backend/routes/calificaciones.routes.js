const express = require("express");
const router = express.Router();
const CalificacionesController = require("../controllers/calificaciones.controller");

router.get("/GetAll", CalificacionesController.getAll);
router.get("/GetCalificacionById/:id", CalificacionesController.getById);
router.post("/CreateCalificacion", CalificacionesController.create);
router.patch("/UpdateCalificacion/:id", CalificacionesController.update);
router.delete("/DeleteCalificacion/:id", CalificacionesController.delete);

module.exports = router;