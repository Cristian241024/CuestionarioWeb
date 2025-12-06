const express = require("express");
const router = express.Router();
const cicloController = require("../controllers/cicloController");
const { verificarToken, verificarAdmin } = require("../middlewares/autenticacion");

// ============================================
// RUTAS PÚBLICAS (requieren autenticación)
// ============================================

// Obtener todos los ciclos (con filtros y permisos por rol)
router.get("/", verificarToken, cicloController.obtenerCiclos);

// Obtener un ciclo por ID
router.get("/:id", verificarToken, cicloController.obtenerCicloPorId);

// ============================================
// RUTAS SOLO PARA ADMIN
// ============================================

// Crear un nuevo ciclo
router.post("/", verificarToken, verificarAdmin, cicloController.crearCiclo);

// Actualizar un ciclo
router.put("/:id", verificarToken, verificarAdmin, cicloController.actualizarCiclo);

// Activar/Desactivar ciclo (toggle)
router.patch("/:id/toggle-activo", verificarToken, verificarAdmin, cicloController.toggleActivoCiclo);

// Eliminar un ciclo (soft-delete)
router.delete("/:id", verificarToken, verificarAdmin, cicloController.eliminarCiclo);

// Obtener estadísticas
router.get("/admin/estadisticas", verificarToken, verificarAdmin, cicloController.obtenerEstadisticas);

module.exports = router;
