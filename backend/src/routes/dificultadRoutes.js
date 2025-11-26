const express = require("express");
const router = express.Router();
const rangoController = require("../controllers/dificultadController");

router.get("/", rangoController.obtenerDificultades);
router.get("/:id", rangoController.obtenerDificultadPorId);
router.post("/", rangoController.crearDificultad);
router.put("/:id", rangoController.actualizarDificultad);
router.delete("/:id", rangoController.eliminarDificultad);

module.exports = router;