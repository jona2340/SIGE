const express = require("express");
const router = express.Router();
const inscripcionesController = require("../controllers/inscripciones.controller");

router.get("/GetAll", inscripcionesController.getInscripciones);
router.get("/GetInscripcionesById/:id", inscripcionesController.getInscripcionById);
router.post("/CreateInscripcion", inscripcionesController.createInscripcion);
router.patch("/UpdateInscripciones/:id", inscripcionesController.updateInscripcion);
router.delete("/DeleteInscripciones/:id", inscripcionesController.deleteInscripcion);

module.exports = router;