// Script para crear ciclo de prueba en MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const Ciclo = require('./src/models/Ciclo');
const Usuario = require('./src/models/Usuario');

const crearCiclo = async () => {
    try {
        // Conectar a BD
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB\n');

        // Buscar un administrador existente
        const admin = await Usuario.findOne({ rol: 'ADMINISTRADOR' });
        if (!admin) {
            console.log('❌ No hay administradores en la BD. Crea uno primero.');
            process.exit(1);
        }
        console.log(`✅ Administrador encontrado: ${admin.nombre} (${admin.email})\n`);

        // CONFIGURA AQUÍ TU CICLO
        const datosCiclo = {
            nombre: 'Primer Semestre 2025',
            fecha_inicio: new Date('2025-01-15'),
            fecha_fin: new Date('2025-06-30'),
            id_admin: admin._id
        };

        // Verificar si ya existe
        const cicloExistente = await Ciclo.findOne({ nombre: datosCiclo.nombre });
        if (cicloExistente) {
            console.log(`⚠️  El ciclo "${datosCiclo.nombre}" ya existe.`);
            process.exit(0);
        }

        // Crear ciclo
        const ciclo = await Ciclo.create(datosCiclo);
        
        // Poblar referencias
        await ciclo.populate('id_admin', 'nombre email');
        
        console.log('✅ Ciclo creado exitosamente:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('ID:', ciclo._id);
        console.log('Nombre:', ciclo.nombre);
        console.log('Fecha Inicio:', ciclo.fecha_inicio.toLocaleDateString());
        console.log('Fecha Fin:', ciclo.fecha_fin.toLocaleDateString());
        console.log('Estado:', ciclo.estado);
        console.log('Activo:', ciclo.activo ? 'Sí' : 'No');
        console.log('Administrador:', ciclo.id_admin.nombre);
        console.log('Creado:', ciclo.createdAt.toLocaleString());
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

console.log('🚀 Creando ciclo de prueba...\n');
crearCiclo();
