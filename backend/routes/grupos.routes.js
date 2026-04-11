const express = require("express");
const router = express.Router();
const gruposController = require("../controllers/grupos.controller");

router.get("/GetAll", gruposController.getGrupos);
router.get("/GetGruposById/:id", gruposController.getGrupoById);
router.post("/CreateGrupo", gruposController.createGrupo);
router.patch("/UpdateGrupo/:id", gruposController.updateGrupo);
router.delete("/DeleteGrupo/:id", gruposController.deleteGrupo);

module.exports = router;