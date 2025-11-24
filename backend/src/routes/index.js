const express = require('express');
const router = express.Router();
const rangoEdadRoutes = require('./rangoEdadRoutes');

// Rutas principales
router.use('/rangos-edad', rangoEdadRoutes);

// Ruta de prueba
router.get('/test', (req, res) => {
    res.json({ message: '✅ Ruta de prueba funcionando' });
});

module.exports = router;