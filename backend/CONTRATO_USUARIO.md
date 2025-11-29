# 📋 CONTRATO DE INTERFAZ: Modelo Usuario
## Para Persona 2 - Implementación de Rutas y Controladores

---

## ✅ ETAPA 1 COMPLETADA (Persona 1)

### Archivos Creados:
- ✅ `backend/src/models/Usuario.js` - Modelo completo con encriptación
- ✅ `backend/test-usuario.js` - Script de pruebas (ejecutado exitosamente)

### Dependencias Instaladas:
- ✅ `bcryptjs` (v2.4.3)

---

## 🔌 INTERFAZ DEL MODELO USUARIO

### Schema (Estructura de Datos):
```javascript
Usuario {
  _id: ObjectId,              // Generado automáticamente por MongoDB
  nombre: String,             // 2-50 caracteres, requerido
  email: String,              // Único, formato email válido, requerido
  password: String,           // Mínimo 6 caracteres, encriptado, oculto por defecto
  rol: String,                // "ADMINISTRADOR" | "PROFESOR" | "ESTUDIANTE"
  createdAt: Date,            // Timestamp de creación
  updatedAt: Date             // Timestamp de última actualización
}
```

### Métodos Disponibles:

#### 1. **compararPassword(passwordIngresado)**
```javascript
// USO: Verificar si una contraseña es correcta
const usuario = await Usuario.findOne({ email }).select('+password');
const esValida = await usuario.compararPassword('contraseña123');
// Retorna: Boolean (true si coincide, false si no)
```

**⚠️ IMPORTANTE:** 
- Debes agregar `.select('+password')` porque el password está oculto por defecto
- Este método usa bcrypt internamente

#### 2. **generarToken()** ⚡ PLACEHOLDER
```javascript
// USO: Generar token JWT (IMPLEMENTAR EN ETAPA 2)
const token = usuario.generarToken();
// Actualmente retorna: null
// PERSONA 2 debe implementar la lógica JWT aquí
```

---

## 📝 EJEMPLO DE USO PARA PERSONA 2

### Crear un Usuario:
```javascript
const Usuario = require('../models/Usuario');

// La contraseña se encripta automáticamente
const nuevoUsuario = await Usuario.create({
  nombre: 'Juan Pérez',
  email: 'juan@ejemplo.com',
  password: '123456',
  rol: 'ESTUDIANTE'
});

// El password NO aparece en la respuesta (select: false)
console.log(nuevoUsuario);
// { _id: ..., nombre: 'Juan Pérez', email: 'juan@ejemplo.com', rol: 'ESTUDIANTE' }
```

### Login (Autenticar Usuario):
```javascript
// 1. Buscar usuario por email (incluir password)
const usuario = await Usuario.findOne({ email: 'juan@ejemplo.com' })
  .select('+password');

if (!usuario) {
  return res.status(404).json({ message: 'Usuario no encontrado' });
}

// 2. Comparar contraseña
const esValida = await usuario.compararPassword('123456');

if (!esValida) {
  return res.status(401).json({ message: 'Contraseña incorrecta' });
}

// 3. Generar token JWT (PERSONA 2 implementará esto)
const token = usuario.generarToken(); // Actualmente retorna null

// 4. Retornar respuesta (sin password)
res.json({
  success: true,
  usuario: {
    id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol
  },
  token: token  // null por ahora
});
```

---

## 🎯 TAREAS PARA PERSONA 2

### Archivos a Crear:

1. **controllers/authController.js**
   ```javascript
   exports.register = async (req, res) => { ... }
   exports.login = async (req, res) => { ... }
   exports.getProfile = async (req, res) => { ... }
   ```

2. **routes/authRoutes.js**
   ```javascript
   POST /api/auth/register  // Crear usuario
   POST /api/auth/login     // Autenticar usuario
   GET  /api/auth/profile   // Obtener perfil (sin JWT por ahora)
   ```

3. **Validadores (Opcional para Etapa 1)**
   - Validar formato de email
   - Validar longitud de password
   - Validar rol válido

---

## ✅ VALIDACIONES YA IMPLEMENTADAS (No requieren código adicional)

El modelo Usuario ya valida automáticamente:
- ✅ Email único (no duplicados)
- ✅ Email formato válido
- ✅ Nombre requerido (2-50 caracteres)
- ✅ Password requerido (mínimo 6 caracteres)
- ✅ Rol válido (ADMINISTRADOR, PROFESOR, ESTUDIANTE)

---

## 🚨 IMPORTANTE: NO MODIFICAR

**NO editar los siguientes archivos** (ya están funcionando):
- ❌ `models/Usuario.js` (solo en Etapa 2 para agregar JWT)
- ❌ `models/Categoria.js`
- ❌ `models/Subcategoria.js`
- ❌ `models/RangoEdad.js`
- ❌ `models/Dificultad.js`
- ❌ `config/database.js`
- ❌ Cualquier ruta existente en `routes/`

---

## 📊 TESTS DE VERIFICACIÓN

Ejecutar para verificar que el modelo funciona:
```bash
node test-usuario.js
```

Resultado esperado:
```
✅ TODOS LOS TESTS PASARON CORRECTAMENTE
```

---

## 🔄 FLUJO DE TRABAJO RECOMENDADO

### Etapa 1 (Sin JWT - EMPEZAR AQUÍ):

1. Crear `authController.js` con función `register`:
   ```javascript
   const Usuario = require('../models/Usuario');
   
   exports.register = async (req, res) => {
     const { nombre, email, password, rol } = req.body;
     
     const usuario = await Usuario.create({ nombre, email, password, rol });
     
     res.status(201).json({
       success: true,
       usuario: {
         id: usuario._id,
         nombre: usuario.nombre,
         email: usuario.email,
         rol: usuario.rol
       }
       // Sin token por ahora
     });
   };
   ```

2. Crear `authRoutes.js`:
   ```javascript
   const express = require('express');
   const router = express.Router();
   const authController = require('../controllers/authController');
   
   router.post('/register', authController.register);
   
   module.exports = router;
   ```

3. Agregar ruta en `routes/index.js`:
   ```javascript
   const authRoutes = require('./authRoutes');
   router.use('/auth', authRoutes);
   ```

### Etapa 2 (Con JWT - DESPUÉS):
- Instalar `jsonwebtoken`
- Implementar `generarToken()` en modelo
- Agregar `login` en controlador
- Crear middleware de autenticación

---

## 📞 PREGUNTAS FRECUENTES

**Q: ¿Necesito encriptar la contraseña manualmente?**
A: No, el modelo lo hace automáticamente con el middleware pre-save.

**Q: ¿Cómo accedo al password si está oculto?**
A: Usa `.select('+password')` en la query.

**Q: ¿Puedo modificar el modelo Usuario?**
A: En Etapa 1 NO. En Etapa 2 solo para agregar JWT.

**Q: ¿Qué validaciones debo agregar en el controlador?**
A: Verificar email duplicado (try-catch de MongoDB) y validaciones personalizadas con express-validator.

---

## 🎉 LISTO PARA EMPEZAR

**Estado actual:**
- ✅ Modelo Usuario funcional
- ✅ Encriptación automática
- ✅ Validaciones activas
- ✅ Tests pasando
- ✅ Sin afectar funcionalidad existente

**Siguiente paso para Persona 2:**
Crear `authController.js` con función básica de registro (sin JWT).

---

**Fecha de entrega:** ETAPA 1 completada - 2025-11-28
**Responsable:** Persona 1
**Siguiente etapa:** Persona 2 implementa rutas y controladores
