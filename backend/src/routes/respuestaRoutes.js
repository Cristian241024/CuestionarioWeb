const express = require("express");
const router = express.Router();
const respuestaController = require("../controllers/respuestaController");
const { verificarToken, verificarProfesor } = require("../middlewares/autenticacion");

// ============== RUTAS PÚBLICAS (requieren autenticación) ==============

router.get("/", verificarToken, respuestaController.obtenerTodas);
router.get("/pregunta/:id_pregunta", verificarToken, respuestaController.obtenerPorPregunta);
router.get("/:id", verificarToken, respuestaController.obtenerPorId);
router.get("/correcta/:id_pregunta", respuestaController.obtenerRespuestaCorrecta);

// ============== RUTAS PROTEGIDAS ==============

router.post(
    "/",
    verificarToken,
    verificarProfesor,
    respuestaController.crear
);

router.put(
    "/:id",
    verificarToken,
    verificarProfesor,
    respuestaController.actualizar
);

router.delete(
    "/:id",
    verificarToken,
    verificarProfesor,
    respuestaController.eliminar
);

router.put(
    "/pregunta/:id_pregunta/reordenar",
    verificarToken,
    verificarProfesor,
    respuestaController.reordenarRespuestas
);

module.exports = router;