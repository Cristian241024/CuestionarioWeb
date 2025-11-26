const express = require('express');
const router = express.Router();
const rangoEdadRoutes = require('./rangoEdadRoutes');
const dificultadRoutes = require('./dificultadRoutes')

// Rutas principales
router.use('/rangos-edad', rangoEdadRoutes);
router.use('/dificultad', dificultadRoutes);

// Ruta de prueba
router.get('/test', (req, res) => {
    res.json({ message: '✅ Ruta de prueba funcionando' });
});

module.exports = router;