const express = require('express');
const connectDB = require('./config/database');
const routes = require('./routes');

const app = express();

// Conectar a BD
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', routes);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({ message: '✅ API del Cuestionario Web' });
});

module.exports = app;