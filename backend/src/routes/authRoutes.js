const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verificarToken, soloAdminRegistra } = require("../middlewares/autenticacion");

// REGISTRO: Solo admin o primer usuario
router.post("/registro", soloAdminRegistra, authController.registro);

// LOGIN: Cualquiera registrado
router.post("/login", authController.login);

// PERFIL: Solo autenticado
router.get("/mi-perfil", verificarToken, authController.miPerfil);

module.exports = router;