const express = require("express");
const router = express.Router();

const Usuarioscontroller = require("../controllers/usuarios.controller");

router.get("/GetAll", Usuarioscontroller.getUsuarios);
router.get("/GetUserById/:id", Usuarioscontroller.getUsuarioById);
router.post("/CreateUser", Usuarioscontroller.createUsuario);
router.patch("/UpdateUser/:id", Usuarioscontroller.updateUsuario);
router.delete("/DeleteUser/:id", Usuarioscontroller.deleteUsuario);

module.exports = router;