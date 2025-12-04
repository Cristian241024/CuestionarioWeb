const express = require("express");
const router = express.Router();
const preguntaController = require("../controllers/preguntaController");
const { 
    verificarToken, 
    verificarAdmin, 
    verificarProfesorOAdmin,
    verificarPropietarioOAdmin
} = require("../middlewares/autenticacion");

// ============================================
// RUTAS PÚBLICAS (requieren autenticación)
// ============================================

// Obtener todas las preguntas (con filtros y permisos por rol)
router.get("/", verificarToken, preguntaController.obtenerPreguntas);

// Obtener una pregunta por ID
router.get("/:id", verificarToken, preguntaController.obtenerPreguntaPorId);

// ============================================
// RUTAS PARA PROFESOR Y ADMIN
// ============================================

// Crear una nueva pregunta
router.post("/", verificarToken, verificarProfesorOAdmin, preguntaController.crearPregunta);

// Actualizar una pregunta (solo propietario o admin)
router.put("/:id", verificarToken, verificarPropietarioOAdmin, preguntaController.actualizarPregunta);

// Publicar una pregunta (cambiar estado a Publicada)
router.patch("/:id/publicar", verificarToken, verificarPropietarioOAdmin, preguntaController.publicarPregunta);

// Despublicar una pregunta (volver a Borrador)
router.patch("/:id/despublicar", verificarToken, verificarPropietarioOAdmin, preguntaController.despublicarPregunta);

// Eliminar una pregunta (solo propietario o admin)
router.delete("/:id", verificarToken, verificarPropietarioOAdmin, preguntaController.eliminarPregunta);

// ============================================
// RUTAS SOLO PARA ADMIN
// ============================================

// Obtener preguntas de un profesor específico
router.get("/profesor/:id_profesor", verificarToken, verificarAdmin, preguntaController.obtenerPreguntasPorProfesor);

// Obtener estadísticas generales
router.get("/admin/estadisticas", verificarToken, verificarAdmin, preguntaController.obtenerEstadisticas);

module.exports = router;
