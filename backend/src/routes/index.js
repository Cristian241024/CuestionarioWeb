const express = require('express');
const router = express.Router();
const rangoEdadRoutes = require('./rangoEdadRoutes');
const dificultadRoutes = require('./dificultadRoutes');
const categoriaRoutes = require('./categoriaRoutes');
const subcategoriaRoutes = require('./subcategoriaRoutes');

// Rutas principales
router.use('/rangos-edad', rangoEdadRoutes);
router.use('/dificultad', dificultadRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/subcategorias', subcategoriaRoutes);

// Ruta de prueba
router.get('/test', (req, res) => {
    res.json({ message: '✅ Ruta de prueba funcionando' });
});

module.exports = router;