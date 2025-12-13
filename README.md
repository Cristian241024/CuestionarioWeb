# CuestionarioWeb 📝

API REST para sistema de cuestionarios con gestión de preguntas, categorías, ciclos y autenticación de usuarios.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Tecnologías](#tecnologías)

## ✨ Características

- ✅ Autenticación de usuarios con JWT
- ✅ CRUD de preguntas con categorías y subcategorías
- ✅ Gestión de ciclos de cuestionarios
- ✅ Niveles de dificultad configurables
- ✅ Rangos de edad para segmentación
- ✅ Soporte HTTP/HTTPS y HTTP/2
- ✅ Base de datos MongoDB Atlas
- ✅ Middleware de autenticación

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.x (recomendado 20.x)
- **npm** >= 9.x o **yarn** >= 1.22.x
- **MongoDB** (o cuenta en MongoDB Atlas)
- **Git** (opcional, para clonar el repositorio)

### Verificar instalaciones:

```bash
node --version
npm --version
```

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd CuestionarioWeb
```

### 2. Instalar dependencias

```bash
cd backend
npm install
```

### Dependencias principales instaladas:

- `express` (^5.1.0) - Framework web
- `mongoose` (^8.20.0) - ODM para MongoDB
- `jsonwebtoken` (^9.0.2) - Autenticación JWT
- `bcryptjs` (^3.0.3) - Hash de contraseñas
- `dotenv` (^17.2.3) - Variables de entorno
- `spdy` (^4.0.2) - Soporte HTTP/2

### Dependencias de desarrollo:

- `nodemon` (^3.1.11) - Auto-recarga en desarrollo
- `selfsigned` (^5.2.0) - Generación de certificados SSL

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/` con las siguientes variables:

```env
# Puerto del servidor HTTP
PORT=4000

# Puerto del servidor HTTPS
HTTPS_PORT=4443

# URI de conexión a MongoDB
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/CuestionarioDB?retryWrites=true&w=majority

# Entorno de ejecución
NODE_ENV=development

# Clave secreta para JWT (genera una clave segura única)
JWT_SECRET=tu_clave_secreta_muy_segura

# Tiempo de expiración del token JWT
JWT_EXPIRE=7d
```

### 2. Generar Certificados SSL (Opcional)

Para usar HTTPS/HTTP2 en desarrollo:

```bash
cd backend
node generate-certs.js
```

Esto creará los archivos `cert.pem` y `key.pem` en la carpeta `backend/certs/`.

### 3. Configurar MongoDB

Opción A: **MongoDB Atlas (Recomendado)**
1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un nuevo cluster
3. Configura un usuario de base de datos
4. Obtén la cadena de conexión y actualiza `MONGO_URI` en `.env`

Opción B: **MongoDB Local**
```env
MONGO_URI=mongodb://localhost:27017/CuestionarioDB
```

## 🎯 Uso

### Modo Desarrollo

```bash
cd backend
npm run dev
```

El servidor se iniciará en:
- HTTP: `http://localhost:4000`
- HTTPS: `https://localhost:4443` (si generaste certificados)

### Modo Producción

```bash
cd backend
npm start
```

### Verificar que funciona

Abre tu navegador o usa curl:

```bash
curl http://localhost:4000/
# Respuesta esperada: {"message":"✅ API del Cuestionario Web"}
```

## 📁 Estructura del Proyecto

```
CuestionarioWeb/
│
├── README.md                          # Este archivo
│
└── backend/                           # Servidor API REST
    ├── package.json                   # Dependencias y scripts
    ├── .env                          # Variables de entorno (no en git)
    ├── generate-certs.js             # Script para generar certificados SSL
    ├── create-certs.js               # Utilidad de certificados
    │
    ├── certs/                        # Certificados SSL (generados)
    │   ├── cert.pem
    │   └── key.pem
    │
    ├── src/                          # Código fuente principal
    │   ├── index.js                  # Punto de entrada de la aplicación
    │   ├── app.js                    # Configuración de Express
    │   │
    │   ├── config/                   # Configuraciones
    │   │   └── database.js           # Conexión a MongoDB
    │   │
    │   ├── models/                   # Modelos de Mongoose
    │   │   ├── Usuario.js            # Modelo de usuarios
    │   │   ├── Categoria.js          # Categorías de preguntas
    │   │   ├── Subcategoria.js       # Subcategorías
    │   │   ├── Pregunta.js           # Preguntas del cuestionario
    │   │   ├── Ciclo.js              # Ciclos de cuestionarios
    │   │   ├── Dificultad.js         # Niveles de dificultad
    │   │   └── RangoEdad.js          # Rangos de edad
    │   │
    │   ├── controllers/              # Lógica de negocio
    │   │   ├── authController.js     # Registro y login
    │   │   ├── categoriaController.js
    │   │   ├── subcategoriaController.js
    │   │   ├── preguntaController.js
    │   │   ├── cicloController.js
    │   │   ├── dificultadController.js
    │   │   └── rangoEdadController.js
    │   │
    │   ├── middlewares/              # Middlewares personalizados
    │   │   └── autenticacion.js      # Verificación de JWT
    │   │
    │   └── routes/                   # Definición de rutas
    │       ├── index.js              # Router principal
    │       ├── authRoutes.js         # /api/auth
    │       ├── categoriaRoutes.js    # /api/categorias
    │       ├── subcategoriaRoutes.js # /api/subcategorias
    │       ├── preguntaRoutes.js     # /api/preguntas
    │       ├── cicloRoutes.js        # /api/ciclos
    │       ├── dificultadRoutes.js   # /api/dificultad
    │       └── rangoEdadRoutes.js    # /api/rangos-edad
    │
    ├── crear-ciclo.js                # Script auxiliar para crear ciclos
    ├── crear-pregunta.js             # Script auxiliar para crear preguntas
    ├── listar-ciclos.js              # Script auxiliar para listar ciclos
    ├── listar-preguntas.js           # Script auxiliar para listar preguntas
    ├── GUIA_CICLOS_POSTMAN.md        # Documentación de endpoints de ciclos
    └── GUIA_PREGUNTAS_POSTMAN.md     # Documentación de endpoints de preguntas
```

### Descripción de Carpetas

- **`src/models/`**: Esquemas de Mongoose que definen la estructura de datos
- **`src/controllers/`**: Funciones que manejan la lógica de cada endpoint
- **`src/routes/`**: Definición de rutas HTTP y asignación a controladores
- **`src/middlewares/`**: Funciones intermedias para autenticación y validación
- **`src/config/`**: Configuraciones de conexión y servicios externos

## 🌐 API Endpoints

### Autenticación

```
POST   /api/auth/registro    # Registrar nuevo usuario
POST   /api/auth/login        # Iniciar sesión
```

### Categorías

```
GET    /api/categorias        # Listar todas (público)
POST   /api/categorias        # Crear (requiere autenticación)
PUT    /api/categorias/:id    # Actualizar (requiere autenticación)
DELETE /api/categorias/:id    # Eliminar (requiere autenticación)
```

### Subcategorías

```
GET    /api/subcategorias              # Listar todas (público)
GET    /api/subcategorias/categoria/:id # Por categoría (público)
POST   /api/subcategorias              # Crear (requiere autenticación)
PUT    /api/subcategorias/:id          # Actualizar (requiere autenticación)
DELETE /api/subcategorias/:id          # Eliminar (requiere autenticación)
```

### Preguntas

```
GET    /api/preguntas         # Listar todas
POST   /api/preguntas         # Crear nueva
GET    /api/preguntas/:id     # Obtener por ID
PUT    /api/preguntas/:id     # Actualizar
DELETE /api/preguntas/:id     # Eliminar
```

### Ciclos

```
GET    /api/ciclos            # Listar todos
POST   /api/ciclos            # Crear nuevo
GET    /api/ciclos/:id        # Obtener por ID
PUT    /api/ciclos/:id        # Actualizar
DELETE /api/ciclos/:id        # Eliminar
```

### Dificultad

```
GET    /api/dificultad        # Listar niveles
POST   /api/dificultad        # Crear nivel
```

### Rangos de Edad

```
GET    /api/rangos-edad       # Listar rangos
POST   /api/rangos-edad       # Crear rango
```

> **Nota**: Los endpoints protegidos requieren enviar el token JWT en el header:
> ```
> Authorization: Bearer <token>
> ```


## 🧪 Guía de Pruebas con Postman 
Antes de realizar las pruebas necesarias verificar la configuracion de Postman en auto
en settings/request/HTTP Version = auto
### 👥 Usuarios de Prueba

Para probar la API, primero debes crear usuarios con diferentes roles. A continuación se muestran usuarios de ejemplo:

| Rol | Email | Contraseña | Permisos |
|-----|-------|------------|----------|
| ADMINISTRADOR | admin@test.com | admin123 | Acceso total a todos los endpoints |
| PROFESOR | profesor@test.com | profe123 | CRUD de sus propias preguntas y ciclos |
| ESTUDIANTE | estudiante@test.com | estu123 | Solo lectura de contenido público |

### 📝 Paso a Paso: Configuración Inicial

#### 1. Registrar Usuarios

**Endpoint:** `POST http://localhost:4000/api/auth/registro`

**Headers:**
```
Content-Type: application/json
```

**Body (ejemplo para ADMIN):**
```json
{
  "nombre": "Administrador Principal",
  "email": "admin@test.com",
  "password": "admin123",
  "rol": "ADMINISTRADOR"
}
```

**Body (ejemplo para PROFESOR):**
```json
{
  "nombre": "Juan Pérez",
  "email": "profesor@test.com",
  "password": "profe123",
  "rol": "PROFESOR"
}
```

**Body (ejemplo para ESTUDIANTE):**
```json
{
  "nombre": "María García",
  "email": "estudiante@test.com",
  "password": "estu123",
  "rol": "ESTUDIANTE"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "674abc123...",
    "nombre": "Administrador Principal",
    "email": "admin@test.com",
    "rol": "ADMINISTRADOR"
  }
}
```

#### 2. Iniciar Sesión

**Endpoint:** `POST http://localhost:4000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "admin@test.com",
  "password": "admin123"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "674abc123...",
    "nombre": "Administrador Principal",
    "email": "admin@test.com",
    "rol": "ADMINISTRADOR"
  }
}
```

> **Importante:** Copia y guarda el **token** que recibes. Lo necesitarás para todas las peticiones protegidas.

### 🔑 Configurar Autenticación en Postman

Para endpoints protegidos, debes enviar el token en cada petición:

**Opción 1: Header manual**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Opción 2: En Postman (recomendado)**
1. Ve a la pestaña **Authorization**
2. Selecciona **Bearer Token**
3. Pega tu token en el campo **Token**

### 📚 Ejemplos de Uso por Módulo

#### **Categorías**

**Crear Categoría (requiere autenticación):**
```
POST http://localhost:4000/api/categorias
Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json

{
  "nombre_categoria": "Matemáticas",
  "descripcion": "Preguntas de matemáticas básicas"
}
```

**Listar Categorías (público):**
```
GET http://localhost:4000/api/categorias
```

**Actualizar Categoría:**
```
PUT http://localhost:4000/api/categorias/674abc123
Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json

{
  "nombre_categoria": "Matemáticas Avanzadas"
}
```

#### **Subcategorías**

**Crear Subcategoría:**
```
POST http://localhost:4000/api/subcategorias
Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json

{
  "nombre_subcategoria": "Álgebra",
  "descripcion": "Problemas de álgebra lineal",
  "id_categoria": "674abc123..."
}
```

**Obtener Subcategorías por Categoría:**
```
GET http://localhost:4000/api/subcategorias/categoria/674abc123
```

#### **Preguntas**

**Crear Pregunta (PROFESOR o ADMIN):**
```
POST http://localhost:4000/api/preguntas
Authorization: Bearer <TOKEN_PROFESOR>
Content-Type: application/json

{
  "texto": "¿Cuánto es 2 + 2?",
  "tipo": "Selección múltiple",
  "id_categoria": "674abc123...",
  "id_subcategoria": "674def456...",
  "id_rango_edad": "674ghi789...",
  "id_dificultad": "674jkl012..."
}
```

**Listar Preguntas:**
- **Como ESTUDIANTE:** Solo ve preguntas publicadas
- **Como PROFESOR:** Solo ve sus propias preguntas
- **Como ADMIN:** Ve todas las preguntas

```
GET http://localhost:4000/api/preguntas
Authorization: Bearer <TOKEN>
```

**Filtrar Preguntas:**
```
GET http://localhost:4000/api/preguntas?estado=Publicada&tipo=Selección múltiple
Authorization: Bearer <TOKEN>
```

**Actualizar Pregunta (solo propietario o ADMIN):**
```
PUT http://localhost:4000/api/preguntas/674abc123
Authorization: Bearer <TOKEN_PROFESOR>
Content-Type: application/json

{
  "texto": "¿Cuánto es 5 + 5?",
  "tipo": "Selección múltiple"
}
```

**Publicar Pregunta:**
```
PATCH http://localhost:4000/api/preguntas/674abc123/publicar
Authorization: Bearer <TOKEN_PROFESOR>
```

**Eliminar Pregunta:**
```
DELETE http://localhost:4000/api/preguntas/674abc123
Authorization: Bearer <TOKEN_ADMIN>
```

#### **Ciclos**

**Crear Ciclo (solo ADMIN):**
```
POST http://localhost:4000/api/ciclos
Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json

{
  "nombre": "Primer Semestre 2025",
  "fecha_inicio": "2025-01-15",
  "fecha_fin": "2025-06-30"
}
```

**Listar Ciclos:**
- **Como ADMIN:** Ve todos los ciclos (activos e inactivos)
- **Como PROFESOR/ESTUDIANTE:** Solo ve ciclos activos

```
GET http://localhost:4000/api/ciclos
Authorization: Bearer <TOKEN>
```

**Filtrar Ciclos Vigentes:**
```
GET http://localhost:4000/api/ciclos?vigente=true
Authorization: Bearer <TOKEN>
```

**Actualizar Ciclo (solo ADMIN):**
```
PUT http://localhost:4000/api/ciclos/674abc123
Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json

{
  "nombre": "Primer Semestre 2025 - Actualizado",
  "fecha_fin": "2025-07-15"
}
```

**Desactivar Ciclo (solo ADMIN):**
```
DELETE http://localhost:4000/api/ciclos/674abc123
Authorization: Bearer <TOKEN_ADMIN>
```

#### **Dificultad**

**Crear Nivel de Dificultad:**
```
POST http://localhost:4000/api/dificultad
Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json

{
  "nivel": "Fácil",
  "descripcion": "Preguntas de nivel básico"
}
```

**Listar Niveles:**
```
GET http://localhost:4000/api/dificultad
```

#### **Rangos de Edad**

**Crear Rango de Edad:**
```
POST http://localhost:4000/api/rangos-edad
Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json

{
  "descripcion": "Niños",
  "edadMinima": 6,
  "edadMaxima": 12
}
```

**Listar Rangos:**
```
GET http://localhost:4000/api/rangos-edad
```

### 🎯 Permisos por Rol

#### ADMINISTRADOR
- ✅ Crear, editar, eliminar usuarios
- ✅ Gestión completa de categorías y subcategorías
- ✅ Ver, editar, eliminar preguntas de cualquier profesor
- ✅ Crear, editar, eliminar ciclos
- ✅ Publicar/despublicar preguntas de cualquier profesor
- ✅ Acceso a estadísticas y reportes

#### PROFESOR
- ✅ Crear y editar sus propias preguntas
- ✅ Ver solo sus preguntas (borradores + publicadas)
- ✅ Publicar/despublicar sus preguntas
- ✅ Ver ciclos activos
- ❌ No puede ver preguntas de otros profesores
- ❌ No puede crear/editar ciclos

#### ESTUDIANTE
- ✅ Ver preguntas publicadas
- ✅ Ver categorías y subcategorías públicas
- ✅ Ver ciclos activos
- ✅ Filtrar preguntas por categoría, dificultad, etc.
- ❌ No puede crear, editar ni eliminar contenido
- ❌ No puede ver preguntas en estado borrador

### 🔍 Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | Solicitud exitosa |
| 201 | Recurso creado exitosamente |
| 400 | Error en los datos enviados |
| 401 | No autenticado (token inválido o faltante) |
| 403 | No autorizado (sin permisos) |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

### 💡 Consejos para Postman

1. **Crear una Colección:** Organiza todos los endpoints en una colección de Postman
2. **Variables de Entorno:** Crea variables para:
   - `{{base_url}}` = `http://localhost:4000`
   - `{{token_admin}}` = Token del administrador
   - `{{token_profesor}}` = Token del profesor
   - `{{token_estudiante}}` = Token del estudiante
3. **Guardar Respuestas:** Usa tests para guardar automáticamente los tokens:
   ```javascript
   pm.environment.set("token_admin", pm.response.json().token);
   ```

### 📦 Colección de Postman

Puedes importar todos estos endpoints creando un archivo JSON con la siguiente estructura:

```json
{
  "info": {
    "name": "CuestionarioWeb API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [...]
}
```

## 🛠️ Tecnologías

### Backend

- **Node.js** - Entorno de ejecución JavaScript
- **Express.js** - Framework web minimalista
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación basada en tokens
- **bcryptjs** - Encriptación de contraseñas

### Herramientas

- **Nodemon** - Auto-reload en desarrollo
- **Postman** - Testing de API (recomendado)

## 👤 Autor
Proyecto desarrollado para el curso de Programación Web por:
- **Huascar Cristian Cuellar Flores** -
- **Maria Yesica Sanchez Calle** -


