const express = require("express");
const router = express.Router();
const rangoController = require("../controllers/rangoEdadController");

// Rutas CRUD
router.get("/", rangoController.obtenerRangos);
router.get("/:id", rangoController.obtenerRangoPorId);
router.post("/", rangoController.crearRango);
router.put("/:id", rangoController.actualizarRango);
router.delete("/:id", rangoController.eliminarRango);

module.exports = router;