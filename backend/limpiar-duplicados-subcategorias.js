// Script para eliminar subcategorías duplicadas (mismo nombre en la misma categoría)
require('dotenv').config();
const mongoose = require('mongoose');
const Categoria = require('./src/models/Categoria');
const Subcategoria = require('./src/models/Subcategoria');

const limpiarDuplicados = async () => {
    try {
        // Conectar a BD
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        // Obtener todas las subcategorías
        const subcategorias = await Subcategoria.find().populate('id_categoria', 'nombre_categoria').sort({ createdAt: 1 });
        console.log(`\n📋 Total de subcategorías: ${subcategorias.length}`);

        // Encontrar duplicados (mismo nombre + misma categoría)
        const vistos = new Map();
        const duplicados = [];

        subcategorias.forEach(sub => {
            const clave = `${sub.nombre_subcategoria}|${sub.id_categoria._id}`;
            if (vistos.has(clave)) {
                duplicados.push(sub);
            } else {
                vistos.set(clave, sub);
            }
        });

        if (duplicados.length === 0) {
            console.log('✅ No hay duplicados. Todo está bien.');
            process.exit(0);
        }

        console.log(`\n⚠️  Encontrados ${duplicados.length} duplicados:`);
        duplicados.forEach(sub => {
            console.log(`  - "${sub.nombre_subcategoria}" en categoría "${sub.id_categoria.nombre_categoria}"`);
            console.log(`    ID: ${sub._id}, Creado: ${sub.createdAt}`);
        });

        // Eliminar duplicados (mantener el más antiguo)
        console.log('\n🗑️  Eliminando duplicados...');
        for (const sub of duplicados) {
            await Subcategoria.findByIdAndDelete(sub._id);
            console.log(`  ✅ Eliminado: "${sub.nombre_subcategoria}" de "${sub.id_categoria.nombre_categoria}" (${sub._id})`);
        }

        console.log('\n✅ Limpieza completada');
        console.log(`📊 Subcategorías únicas restantes: ${vistos.size}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

console.log('🚀 Limpiando subcategorías duplicadas...\n');
limpiarDuplicados();
