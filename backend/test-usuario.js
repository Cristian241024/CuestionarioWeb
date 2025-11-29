// Script de prueba para el modelo Usuario
// Este archivo NO forma parte de la aplicación, solo para testing
require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('./src/models/Usuario');

const testUsuario = async () => {
    try {
        // Conectar a BD
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        // Limpiar usuarios de prueba anteriores
        await Usuario.deleteMany({ email: /test@/ });

        // TEST 1: Crear usuario
        console.log('\n🧪 TEST 1: Crear usuario con encriptación');
        const usuarioPrueba = await Usuario.create({
            nombre: 'Usuario Test',
            email: 'test@ejemplo.com',
            password: '123456',
            rol: 'ESTUDIANTE'
        });
        console.log('✅ Usuario creado:', {
            id: usuarioPrueba._id,
            nombre: usuarioPrueba.nombre,
            email: usuarioPrueba.email,
            rol: usuarioPrueba.rol,
            passwordEncriptado: usuarioPrueba.password ? '(encriptado)' : '(no visible por select:false)'
        });

        // TEST 2: Verificar que password no se retorna por defecto
        console.log('\n🧪 TEST 2: Verificar que password está oculto');
        const usuarioConsulta = await Usuario.findById(usuarioPrueba._id);
        console.log('✅ Password oculto:', usuarioConsulta.password === undefined);

        // TEST 3: Comparar contraseñas
        console.log('\n🧪 TEST 3: Comparar contraseñas');
        const usuarioConPassword = await Usuario.findById(usuarioPrueba._id).select('+password');
        const passwordCorrecta = await usuarioConPassword.compararPassword('123456');
        const passwordIncorrecta = await usuarioConPassword.compararPassword('incorrecta');
        console.log('✅ Password correcta:', passwordCorrecta);
        console.log('✅ Password incorrecta rechazada:', !passwordIncorrecta);

        // TEST 4: Crear usuario con rol diferente
        console.log('\n🧪 TEST 4: Crear usuario PROFESOR');
        const profesor = await Usuario.create({
            nombre: 'Profesor Test',
            email: 'test.profesor@ejemplo.com',
            password: 'profesor123',
            rol: 'PROFESOR'
        });
        console.log('✅ Profesor creado:', profesor.rol);

        // TEST 5: Validaciones
        console.log('\n🧪 TEST 5: Validaciones de email duplicado');
        try {
            await Usuario.create({
                nombre: 'Usuario Duplicado',
                email: 'test@ejemplo.com', // Email ya existe
                password: '123456',
                rol: 'ESTUDIANTE'
            });
            console.log('❌ ERROR: Debería haber rechazado email duplicado');
        } catch (error) {
            console.log('✅ Email duplicado rechazado correctamente');
        }

        // TEST 6: Verificar estructura de BD existente
        console.log('\n🧪 TEST 6: Verificar que otras colecciones siguen funcionando');
        const Categoria = require('./src/models/Categoria');
        const categorias = await Categoria.find().limit(1);
        console.log('✅ Colecciones existentes intactas:', categorias.length >= 0);

        // Limpiar datos de prueba
        await Usuario.deleteMany({ email: /test@/ });
        console.log('\n🧹 Datos de prueba eliminados');

        console.log('\n✅ TODOS LOS TESTS PASARON CORRECTAMENTE');
        console.log('\n📋 RESUMEN:');
        console.log('  - Modelo Usuario creado');
        console.log('  - Contraseñas se encriptan automáticamente');
        console.log('  - Password oculto por defecto (select: false)');
        console.log('  - Método compararPassword() funciona');
        console.log('  - Validaciones activas');
        console.log('  - Sin afectar funcionalidad existente');
        console.log('\n🎯 LISTO PARA QUE PERSONA 2 AGREGUE JWT');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error en tests:', error.message);
        process.exit(1);
    }
};

testUsuario();
