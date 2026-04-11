const express = require("express");
const router = express.Router();
const CarrerasController = require("../controllers/carreras.controller");

router.get("/GetAll", CarrerasController.getAll);
router.get("/GetCarreraById/:id", CarrerasController.getById);
router.post("/CreateCarrera", CarrerasController.create);
router.patch("/UpdateCarrera/:id", CarrerasController.update);
router.delete("/DeleteCarrera/:id", CarrerasController.delete);

module.exports = router;