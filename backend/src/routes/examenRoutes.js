const express = require('express');
const router = express.Router();
const examenController = require('../controllers/examenController');
const { 
    verificarToken, 
    verificarProfesor, 
    verificarProfesorOAdmin 
} = require('../middlewares/autenticacion');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Rutas para PROFESORES
router.post('/', verificarProfesor, examenController.crearExamen);
router.put('/:id', verificarProfesor, examenController.actualizarExamen);
router.delete('/:id', verificarProfesor, examenController.eliminarExamen);
router.post('/:id/preguntas', verificarProfesor, examenController.agregarPregunta);
router.delete('/:id/preguntas/:preguntaId', verificarProfesor, examenController.eliminarPregunta);

// Rutas de lectura (PROFESOR y ADMINISTRADOR)
router.get('/', verificarProfesorOAdmin, examenController.obtenerExamenes);
router.get('/:id', verificarProfesorOAdmin, examenController.obtenerExamen);

module.exports = router;