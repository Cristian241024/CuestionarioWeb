const express = require("express");
const router = express.Router();
const subcategoriaController = require("../controllers/subcategoriaController");
const { verificarToken, verificarAdmin } = require("../middlewares/autenticacion");

// Rutas PÚBLICAS (sin token)
router.get("/", subcategoriaController.obtenerSubcategorias);
router.get("/:id", subcategoriaController.obtenerSubcategoriaPorId);

// Rutas PRIVADAS (necesita TOKEN + ser ADMIN)
router.post("/", verificarToken, verificarAdmin, subcategoriaController.crearSubcategoria);
router.put("/:id", verificarToken, verificarAdmin, subcategoriaController.actualizarSubcategoria);
router.patch("/:id/toggle-activo", verificarToken, verificarAdmin, subcategoriaController.toggleActivoSubcategoria);
router.delete("/:id", verificarToken, verificarAdmin, subcategoriaController.eliminarSubcategoria);

module.exports = router;