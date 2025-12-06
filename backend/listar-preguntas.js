// Script para listar todas las preguntas en MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('./src/models/Usuario');
const Categoria = require('./src/models/Categoria');
const Subcategoria = require('./src/models/Subcategoria');
const RangoEdad = require('./src/models/RangoEdad');
const Dificultad = require('./src/models/Dificultad');
const Pregunta = require('./src/models/Pregunta');

const listarPreguntas = async () => {
    try {
        // Conectar a BD
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB\n');

        // Obtener todas las preguntas
        const preguntas = await Pregunta.find()
            .populate('id_profesor', 'nombre email rol')
            .populate('id_categoria', 'nombre_categoria')
            .populate('id_subcategoria', 'nombre_subcategoria')
            .populate('id_dificultad', 'nivel')
            .populate('id_rango_edad', 'descripcion')
            .sort({ createdAt: -1 });

        if (preguntas.length === 0) {
            console.log('⚠️  No hay preguntas en la base de datos.');
            process.exit(0);
        }

        console.log(`📋 Total de preguntas: ${preguntas.length}\n`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        preguntas.forEach((pregunta, index) => {
            console.log(`${index + 1}. ${pregunta.texto.substring(0, 60)}${pregunta.texto.length > 60 ? '...' : ''}`);
            console.log(`   📌 ID: ${pregunta._id}`);
            console.log(`   📝 Tipo: ${pregunta.tipo}`);
            console.log(`   📊 Estado: ${pregunta.estado}`);
            console.log(`   👨‍🏫 Profesor: ${pregunta.id_profesor.nombre} (${pregunta.id_profesor.email})`);
            console.log(`   📂 Categoría: ${pregunta.id_categoria.nombre_categoria}`);
            console.log(`   📁 Subcategoría: ${pregunta.id_subcategoria.nombre_subcategoria}`);
            console.log(`   ⚡ Dificultad: ${pregunta.id_dificultad.nivel}`);
            console.log(`   👶 Rango Edad: ${pregunta.id_rango_edad.descripcion}`);
            console.log(`   📅 Creada: ${pregunta.createdAt.toLocaleDateString()}`);
            if (pregunta.fecha_publicacion) {
                console.log(`   📢 Publicada: ${pregunta.fecha_publicacion.toLocaleDateString()}`);
            }
            console.log('');
        });

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Estadísticas
        const publicadas = preguntas.filter(p => p.estado === 'Publicada').length;
        const borradores = preguntas.filter(p => p.estado === 'Borrador').length;
        
        console.log('\n📊 Estadísticas:');
        console.log(`   ✅ Publicadas: ${publicadas}`);
        console.log(`   📝 Borradores: ${borradores}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

console.log('🚀 Listando preguntas...\n');
listarPreguntas();
