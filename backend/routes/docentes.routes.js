const express = require("express");
const router = express.Router();
const docentesController = require("../controllers/docentes.controller");

router.get("/GetAll", docentesController.getDocentes);
router.get("/GetDocenteById/:id", docentesController.getDocenteById);
router.post("/CreateDocente", docentesController.createDocente);
router.patch("/UpdateDocente/:id", docentesController.updateDocente);
router.delete("/DeleteDocente/:id", docentesController.deleteDocente);

module.exports = router;