const express = require('express');
const connectDB = require('./config/database');
const routes = require('./routes');

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', routes);


app.get('/', (req, res) => {
  res.json({ message: 'API del Cuestionario Web' });
});

module.exports = app;
