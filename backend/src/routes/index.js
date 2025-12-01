const express = require('express');
const router = express.Router();
const authRoutes = require("./authRoutes");
const rangoEdadRoutes = require('./rangoEdadRoutes');
const dificultadRoutes = require('./dificultadRoutes');
const categoriaRoutes = require('./categoriaRoutes');
const subcategoriaRoutes = require('./subcategoriaRoutes');
const { verificarToken, verificarAdmin } = require("../middlewares/autenticacion");

router.use("/auth", authRoutes);

// Rutas protegidas
router.use('/rangos-edad', rangoEdadRoutes);
router.use('/dificultad', dificultadRoutes);
router.use('/categorias', verificarToken, verificarAdmin, categoriaRoutes);
router.use('/subcategorias', verificarToken, verificarAdmin, subcategoriaRoutes);

// Ruta de prueba
router.get('/test', (req, res) => {
    res.json({ message: '✅ Ruta de prueba funcionando' });
});

module.exports = router;