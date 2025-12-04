// Script para crear pregunta de prueba en MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const Pregunta = require('./src/models/Pregunta');
const Usuario = require('./src/models/Usuario');
const Categoria = require('./src/models/Categoria');
const Subcategoria = require('./src/models/Subcategoria');
const RangoEdad = require('./src/models/RangoEdad');
const Dificultad = require('./src/models/Dificultad');

const crearPregunta = async () => {
    try {
        // Conectar a BD
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB\n');

        // Buscar un profesor existente
        const profesor = await Usuario.findOne({ rol: 'PROFESOR' });
        if (!profesor) {
            console.log('❌ No hay profesores en la BD. Crea uno primero.');
            process.exit(1);
        }
        console.log(`✅ Profesor encontrado: ${profesor.nombre} (${profesor.email})`);

        // Buscar categoría y subcategoría
        const categoria = await Categoria.findOne();
        if (!categoria) {
            console.log('❌ No hay categorías en la BD. Crea una primero.');
            process.exit(1);
        }
        console.log(`✅ Categoría encontrada: ${categoria.nombre_categoria}`);

        const subcategoria = await Subcategoria.findOne({ id_categoria: categoria._id });
        if (!subcategoria) {
            console.log('❌ No hay subcategorías para esta categoría. Crea una primero.');
            process.exit(1);
        }
        console.log(`✅ Subcategoría encontrada: ${subcategoria.nombre_subcategoria}`);

        // Buscar rango de edad
        const rangoEdad = await RangoEdad.findOne();
        if (!rangoEdad) {
            console.log('❌ No hay rangos de edad en la BD. Crea uno primero.');
            process.exit(1);
        }
        console.log(`✅ Rango de edad encontrado: ${rangoEdad.descripcion}`);

        // Buscar dificultad
        const dificultad = await Dificultad.findOne();
        if (!dificultad) {
            console.log('❌ No hay dificultades en la BD. Crea una primero.');
            process.exit(1);
        }
        console.log(`✅ Dificultad encontrada: ${dificultad.nivel}\n`);

        // CONFIGURA AQUÍ TU PREGUNTA
        const datosPregunta = {
            texto: '¿Cuál es el resultado de 2 + 2?',
            tipo: 'Selección múltiple',
            id_profesor: profesor._id,
            id_categoria: categoria._id,
            id_subcategoria: subcategoria._id,
            id_rango_edad: rangoEdad._id,
            id_dificultad: dificultad._id,
            estado: 'Borrador'
        };

        // Crear pregunta
        const pregunta = await Pregunta.create(datosPregunta);
        
        // Poblar referencias
        await pregunta.populate('id_profesor', 'nombre email');
        await pregunta.populate('id_categoria', 'nombre_categoria');
        await pregunta.populate('id_subcategoria', 'nombre_subcategoria');
        await pregunta.populate('id_dificultad', 'nivel');
        await pregunta.populate('id_rango_edad', 'descripcion');
        
        console.log('✅ Pregunta creada exitosamente:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('ID:', pregunta._id);
        console.log('Texto:', pregunta.texto);
        console.log('Tipo:', pregunta.tipo);
        console.log('Estado:', pregunta.estado);
        console.log('Profesor:', pregunta.id_profesor.nombre);
        console.log('Categoría:', pregunta.id_categoria.nombre_categoria);
        console.log('Subcategoría:', pregunta.id_subcategoria.nombre_subcategoria);
        console.log('Dificultad:', pregunta.id_dificultad.nivel);
        console.log('Rango Edad:', pregunta.id_rango_edad.descripcion);
        console.log('Fecha Creación:', pregunta.createdAt);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

console.log('🚀 Creando pregunta de prueba...\n');
crearPregunta();
