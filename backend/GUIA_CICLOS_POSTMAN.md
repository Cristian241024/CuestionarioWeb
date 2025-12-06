# 📋 GUÍA COMPLETA: PROBAR ENTIDAD CICLO EN POSTMAN

## ✅ IMPLEMENTACIÓN COMPLETADA

### Archivos Creados:
- ✅ `models/Ciclo.js` - Modelo con validaciones
- ✅ `controllers/cicloController.js` - CRUD completo
- ✅ `routes/cicloRoutes.js` - Endpoints con permisos
- ✅ `routes/index.js` - Ruta /ciclos integrada
- ✅ `crear-ciclo.js` - Script de prueba
- ✅ `listar-ciclos.js` - Script para listar

---

## 🎯 PERMISOS POR ROL

### ADMINISTRADOR:
- ✅ Ver TODOS los ciclos (activos + inactivos)
- ✅ Crear ciclos (asigna su ID automáticamente)
- ✅ Editar cualquier ciclo (nombre, fechas)
- ✅ Eliminar ciclos (soft-delete: marca como inactivo)
- ✅ Activar/Desactivar ciclos
- ✅ Ver estadísticas

### PROFESOR:
- ✅ Ver SOLO ciclos ACTIVOS
- ✅ Filtrar por vigencia (fecha actual)
- ❌ NO puede crear ciclos
- ❌ NO puede editar ciclos
- ❌ NO puede eliminar ciclos

### ESTUDIANTE:
- ✅ Ver SOLO ciclos ACTIVOS
- ✅ Filtrar por vigencia
- ❌ NO ve información del admin creador
- ❌ NO puede crear/editar/eliminar

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

### 1️⃣ LISTAR CICLOS (GET /api/ciclos)

**Todos los roles autenticados**

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Query Params (opcionales):**
```
?activo=true        # Filtrar por activos/inactivos
?vigente=true       # Solo ciclos con fecha actual entre inicio-fin
```

**Comportamiento por rol:**
- **ADMIN:** Ve todos los ciclos (activos + inactivos)
- **PROFESOR:** Ve solo ciclos activos
- **ESTUDIANTE:** Ve solo ciclos activos (sin info del admin)

**Ejemplo:**
```
GET http://localhost:4000/api/ciclos
GET http://localhost:4000/api/ciclos?activo=true
GET http://localhost:4000/api/ciclos?vigente=true
GET http://localhost:4000/api/ciclos?activo=true&vigente=true
```

**Respuesta esperada:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "69336bba029d4a235b980929",
      "nombre": "Primer Semestre 2025",
      "fecha_inicio": "2025-01-15T00:00:00.000Z",
      "fecha_fin": "2025-06-30T00:00:00.000Z",
      "id_admin": {
        "_id": "674...",
        "nombre": "Admin Principal",
        "email": "admin@cuestionario.com"
      },
      "activo": true,
      "estado": "Vigente",
      "createdAt": "2025-12-05T19:33:14.000Z",
      "updatedAt": "2025-12-05T19:33:14.000Z"
    }
  ]
}
```

---

### 2️⃣ VER CICLO POR ID (GET /api/ciclos/:id)

**Todos los roles autenticados**

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Ejemplo:**
```
GET http://localhost:4000/api/ciclos/69336bba029d4a235b980929
```

**Validaciones:**
- PROFESOR/ESTUDIANTE solo ven ciclos activos
- ESTUDIANTE no ve campo `id_admin`

---

### 3️⃣ CREAR CICLO (POST /api/ciclos)

**Solo ADMIN**

**Headers:**
```
Authorization: Bearer <TOKEN_ADMIN>
```

**Body (JSON):**
```json
 
```

**Validaciones:**
- ✅ Nombre único (no duplicados)
- ✅ fecha_fin debe ser mayor a fecha_inicio
- ✅ Se asigna automáticamente el ID del admin autenticado
- ✅ Formato de fecha: YYYY-MM-DD

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Ciclo creado exitosamente",
  "data": {
    "_id": "693...",
    "nombre": "Segundo Semestre 2025",
    "fecha_inicio": "2025-07-01T00:00:00.000Z",
    "fecha_fin": "2025-12-20T00:00:00.000Z",
    "id_admin": {
      "_id": "674...",
      "nombre": "Admin Principal",
      "email": "admin@cuestionario.com"
    },
    "activo": true,
    "estado": "Próximo",
    "createdAt": "2025-12-05T...",
    "updatedAt": "2025-12-05T..."
  }
}
```

---

### 4️⃣ ACTUALIZAR CICLO (PUT /api/ciclos/:id)

**Solo ADMIN**

**Headers:**
```
Authorization: Bearer <TOKEN_ADMIN>
```

**Body (JSON):** (todos los campos son opcionales)
```json
{
  "nombre": "Primer Semestre 2025 - Actualizado",
  "fecha_inicio": "2025-01-20",
  "fecha_fin": "2025-07-05"
}
```

**Ejemplo:**
```
PUT http://localhost:4000/api/ciclos/69336bba029d4a235b980929
```

**Validaciones:**
- fecha_fin debe ser mayor a fecha_inicio
- Nombre único (si se cambia)

---

### 5️⃣ ACTIVAR/DESACTIVAR CICLO (PATCH /api/ciclos/:id/toggle-activo)

**Solo ADMIN**

**Headers:**
```
Authorization: Bearer <TOKEN_ADMIN>
```

**Sin body**

**Ejemplo:**
```
PATCH http://localhost:4000/api/ciclos/69336bba029d4a235b980929/toggle-activo
```

**Efecto:**
- Cambia `activo: true` → `activo: false` (o viceversa)
- Soft-delete: ciclos inactivos no son visibles para profesores/estudiantes

**Respuesta:**
```json
{
  "success": true,
  "message": "Ciclo desactivado exitosamente",
  "data": { ... }
}
```

---

### 6️⃣ ELIMINAR CICLO (DELETE /api/ciclos/:id)

**Solo ADMIN**

**Headers:**
```
Authorization: Bearer <TOKEN_ADMIN>
```

**Ejemplo:**
```
DELETE http://localhost:4000/api/ciclos/69336bba029d4a235b980929
```

**Efecto:**
- Soft-delete: marca `activo: false`
- NO elimina físicamente de la BD
- Mantiene integridad para futuras referencias

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Ciclo eliminado exitosamente (marcado como inactivo)"
}
```

---

### 7️⃣ VER ESTADÍSTICAS (GET /api/ciclos/admin/estadisticas)

**Solo ADMIN**

**Headers:**
```
Authorization: Bearer <TOKEN_ADMIN>
```

**Ejemplo:**
```
GET http://localhost:4000/api/ciclos/admin/estadisticas
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "activos": 4,
    "inactivos": 1,
    "vigentes": 1,
    "proximos": 2,
    "finalizados": 1
  }
}
```

**Definiciones:**
- **Total:** Todos los ciclos en BD
- **Activos:** `activo: true`
- **Inactivos:** `activo: false`
- **Vigentes:** Fecha actual entre inicio-fin
- **Próximos:** `fecha_inicio` > fecha actual
- **Finalizados:** `fecha_fin` < fecha actual

---

## 🧪 PLAN DE PRUEBAS EN POSTMAN

### FASE 1: Preparación
- [ ] Login como ADMIN → Guardar token
- [ ] Login como PROFESOR → Guardar token
- [ ] Login como ESTUDIANTE → Guardar token

### FASE 2: Crear Ciclos (ADMIN)
- [ ] POST /api/ciclos - Crear "Primer Semestre 2025"
- [ ] POST /api/ciclos - Crear "Segundo Semestre 2025"
- [ ] POST /api/ciclos - Crear "Ciclo Verano 2025"
- [ ] Verificar que se asigna el ID del admin automáticamente
- [ ] Verificar campo `estado` calculado correctamente

### FASE 3: Ver Ciclos (PROFESOR)
- [ ] GET /api/ciclos con token de profesor
- [ ] Verificar que SOLO ve ciclos activos
- [ ] GET /api/ciclos?vigente=true
- [ ] Verificar que ve información del admin

### FASE 4: Ver Ciclos (ESTUDIANTE)
- [ ] GET /api/ciclos con token de estudiante
- [ ] Verificar que SOLO ve ciclos activos
- [ ] Verificar que NO ve campo `id_admin`
- [ ] GET /api/ciclos?vigente=true

### FASE 5: Editar Ciclos (ADMIN)
- [ ] PUT /api/ciclos/:id - Actualizar nombre
- [ ] PUT /api/ciclos/:id - Actualizar fechas
- [ ] Verificar validación: fecha_fin > fecha_inicio

### FASE 6: Activar/Desactivar (ADMIN)
- [ ] PATCH /api/ciclos/:id/toggle-activo - Desactivar
- [ ] GET /api/ciclos como PROFESOR (no debe verlo)
- [ ] PATCH /api/ciclos/:id/toggle-activo - Reactivar
- [ ] GET /api/ciclos como PROFESOR (debe verlo)

### FASE 7: Estadísticas (ADMIN)
- [ ] GET /api/ciclos/admin/estadisticas
- [ ] Verificar que los contadores son correctos

### FASE 8: Validaciones
- [ ] Crear ciclo sin nombre (debe fallar)
- [ ] Crear ciclo con nombre duplicado (debe fallar)
- [ ] Crear ciclo con fecha_fin < fecha_inicio (debe fallar)
- [ ] Crear ciclo con fecha inválida (debe fallar)
- [ ] Profesor intenta crear ciclo (debe fallar 403)
- [ ] Estudiante intenta editar ciclo (debe fallar 403)

---

## 📊 ESTADOS DE CICLO (Calculados Automáticamente)

### Campo Virtual: `estado`

No se guarda en BD, se calcula dinámicamente:

| Estado | Condición | Descripción |
|--------|-----------|-------------|
| **Inactivo** | `activo: false` | Ciclo desactivado por admin |
| **Próximo** | `fecha_inicio` > ahora | Aún no ha comenzado |
| **Vigente** | ahora entre inicio-fin | Actualmente en curso |
| **Finalizado** | `fecha_fin` < ahora | Ya terminó |

**Ejemplo:**
```javascript
// Ciclo: 2025-01-15 a 2025-06-30
// Fecha actual: 2025-03-15
// Estado: "Vigente"

// Ciclo: 2025-07-01 a 2025-12-20
// Fecha actual: 2025-03-15
// Estado: "Próximo"
```

---

## ✅ CHECKLIST DE VALIDACIÓN

### Modelo:
- [x] Campo nombre (único, 3-100 caracteres)
- [x] Campo fecha_inicio (Date, requerido)
- [x] Campo fecha_fin (Date, requerido, mayor a inicio)
- [x] Campo id_admin (ObjectId, rol ADMINISTRADOR)
- [x] Campo activo (Boolean, default true)
- [x] Validación custom: fecha_fin > fecha_inicio
- [x] Validación custom: id_admin es ADMINISTRADOR
- [x] Índices creados (nombre único, fechas, activo)
- [x] Virtual `estado` calculado dinámicamente

### Controlador:
- [x] CRUD completo (7 métodos)
- [x] Filtros por rol (Admin, Profesor, Estudiante)
- [x] Filtro por vigencia (fechas actuales)
- [x] Soft-delete (activo: false)
- [x] Toggle activo
- [x] Estadísticas

### Rutas:
- [x] Endpoints con middlewares correctos
- [x] Solo ADMIN crea/edita/elimina
- [x] Todos ven ciclos (con filtros por rol)
- [x] Integrado en routes/index.js

### Scripts:
- [x] crear-ciclo.js funcional
- [x] listar-ciclos.js funcional

---

## 🎉 RESUMEN

**Implementación completada al 100%:**

✅ Entidad Ciclo con validaciones
✅ Permisos por rol (ADMIN, PROFESOR, ESTUDIANTE)
✅ CRUD completo para ADMIN
✅ Solo lectura para PROFESOR/ESTUDIANTE
✅ Soft-delete (mantiene integridad)
✅ Estados calculados (Próximo, Vigente, Finalizado)
✅ Filtros por vigencia y actividad
✅ Estadísticas para ADMIN
✅ Scripts de prueba

**La entidad Examen se conectará en el futuro.**

---

## 📞 ERRORES COMUNES Y SOLUCIONES

### Error 400 - Ya existe un ciclo con ese nombre
- Solución: Usar un nombre diferente (nombres únicos)

### Error 400 - La fecha de fin debe ser mayor a la fecha de inicio
- Solución: Verificar que fecha_fin > fecha_inicio

### Error 403 - Solo administradores
- Problema: PROFESOR o ESTUDIANTE intenta crear/editar
- Solución: Solo ADMIN puede modificar ciclos

### Error 404 - Ciclo no encontrado
- Problema: ID incorrecto o ciclo eliminado
- Solución: Verificar el ID en la URL

---

## 🔮 PREPARACIÓN PARA ENTIDAD EXAMEN (Futuro)

Cuando se implemente la entidad **Examen**:

### Relación:
```javascript
Examen {
  id_ciclo: ObjectId (ref: Ciclo)
  // ... otros campos
}
```

### Validación adicional en eliminarCiclo():
```javascript
// Verificar si tiene exámenes asociados
const examenesAsociados = await Examen.find({ id_ciclo: ciclo._id });
if (examenesAsociados.length > 0) {
  return res.status(400).json({
    message: `No se puede eliminar. Hay ${examenesAsociados.length} examen(es) asociado(s)`
  });
}
```

---

¿Necesitas ayuda con algún endpoint específico?
