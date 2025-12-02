const express = require('express');
const router = express.Router();
const authRoutes = require("./authRoutes");
const rangoEdadRoutes = require('./rangoEdadRoutes');
const dificultadRoutes = require('./dificultadRoutes');
const categoriaRoutes = require('./categoriaRoutes');
const subcategoriaRoutes = require('./subcategoriaRoutes');
const { verificarToken } = require("../middlewares/autenticacion");

router.use("/auth", authRoutes);

// Rutas - Las protecciones están DENTRO de cada archivo de rutas
router.use('/rangos-edad', rangoEdadRoutes);
router.use('/dificultad', dificultadRoutes);
router.use('/categorias', categoriaRoutes);  // Sin verificarToken aquí, las GET son públicas
router.use('/subcategorias', subcategoriaRoutes);  // Sin verificarToken aquí, las GET son públicas

// Ruta de prueba
router.get('/test', (req, res) => {
    res.json({ message: '✅ Ruta de prueba funcionando' });
});

module.exports = router;