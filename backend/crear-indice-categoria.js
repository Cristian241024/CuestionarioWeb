// Script para crear índice único en nombre_categoria
require('dotenv').config();
const mongoose = require('mongoose');
const Categoria = require('./src/models/Categoria');

const crearIndice = async () => {
    try {
        // Conectar a BD
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        // Eliminar índices anteriores (por si acaso)
        console.log('\n📋 Eliminando índices antiguos...');
        await Categoria.collection.dropIndexes();
        console.log('✅ Índices antiguos eliminados');

        // Crear el índice único
        console.log('\n📋 Creando índice único para nombre_categoria...');
        await Categoria.collection.createIndex(
            { nombre_categoria: 1 }, 
            { unique: true }
        );
        console.log('✅ Índice único creado exitosamente');

        // Verificar índices
        console.log('\n📋 Índices actuales en la colección:');
        const indices = await Categoria.collection.indexes();
        indices.forEach(index => {
            console.log('  -', JSON.stringify(index.key), 
                       index.unique ? '(ÚNICO)' : '');
        });

        console.log('\n✅ Configuración completada');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Ahora NO podrás crear categorías con el mismo nombre');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

console.log('🚀 Configurando índice único para categorías...\n');
crearIndice();
