// Script para listar todos los usuarios
require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('./src/models/Usuario');

const listarUsuarios = async () => {
    try {
        // Conectar a BD
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB\n');

        // Obtener todos los usuarios (sin password)
        const usuarios = await Usuario.find();
        
        console.log(`📋 USUARIOS EN LA BASE DE DATOS (${usuarios.length}):`);
        console.log('═══════════════════════════════════════════════════════\n');

        usuarios.forEach((usuario, index) => {
            console.log(`${index + 1}. ${usuario.nombre}`);
            console.log(`   ID: ${usuario._id}`);
            console.log(`   Email: ${usuario.email}`);
            console.log(`   Rol: ${usuario.rol}`);
            console.log(`   Creado: ${usuario.createdAt.toLocaleString()}`);
            console.log(`   Password: 🔒 Encriptado (no visible)\n`);
        });

        console.log('═══════════════════════════════════════════════════════');
        console.log('💡 Nota: El password NO se muestra porque tiene "select: false"');
        console.log('   Esto es correcto y es por seguridad.\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

listarUsuarios();
