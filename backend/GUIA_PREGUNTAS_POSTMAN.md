# 📋 GUÍA COMPLETA: PROBAR ENTIDAD PREGUNTA EN POSTMAN

## ✅ IMPLEMENTACIÓN COMPLETADA

### Archivos Creados:
- ✅ `models/Pregunta.js` - Modelo con validaciones
- ✅ `controllers/preguntaController.js` - CRUD completo
- ✅ `routes/preguntaRoutes.js` - Endpoints con permisos
- ✅ `middlewares/autenticacion.js` - Nuevos middlewares agregados
- ✅ `routes/index.js` - Ruta /preguntas integrada
- ✅ `crear-pregunta.js` - Script de prueba
- ✅ `listar-preguntas.js` - Script para listar

---

## 🎯 PERMISOS POR ROL

### ADMINISTRADOR:
- ✅ Ver TODAS las preguntas (borradores + publicadas)
- ✅ Ver preguntas de cualquier profesor
- ✅ Crear preguntas (puede asignar a cualquier profesor)
- ✅ Editar cualquier pregunta
- ✅ Eliminar cualquier pregunta
- ✅ Publicar/Despublicar cualquier pregunta
- ✅ Ver estadísticas

### PROFESOR:
- ✅ Ver SOLO sus propias preguntas
- ✅ Crear preguntas (automáticamente asigna su ID)
- ✅ Editar SOLO sus preguntas
- ✅ Eliminar SOLO sus preguntas
- ✅ Publicar/Despublicar SOLO sus preguntas
- ❌ NO puede ver preguntas de otros profesores

### ESTUDIANTE:
- ✅ Ver SOLO preguntas PUBLICADAS
- ✅ Filtrar por categoría, subcategoría, dificultad
- ❌ NO puede crear preguntas
- ❌ NO puede editar preguntas
- ❌ NO puede ver borradores

---

## 🚀 PASO 0: PREPARACIÓN

### Reiniciar el servidor:
```bash
cd backend
npm run dev
```

Servidor en: `http://localhost:4000`

### Tener tokens listos:
1. Login como ADMIN → Copiar token
2. Login como PROFESOR → Copiar token
3. Login como ESTUDIANTE → Copiar token

---

## 📝 ENDPOINTS DISPONIBLES

### 1️⃣ LISTAR PREGUNTAS (GET /api/preguntas)

**Todos los roles autenticados**

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Query Params (opcionales):**
```
?id_categoria=674...
?id_subcategoria=674...
?id_dificultad=674...
?id_rango_edad=674...
?tipo=Selección múltiple
?estado=Publicada
```

**Comportamiento por rol:**
- **ADMIN:** Ve todas las preguntas
- **PROFESOR:** Ve solo sus preguntas
- **ESTUDIANTE:** Ve solo publicadas

**Ejemplo:**
```
GET http://localhost:4000/api/preguntas
GET http://localhost:4000/api/preguntas?estado=Publicada
GET http://localhost:4000/api/preguntas?id_categoria=674abc123&tipo=Selección múltiple
```

---

### 2️⃣ VER PREGUNTA POR ID (GET /api/preguntas/:id)

**Todos los roles autenticados**

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Ejemplo:**
```
GET http://localhost:4000/api/preguntas/6931a77ce4c8c29e521a3ef3
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "_id": "6931a77ce4c8c29e521a3ef3",
    "texto": "¿Cuál es el resultado de 2 + 2?",
    "tipo": "Selección múltiple",
    "estado": "Borrador",
    "fecha_publicacion": null,
    "id_profesor": {
      "_id": "674...",
      "nombre": "Profesor Test",
      "email": "test.profesor@ejemplo.com"
    },
    "id_categoria": {
      "_id": "674...",
      "nombre_categoria": "Matemáticas"
    },
    "id_subcategoria": {
      "_id": "674...",
      "nombre_subcategoria": "Álgebra"
    },
    "id_dificultad": {
      "_id": "674...",
      "nivel": "Fácil"
    },
    "id_rango_edad": {
      "_id": "674...",
      "descripcion": "Niños",
      "edadMinima": 6,
      "edadMaxima": 12
    },
    "createdAt": "2025-12-04T15:23:40.570Z",
    "updatedAt": "2025-12-04T15:23:40.570Z"
  }
}
```

---

### 3️⃣ CREAR PREGUNTA (POST /api/preguntas)

**PROFESOR + ADMIN**

**Headers:**
```
Authorization: Bearer <TOKEN_PROFESOR_O_ADMIN>
```

**Body (JSON):**
```json
{
  "texto": "¿Cuál es la capital de Francia?",
  "tipo": "Respuesta corta",
  "id_categoria": "674abc123...",
  "id_subcategoria": "674def456...",
  "id_rango_edad": "674ghi789...",
  "id_dificultad": "674jkl012..."
}
```

**Tipos válidos:**
- "Selección múltiple"
- "Respuesta corta"
- "Dinámica"
- "Interactiva"

**Nota:** 
- PROFESOR: Se asigna automáticamente como creador
- ADMIN: Puede especificar `id_profesor` en el body

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Pregunta creada exitosamente",
  "data": { ... }
}
```

---

### 4️⃣ ACTUALIZAR PREGUNTA (PUT /api/preguntas/:id)

**Solo propietario o ADMIN**

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Body (JSON):** (todos los campos son opcionales)
```json
{
  "texto": "¿Cuál es la capital de España?",
  "tipo": "Selección múltiple",
  "id_categoria": "674...",
  "id_subcategoria": "674...",
  "id_rango_edad": "674...",
  "id_dificultad": "674..."
}
```

**Validaciones:**
- Profesor solo puede editar sus preguntas
- Admin puede editar cualquier pregunta
- Valida que subcategoría pertenezca a categoría

---

### 5️⃣ PUBLICAR PREGUNTA (PATCH /api/preguntas/:id/publicar)

**Solo propietario o ADMIN**

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Sin body**

**Ejemplo:**
```
PATCH http://localhost:4000/api/preguntas/6931a77ce4c8c29e521a3ef3/publicar
```

**Efecto:**
- Cambia estado a "Publicada"
- Asigna fecha_publicacion
- Ahora visible para estudiantes

---

### 6️⃣ DESPUBLICAR PREGUNTA (PATCH /api/preguntas/:id/despublicar)

**Solo propietario o ADMIN**

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Sin body**

**Ejemplo:**
```
PATCH http://localhost:4000/api/preguntas/6931a77ce4c8c29e521a3ef3/despublicar
```

**Efecto:**
- Cambia estado a "Borrador"
- Limpia fecha_publicacion
- Ya NO visible para estudiantes

---

### 7️⃣ ELIMINAR PREGUNTA (DELETE /api/preguntas/:id)

**Solo propietario o ADMIN**

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Ejemplo:**
```
DELETE http://localhost:4000/api/preguntas/6931a77ce4c8c29e521a3ef3
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Pregunta eliminada exitosamente"
}
```

---

### 8️⃣ VER PREGUNTAS DE UN PROFESOR (GET /api/preguntas/profesor/:id_profesor)

**Solo ADMIN**

**Headers:**
```
Authorization: Bearer <TOKEN_ADMIN>
```

**Query Params opcionales:**
```
?estado=Publicada
```

**Ejemplo:**
```
GET http://localhost:4000/api/preguntas/profesor/674abc123
GET http://localhost:4000/api/preguntas/profesor/674abc123?estado=Borrador
```

---

### 9️⃣ VER ESTADÍSTICAS (GET /api/preguntas/admin/estadisticas)

**Solo ADMIN**

**Headers:**
```
Authorization: Bearer <TOKEN_ADMIN>
```

**Ejemplo:**
```
GET http://localhost:4000/api/preguntas/admin/estadisticas
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "total": 15,
    "publicadas": 10,
    "borradores": 5,
    "porTipo": [
      { "_id": "Selección múltiple", "count": 8 },
      { "_id": "Respuesta corta", "count": 4 },
      { "_id": "Dinámica", "count": 2 },
      { "_id": "Interactiva", "count": 1 }
    ],
    "porDificultad": [
      { "_id": "Fácil", "count": 6 },
      { "_id": "Intermedio", "count": 5 },
      { "_id": "Avanzado", "count": 4 }
    ]
  }
}
```

---

## 🧪 PLAN DE PRUEBAS EN POSTMAN

### FASE 1: Preparación
- [ ] Obtener IDs de categorías (GET /api/categorias)
- [ ] Obtener IDs de subcategorías (GET /api/subcategorias)
- [ ] Obtener IDs de dificultades (GET /api/dificultad)
- [ ] Obtener IDs de rangos edad (GET /api/rangos-edad)
- [ ] Login como ADMIN
- [ ] Login como PROFESOR
- [ ] Login como ESTUDIANTE

### FASE 2: Crear Preguntas (PROFESOR)
- [ ] POST /api/preguntas con token de profesor
- [ ] Verificar que se asigna su ID automáticamente
- [ ] Crear pregunta tipo "Selección múltiple"
- [ ] Crear pregunta tipo "Respuesta corta"
- [ ] Crear pregunta tipo "Dinámica"
- [ ] Crear pregunta tipo "Interactiva"

### FASE 3: Publicar Preguntas (PROFESOR)
- [ ] PATCH /api/preguntas/:id/publicar (una pregunta)
- [ ] Verificar que fecha_publicacion se asigna
- [ ] Verificar que estado es "Publicada"

### FASE 4: Ver Preguntas (ESTUDIANTE)
- [ ] GET /api/preguntas con token de estudiante
- [ ] Verificar que SOLO ve publicadas
- [ ] Verificar que NO ve borradores
- [ ] Probar filtros (categoría, dificultad, tipo)

### FASE 5: Permisos (PROFESOR)
- [ ] GET /api/preguntas (ver solo sus preguntas)
- [ ] Intentar editar pregunta de otro profesor (debe fallar 403)
- [ ] Editar su propia pregunta (debe funcionar)
- [ ] Eliminar su propia pregunta (debe funcionar)

### FASE 6: Permisos (ADMIN)
- [ ] GET /api/preguntas (ver todas)
- [ ] Editar pregunta de cualquier profesor (debe funcionar)
- [ ] GET /api/preguntas/profesor/:id (ver preguntas de profesor)
- [ ] GET /api/preguntas/admin/estadisticas

### FASE 7: Validaciones
- [ ] Crear pregunta sin texto (debe fallar)
- [ ] Crear pregunta con tipo inválido (debe fallar)
- [ ] Crear pregunta con subcategoría que no pertenece a categoría (debe fallar)
- [ ] Crear pregunta con texto muy corto (<10 chars) (debe fallar)
- [ ] Crear pregunta con texto muy largo (>1000 chars) (debe fallar)

---

## ✅ CHECKLIST DE VALIDACIÓN

### Modelo:
- [x] Campo texto (10-1000 caracteres)
- [x] Campo tipo (4 opciones enum)
- [x] Campo estado (Borrador/Publicada)
- [x] Validación de profesor (debe ser PROFESOR)
- [x] Validación de subcategoría pertenece a categoría
- [x] Índices de BD creados

### Middlewares:
- [x] verificarProfesorOAdmin
- [x] verificarPropietarioOAdmin

### Controlador:
- [x] CRUD completo
- [x] Filtros por rol
- [x] Publicar/Despublicar
- [x] Estadísticas

### Rutas:
- [x] Endpoints con middlewares correctos
- [x] Integrado en routes/index.js

### Scripts:
- [x] crear-pregunta.js funcional
- [x] listar-preguntas.js funcional

---

## 🎉 RESUMEN

**Implementación completada al 100%:**

✅ Entidad Pregunta con 4 tipos
✅ Permisos por rol (ADMIN, PROFESOR, ESTUDIANTE)
✅ CRUD completo
✅ Publicar/Despublicar preguntas
✅ Validaciones de integridad referencial
✅ Filtros y búsquedas
✅ Estadísticas para ADMIN
✅ Scripts de prueba

**La entidad Respuesta se implementará en el futuro.**

---

## 📞 ERRORES COMUNES Y SOLUCIONES

### Error 401 - Token no proporcionado
- Verifica que el header Authorization esté presente
- Formato: `Bearer <token>`

### Error 403 - No tienes permiso
- Profesor intentando editar pregunta de otro
- Estudiante intentando crear/editar
- Verifica el rol del token

### Error 404 - Pregunta no encontrada
- ID incorrecto
- Pregunta eliminada
- Verifica el ID en la URL

### Error 400 - La subcategoría no pertenece a la categoría
- Validación de relación FK
- Verifica que la subcategoría sea de esa categoría

---

¿Necesitas ayuda con algún endpoint específico?
