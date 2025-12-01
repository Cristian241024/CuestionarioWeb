const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verificarToken } = require("../middlewares/autenticacion");

// Rutas públicas
router.post("/registro", authController.registro);
router.post("/login", authController.login);

// Rutas protegidas
router.get("/mi-perfil", verificarToken, authController.miPerfil);

module.exports = router;