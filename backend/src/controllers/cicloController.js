const Ciclo = require("../models/Ciclo");

// Obtener todos los ciclos (con filtros y permisos por rol)
exports.obtenerCiclos = async (req, res) => {
    try {
        const { activo, vigente } = req.query;
        
        // Construir filtro dinámico
        let filtro = {};
        
        // PERMISOS POR ROL
        if (req.usuario.rol === "ESTUDIANTE" || req.usuario.rol === "PROFESOR") {
            // Profesores y estudiantes solo ven ciclos activos
            filtro.activo = true;
        }
        // ADMIN ve todos (activos e inactivos) si no especifica filtro
        
        // Aplicar filtros de query params
        if (activo !== undefined) {
            filtro.activo = activo === 'true';
        }
        
        let ciclos = await Ciclo.find(filtro)
            .populate("id_admin", "nombre email")
            .sort({ fecha_inicio: -1 });
        
        // Filtro adicional: vigente (fecha actual entre inicio y fin)
        if (vigente === 'true') {
            const ahora = new Date();
            ciclos = ciclos.filter(ciclo => 
                ahora >= ciclo.fecha_inicio && ahora <= ciclo.fecha_fin
            );
        }
        
        // Para ESTUDIANTE, ocultar información del admin
        if (req.usuario.rol === "ESTUDIANTE") {
            ciclos = ciclos.map(ciclo => {
                const cicloObj = ciclo.toObject();
                delete cicloObj.id_admin;
                return cicloObj;
            });
        }

        res.json({
            success: true,
            count: ciclos.length,
            data: ciclos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener ciclos",
            error: error.message
        });
    }
};

// Obtener un ciclo por ID
exports.obtenerCicloPorId = async (req, res) => {
    try {
        const ciclo = await Ciclo.findById(req.params.id)
            .populate("id_admin", "nombre email");

        if (!ciclo) {
            return res.status(404).json({
                success: false,
                message: "Ciclo no encontrado"
            });
        }

        // VALIDAR PERMISOS DE VISUALIZACIÓN
        if (req.usuario.rol === "ESTUDIANTE" || req.usuario.rol === "PROFESOR") {
            // Solo ven ciclos activos
            if (!ciclo.activo) {
                return res.status(403).json({
                    success: false,
                    message: "No tienes permiso para ver este ciclo"
                });
            }
        }
        
        // Para ESTUDIANTE, ocultar información del admin
        let cicloResponse = ciclo.toObject();
        if (req.usuario.rol === "ESTUDIANTE") {
            delete cicloResponse.id_admin;
        }

        res.json({
            success: true,
            data: cicloResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener ciclo",
            error: error.message
        });
    }
};

// Crear un nuevo ciclo (solo ADMIN)
exports.crearCiclo = async (req, res) => {
    try {
        const { nombre, fecha_inicio, fecha_fin } = req.body;

        // Validaciones básicas
        if (!nombre || !fecha_inicio || !fecha_fin) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son requeridos"
            });
        }

        // Validar formato de fechas
        const fechaInicioObj = new Date(fecha_inicio);
        const fechaFinObj = new Date(fecha_fin);

        if (isNaN(fechaInicioObj.getTime()) || isNaN(fechaFinObj.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Formato de fecha inválido"
            });
        }

        // Crear nuevo ciclo (asigna automáticamente el ID del admin autenticado)
        const nuevoCiclo = new Ciclo({
            nombre,
            fecha_inicio: fechaInicioObj,
            fecha_fin: fechaFinObj,
            id_admin: req.usuario._id
        });

        await nuevoCiclo.save();
        
        // Poblar la referencia del admin
        await nuevoCiclo.populate("id_admin", "nombre email");

        res.status(201).json({
            success: true,
            message: "Ciclo creado exitosamente",
            data: nuevoCiclo
        });
    } catch (error) {
        // Manejo específico para error de duplicado
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Ya existe un ciclo con ese nombre"
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Error al crear ciclo",
            error: error.message
        });
    }
};

// Actualizar un ciclo (solo ADMIN)
exports.actualizarCiclo = async (req, res) => {
    try {
        const { nombre, fecha_inicio, fecha_fin } = req.body;
        const ciclo = await Ciclo.findById(req.params.id);

        if (!ciclo) {
            return res.status(404).json({
                success: false,
                message: "Ciclo no encontrado"
            });
        }

        // Actualizar campos
        if (nombre) ciclo.nombre = nombre;
        if (fecha_inicio) ciclo.fecha_inicio = new Date(fecha_inicio);
        if (fecha_fin) ciclo.fecha_fin = new Date(fecha_fin);

        // Validar fechas si se actualizaron
        if (fecha_inicio || fecha_fin) {
            if (ciclo.fecha_fin <= ciclo.fecha_inicio) {
                return res.status(400).json({
                    success: false,
                    message: "La fecha de fin debe ser mayor a la fecha de inicio"
                });
            }
        }

        await ciclo.save();
        
        // Poblar la referencia del admin
        await ciclo.populate("id_admin", "nombre email");

        res.json({
            success: true,
            message: "Ciclo actualizado exitosamente",
            data: ciclo
        });
    } catch (error) {
        // Manejo específico para error de duplicado
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Ya existe un ciclo con ese nombre"
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Error al actualizar ciclo",
            error: error.message
        });
    }
};

// Activar/Desactivar ciclo (toggle) (solo ADMIN)
exports.toggleActivoCiclo = async (req, res) => {
    try {
        const ciclo = await Ciclo.findById(req.params.id);

        if (!ciclo) {
            return res.status(404).json({
                success: false,
                message: "Ciclo no encontrado"
            });
        }

        ciclo.activo = !ciclo.activo;
        await ciclo.save();
        await ciclo.populate("id_admin", "nombre email");

        res.json({
            success: true,
            message: `Ciclo ${ciclo.activo ? 'activado' : 'desactivado'} exitosamente`,
            data: ciclo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al cambiar estado del ciclo",
            error: error.message
        });
    }
};

// Eliminar un ciclo (soft-delete) (solo ADMIN)
exports.eliminarCiclo = async (req, res) => {
    try {
        const ciclo = await Ciclo.findById(req.params.id);

        if (!ciclo) {
            return res.status(404).json({
                success: false,
                message: "Ciclo no encontrado"
            });
        }

        // Soft-delete: marcar como inactivo
        ciclo.activo = false;
        await ciclo.save();

        res.json({
            success: true,
            message: "Ciclo eliminado exitosamente (marcado como inactivo)"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar ciclo",
            error: error.message
        });
    }
};

// Obtener estadísticas (solo ADMIN)
exports.obtenerEstadisticas = async (req, res) => {
    try {
        const ahora = new Date();
        
        const totalCiclos = await Ciclo.countDocuments();
        const activos = await Ciclo.countDocuments({ activo: true });
        const inactivos = await Ciclo.countDocuments({ activo: false });
        
        // Ciclos vigentes (fecha actual entre inicio y fin)
        const vigentes = await Ciclo.countDocuments({
            activo: true,
            fecha_inicio: { $lte: ahora },
            fecha_fin: { $gte: ahora }
        });
        
        // Ciclos próximos (aún no iniciados)
        const proximos = await Ciclo.countDocuments({
            activo: true,
            fecha_inicio: { $gt: ahora }
        });
        
        // Ciclos finalizados (fecha fin ya pasó)
        const finalizados = await Ciclo.countDocuments({
            activo: true,
            fecha_fin: { $lt: ahora }
        });

        res.json({
            success: true,
            data: {
                total: totalCiclos,
                activos,
                inactivos,
                vigentes,
                proximos,
                finalizados
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener estadísticas",
            error: error.message
        });
    }
};
