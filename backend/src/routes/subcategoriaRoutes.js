const express = require("express");
const router = express.Router();
const subcategoriaController = require("../controllers/subcategoriaController");

// Rutas CRUD para subcategorías
router.get("/", subcategoriaController.obtenerSubcategorias);
router.get("/:id", subcategoriaController.obtenerSubcategoriaPorId);
router.post("/", subcategoriaController.crearSubcategoria);
router.put("/:id", subcategoriaController.actualizarSubcategoria);
router.patch("/:id/toggle-activo", subcategoriaController.toggleActivoSubcategoria);
router.delete("/:id", subcategoriaController.eliminarSubcategoria);

module.exports = router;
