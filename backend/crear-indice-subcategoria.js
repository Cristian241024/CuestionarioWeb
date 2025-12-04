// Script para crear índice único compuesto en subcategorías
require('dotenv').config();
const mongoose = require('mongoose');
const Subcategoria = require('./src/models/Subcategoria');

const crearIndice = async () => {
    try {
        // Conectar a BD
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        // Eliminar índices anteriores (por si acaso)
        console.log('\n📋 Eliminando índices antiguos...');
        await Subcategoria.collection.dropIndexes();
        console.log('✅ Índices antiguos eliminados');

        // Crear el índice compuesto único (nombre_subcategoria + id_categoria)
        console.log('\n📋 Creando índice compuesto único...');
        await Subcategoria.collection.createIndex(
            { nombre_subcategoria: 1, id_categoria: 1 }, 
            { unique: true }
        );
        console.log('✅ Índice compuesto creado exitosamente');

        // Crear otros índices
        console.log('\n📋 Creando índices adicionales...');
        await Subcategoria.collection.createIndex({ id_categoria: 1 });
        await Subcategoria.collection.createIndex({ activo: 1 });
        console.log('✅ Índices adicionales creados');

        // Verificar índices
        console.log('\n📋 Índices actuales en la colección:');
        const indices = await Subcategoria.collection.indexes();
        indices.forEach(index => {
            console.log('  -', JSON.stringify(index.key), 
                       index.unique ? '(ÚNICO)' : '');
        });

        console.log('\n✅ Configuración completada');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ NO podrás crear subcategorías duplicadas en la MISMA categoría');
        console.log('✅ SÍ podrás crear subcategorías con el mismo nombre en categorías DIFERENTES');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

console.log('🚀 Configurando índice único compuesto para subcategorías...\n');
crearIndice();
