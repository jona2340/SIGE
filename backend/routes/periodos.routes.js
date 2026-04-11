const express = require("express");
const router = express.Router();

const controller = require("../controllers/periodos.controller");

router.get("/GetAll", controller.getPeriodos);
router.get("/GetPeriodoById/:id", controller.getPeriodoById);
router.post("/CreatePeriodo", controller.createPeriodo);
router.patch("/UpdatePeriodo/:id", controller.updatePeriodo);
router.delete("/DeletePeriodo/:id", controller.deletePeriodo);

module.exports = router;