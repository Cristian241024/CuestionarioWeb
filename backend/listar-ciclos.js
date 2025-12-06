// Script para listar todos los ciclos en MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('./src/models/Usuario');
const Ciclo = require('./src/models/Ciclo');

const listarCiclos = async () => {
    try {
        // Conectar a BD
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB\n');

        // Obtener todos los ciclos
        const ciclos = await Ciclo.find()
            .populate('id_admin', 'nombre email rol')
            .sort({ fecha_inicio: -1 });

        if (ciclos.length === 0) {
            console.log('⚠️  No hay ciclos en la base de datos.');
            process.exit(0);
        }

        console.log(`📋 Total de ciclos: ${ciclos.length}\n`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        ciclos.forEach((ciclo, index) => {
            console.log(`${index + 1}. ${ciclo.nombre}`);
            console.log(`   📌 ID: ${ciclo._id}`);
            console.log(`   📅 Inicio: ${ciclo.fecha_inicio.toLocaleDateString()}`);
            console.log(`   📅 Fin: ${ciclo.fecha_fin.toLocaleDateString()}`);
            console.log(`   📊 Estado: ${ciclo.estado}`);
            console.log(`   ✅ Activo: ${ciclo.activo ? 'Sí' : 'No'}`);
            console.log(`   👨‍💼 Admin: ${ciclo.id_admin.nombre} (${ciclo.id_admin.email})`);
            console.log(`   🕒 Creado: ${ciclo.createdAt.toLocaleDateString()}`);
            console.log('');
        });

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Estadísticas
        const ahora = new Date();
        const activos = ciclos.filter(c => c.activo).length;
        const inactivos = ciclos.filter(c => !c.activo).length;
        const vigentes = ciclos.filter(c => 
            c.activo && ahora >= c.fecha_inicio && ahora <= c.fecha_fin
        ).length;
        const proximos = ciclos.filter(c => 
            c.activo && ahora < c.fecha_inicio
        ).length;
        const finalizados = ciclos.filter(c => 
            c.activo && ahora > c.fecha_fin
        ).length;
        
        console.log('\n📊 Estadísticas:');
        console.log(`   ✅ Activos: ${activos}`);
        console.log(`   ❌ Inactivos: ${inactivos}`);
        console.log(`   🟢 Vigentes: ${vigentes}`);
        console.log(`   🔵 Próximos: ${proximos}`);
        console.log(`   🔴 Finalizados: ${finalizados}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

console.log('🚀 Listando ciclos...\n');
listarCiclos();
