// Script para eliminar categorías duplicadas
require('dotenv').config();
const mongoose = require('mongoose');
const Categoria = require('./src/models/Categoria');

const limpiarDuplicados = async () => {
    try {
        // Conectar a BD
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        // Obtener todas las categorías
        const categorias = await Categoria.find().sort({ createdAt: 1 });
        console.log(`\n📋 Total de categorías: ${categorias.length}`);

        // Encontrar duplicados
        const vistos = new Map();
        const duplicados = [];

        categorias.forEach(cat => {
            const nombre = cat.nombre_categoria;
            if (vistos.has(nombre)) {
                duplicados.push(cat);
            } else {
                vistos.set(nombre, cat);
            }
        });

        if (duplicados.length === 0) {
            console.log('✅ No hay duplicados. Todo está bien.');
            process.exit(0);
        }

        console.log(`\n⚠️  Encontrados ${duplicados.length} duplicados:`);
        duplicados.forEach(cat => {
            console.log(`  - "${cat.nombre_categoria}" (ID: ${cat._id}, Creado: ${cat.createdAt})`);
        });

        // Eliminar duplicados (mantener el más antiguo)
        console.log('\n🗑️  Eliminando duplicados...');
        for (const cat of duplicados) {
            await Categoria.findByIdAndDelete(cat._id);
            console.log(`  ✅ Eliminado: "${cat.nombre_categoria}" (${cat._id})`);
        }

        console.log('\n✅ Limpieza completada');
        console.log(`📊 Categorías restantes: ${vistos.size}`);
        console.log('\nCategorías únicas que quedaron:');
        vistos.forEach((cat, nombre) => {
            console.log(`  - ${nombre}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

console.log('🚀 Limpiando categorías duplicadas...\n');
limpiarDuplicados();
