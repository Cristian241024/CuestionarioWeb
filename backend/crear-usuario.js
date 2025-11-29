// Script para crear usuario en MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('./src/models/Usuario');

const crearUsuario = async () => {
    try {
        // Conectar a BD
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        // CONFIGURA AQUÍ TU USUARIO
        const datosUsuario = {
            nombre: 'Juan Estudiante',
            email: 'estudiante@cuestionario.com',
            password: 'estudiante123',  // Se encriptará automáticamente
            rol: 'ESTUDIANTE'
        };

        // Verificar si ya existe
        const existente = await Usuario.findOne({ email: datosUsuario.email });
        if (existente) {
            console.log('⚠️  El usuario ya existe:', existente.email);
            process.exit(0);
        }

        // Crear usuario
        const usuario = await Usuario.create(datosUsuario);
        
        console.log('\n✅ Usuario creado exitosamente:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('ID:', usuario._id);
        console.log('Nombre:', usuario.nombre);
        console.log('Email:', usuario.email);
        console.log('Rol:', usuario.rol);
        console.log('Password:', '****** (encriptado)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n📋 Puedes usarlo para:');
        console.log('  - Crear categorías (id_usuario)');
        console.log('  - Testing de login (cuando Persona 2 lo implemente)');
        console.log('  - Ver en MongoDB Atlas');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

// CAMBIAR ESTOS DATOS ANTES DE EJECUTAR
console.log('🚀 Creando usuario...\n');
crearUsuario();
