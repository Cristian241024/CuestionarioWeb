const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoriaController");
const { verificarToken, verificarAdmin } = require("../middlewares/autenticacion");

// Rutas PÚBLICAS (sin token)
router.get("/", categoriaController.obtenerCategorias);
router.get("/:id", categoriaController.obtenerCategoriaPorId);
router.get("/:id/subcategorias", categoriaController.obtenerSubcategoriasPorCategoria);

// Rutas PRIVADAS (necesita TOKEN + ser ADMIN)
router.post("/", verificarToken, verificarAdmin, categoriaController.crearCategoria);
router.put("/:id", verificarToken, verificarAdmin, categoriaController.actualizarCategoria);
router.delete("/:id", verificarToken, verificarAdmin, categoriaController.eliminarCategoria);

module.exports = router;
