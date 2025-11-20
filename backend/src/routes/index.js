const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Ruta de prueba funcionando' });
});

module.exports = router;