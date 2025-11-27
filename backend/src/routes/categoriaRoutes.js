const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoriaController");

// Rutas CRUD para categorías
router.get("/", categoriaController.obtenerCategorias);
router.get("/:id", categoriaController.obtenerCategoriaPorId);
router.get("/:id/subcategorias", categoriaController.obtenerSubcategoriasPorCategoria);
router.post("/", categoriaController.crearCategoria);
router.put("/:id", categoriaController.actualizarCategoria);
router.delete("/:id", categoriaController.eliminarCategoria);

module.exports = router;
