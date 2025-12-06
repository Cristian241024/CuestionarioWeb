const Pregunta = require("../models/Pregunta");
const Subcategoria = require("../models/Subcategoria");

// Obtener todas las preguntas (con filtros y permisos por rol)
exports.obtenerPreguntas = async (req, res) => {
    try {
        const { id_categoria, id_subcategoria, id_dificultad, id_rango_edad, tipo, estado } = req.query;
        
        // Construir filtro dinámico
        let filtro = {};
        
        // PERMISOS POR ROL
        if (req.usuario.rol === "ESTUDIANTE") {
            // Estudiantes solo ven preguntas publicadas
            filtro.estado = "Publicada";
        } else if (req.usuario.rol === "PROFESOR") {
            // Profesores ven solo sus propias preguntas (borradores + publicadas)
            filtro.id_profesor = req.usuario._id;
        }
        // ADMIN ve todas (no se agrega filtro adicional)
        
        // Aplicar filtros de query params
        if (id_categoria) filtro.id_categoria = id_categoria;
        if (id_subcategoria) filtro.id_subcategoria = id_subcategoria;
        if (id_dificultad) filtro.id_dificultad = id_dificultad;
        if (id_rango_edad) filtro.id_rango_edad = id_rango_edad;
        if (tipo) filtro.tipo = tipo;
        if (estado && req.usuario.rol !== "ESTUDIANTE") {
            filtro.estado = estado;
        }

        const preguntas = await Pregunta.find(filtro)
            .populate("id_profesor", "nombre email")
            .populate("id_categoria", "nombre_categoria")
            .populate("id_subcategoria", "nombre_subcategoria")
            .populate("id_dificultad", "nivel")
            .populate("id_rango_edad", "descripcion edadMinima edadMaxima")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: preguntas.length,
            data: preguntas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener preguntas",
            error: error.message
        });
    }
};

// Obtener una pregunta por ID
exports.obtenerPreguntaPorId = async (req, res) => {
    try {
        const pregunta = await Pregunta.findById(req.params.id)
            .populate("id_profesor", "nombre email")
            .populate("id_categoria", "nombre_categoria")
            .populate("id_subcategoria", "nombre_subcategoria")
            .populate("id_dificultad", "nivel")
            .populate("id_rango_edad", "descripcion edadMinima edadMaxima");

        if (!pregunta) {
            return res.status(404).json({
                success: false,
                message: "Pregunta no encontrada"
            });
        }

        // VALIDAR PERMISOS DE VISUALIZACIÓN
        if (req.usuario.rol === "ESTUDIANTE") {
            // Estudiantes solo ven preguntas publicadas
            if (pregunta.estado !== "Publicada") {
                return res.status(403).json({
                    success: false,
                    message: "No tienes permiso para ver esta pregunta"
                });
            }
        } else if (req.usuario.rol === "PROFESOR") {
            // Profesores solo ven sus propias preguntas
            if (pregunta.id_profesor._id.toString() !== req.usuario._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "No tienes permiso para ver esta pregunta"
                });
            }
        }
        // ADMIN puede ver cualquier pregunta

        res.json({
            success: true,
            data: pregunta
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener pregunta",
            error: error.message
        });
    }
};

// Crear una nueva pregunta
exports.crearPregunta = async (req, res) => {
    try {
        const { 
            texto, 
            tipo, 
            id_categoria, 
            id_subcategoria, 
            id_rango_edad, 
            id_dificultad,
            id_profesor // Solo ADMIN puede especificar profesor
        } = req.body;

        // Validaciones básicas
        if (!texto || !tipo || !id_categoria || !id_subcategoria || !id_rango_edad || !id_dificultad) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son requeridos"
            });
        }

        // Validar que la subcategoría pertenece a la categoría
        const subcategoria = await Subcategoria.findById(id_subcategoria);
        if (!subcategoria) {
            return res.status(404).json({
                success: false,
                message: "La subcategoría no existe"
            });
        }

        if (subcategoria.id_categoria.toString() !== id_categoria) {
            return res.status(400).json({
                success: false,
                message: "La subcategoría no pertenece a la categoría seleccionada"
            });
        }

        // Determinar el profesor
        let profesorId;
        if (req.usuario.rol === "ADMINISTRADOR" && id_profesor) {
            // Admin puede especificar el profesor
            profesorId = id_profesor;
        } else {
            // Profesor usa su propio ID
            profesorId = req.usuario._id;
        }

        const nuevaPregunta = new Pregunta({
            texto,
            tipo,
            id_categoria,
            id_subcategoria,
            id_rango_edad,
            id_dificultad,
            id_profesor: profesorId,
            estado: "Borrador" // Por defecto
        });

        await nuevaPregunta.save();
        
        // Poblar las referencias
        await nuevaPregunta.populate("id_profesor", "nombre email");
        await nuevaPregunta.populate("id_categoria", "nombre_categoria");
        await nuevaPregunta.populate("id_subcategoria", "nombre_subcategoria");
        await nuevaPregunta.populate("id_dificultad", "nivel");
        await nuevaPregunta.populate("id_rango_edad", "descripcion edadMinima edadMaxima");

        res.status(201).json({
            success: true,
            message: "Pregunta creada exitosamente",
            data: nuevaPregunta
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear pregunta",
            error: error.message
        });
    }
};

// Actualizar una pregunta
exports.actualizarPregunta = async (req, res) => {
    try {
        const { texto, tipo, id_categoria, id_subcategoria, id_rango_edad, id_dificultad } = req.body;
        const pregunta = req.pregunta; // Ya viene del middleware verificarPropietarioOAdmin

        // Si se actualiza categoría/subcategoría, validar relación
        if (id_subcategoria && id_categoria) {
            const subcategoria = await Subcategoria.findById(id_subcategoria);
            if (!subcategoria) {
                return res.status(404).json({
                    success: false,
                    message: "La subcategoría no existe"
                });
            }

            if (subcategoria.id_categoria.toString() !== id_categoria) {
                return res.status(400).json({
                    success: false,
                    message: "La subcategoría no pertenece a la categoría seleccionada"
                });
            }
        }

        // Actualizar campos
        if (texto) pregunta.texto = texto;
        if (tipo) pregunta.tipo = tipo;
        if (id_categoria) pregunta.id_categoria = id_categoria;
        if (id_subcategoria) pregunta.id_subcategoria = id_subcategoria;
        if (id_rango_edad) pregunta.id_rango_edad = id_rango_edad;
        if (id_dificultad) pregunta.id_dificultad = id_dificultad;

        await pregunta.save();
        
        // Poblar las referencias
        await pregunta.populate("id_profesor", "nombre email");
        await pregunta.populate("id_categoria", "nombre_categoria");
        await pregunta.populate("id_subcategoria", "nombre_subcategoria");
        await pregunta.populate("id_dificultad", "nivel");
        await pregunta.populate("id_rango_edad", "descripcion edadMinima edadMaxima");

        res.json({
            success: true,
            message: "Pregunta actualizada exitosamente",
            data: pregunta
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar pregunta",
            error: error.message
        });
    }
};

// Publicar una pregunta (cambiar estado a Publicada)
exports.publicarPregunta = async (req, res) => {
    try {
        const pregunta = req.pregunta; // Ya viene del middleware

        if (pregunta.estado === "Publicada") {
            return res.status(400).json({
                success: false,
                message: "La pregunta ya está publicada"
            });
        }

        pregunta.estado = "Publicada";
        pregunta.fecha_publicacion = new Date();
        await pregunta.save();

        await pregunta.populate("id_profesor", "nombre email");
        await pregunta.populate("id_categoria", "nombre_categoria");
        await pregunta.populate("id_subcategoria", "nombre_subcategoria");
        await pregunta.populate("id_dificultad", "nivel");
        await pregunta.populate("id_rango_edad", "descripcion edadMinima edadMaxima");

        res.json({
            success: true,
            message: "Pregunta publicada exitosamente",
            data: pregunta
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al publicar pregunta",
            error: error.message
        });
    }
};

// Despublicar una pregunta (volver a Borrador)
exports.despublicarPregunta = async (req, res) => {
    try {
        const pregunta = req.pregunta; // Ya viene del middleware

        if (pregunta.estado === "Borrador") {
            return res.status(400).json({
                success: false,
                message: "La pregunta ya está en borrador"
            });
        }

        pregunta.estado = "Borrador";
        pregunta.fecha_publicacion = null;
        await pregunta.save();

        await pregunta.populate("id_profesor", "nombre email");
        await pregunta.populate("id_categoria", "nombre_categoria");
        await pregunta.populate("id_subcategoria", "nombre_subcategoria");
        await pregunta.populate("id_dificultad", "nivel");
        await pregunta.populate("id_rango_edad", "descripcion edadMinima edadMaxima");

        res.json({
            success: true,
            message: "Pregunta despublicada exitosamente",
            data: pregunta
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al despublicar pregunta",
            error: error.message
        });
    }
};

// Eliminar una pregunta
exports.eliminarPregunta = async (req, res) => {
    try {
        const pregunta = req.pregunta; // Ya viene del middleware

        await Pregunta.findByIdAndDelete(pregunta._id);

        res.json({
            success: true,
            message: "Pregunta eliminada exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar pregunta",
            error: error.message
        });
    }
};

// Obtener preguntas de un profesor específico (solo ADMIN)
exports.obtenerPreguntasPorProfesor = async (req, res) => {
    try {
        const { id_profesor } = req.params;
        const { estado } = req.query;

        let filtro = { id_profesor };
        if (estado) filtro.estado = estado;

        const preguntas = await Pregunta.find(filtro)
            .populate("id_profesor", "nombre email")
            .populate("id_categoria", "nombre_categoria")
            .populate("id_subcategoria", "nombre_subcategoria")
            .populate("id_dificultad", "nivel")
            .populate("id_rango_edad", "descripcion edadMinima edadMaxima")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: preguntas.length,
            data: preguntas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener preguntas del profesor",
            error: error.message
        });
    }
};

// Obtener estadísticas (solo ADMIN)
exports.obtenerEstadisticas = async (req, res) => {
    try {
        const totalPreguntas = await Pregunta.countDocuments();
        const publicadas = await Pregunta.countDocuments({ estado: "Publicada" });
        const borradores = await Pregunta.countDocuments({ estado: "Borrador" });

        // Preguntas por tipo
        const porTipo = await Pregunta.aggregate([
            { $group: { _id: "$tipo", count: { $sum: 1 } } }
        ]);

        // Preguntas por dificultad
        const porDificultad = await Pregunta.aggregate([
            { 
                $lookup: {
                    from: "dificultades",
                    localField: "id_dificultad",
                    foreignField: "_id",
                    as: "dificultad"
                }
            },
            { $unwind: "$dificultad" },
            { $group: { _id: "$dificultad.nivel", count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            data: {
                total: totalPreguntas,
                publicadas,
                borradores,
                porTipo,
                porDificultad
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
