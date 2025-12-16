const Respuesta = require("../models/Respuesta");
const Pregunta = require("../models/Pregunta");

// GET - Obtener todas las respuestas con filtros
exports.obtenerTodas = async (req, res) => {
    try {
        const { id_pregunta, id_profesor, estado, es_correcta } = req.query;
        
        let filtro = {};

        if (id_pregunta) filtro.id_pregunta = id_pregunta;
        if (id_profesor) filtro.id_profesor = id_profesor;
        if (estado) filtro.estado = estado;
        if (es_correcta !== undefined) filtro.es_correcta = es_correcta === 'true';

        const respuestas = await Respuesta.find(filtro)
            .populate("id_pregunta", "texto tipo")
            .populate("id_profesor", "nombre email rol")
            .sort({ orden: 1, createdAt: 1 });

        res.json({
            success: true,
            total: respuestas.length,
            data: respuestas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener respuestas",
            error: error.message
        });
    }
};

// GET - Obtener respuestas de una pregunta específica
exports.obtenerPorPregunta = async (req, res) => {
    try {
        const { id_pregunta } = req.params;

        // Verificar que la pregunta existe
        const pregunta = await Pregunta.findById(id_pregunta);
        if (!pregunta) {
            return res.status(404).json({
                success: false,
                message: "Pregunta no encontrada"
            });
        }

        const respuestas = await Respuesta.find({ id_pregunta })
            .populate("id_profesor", "nombre email rol")
            .sort({ orden: 1 });

        res.json({
            success: true,
            total: respuestas.length,
            pregunta: {
                _id: pregunta._id,
                texto: pregunta.texto,
                tipo: pregunta.tipo
            },
            data: respuestas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener respuestas de la pregunta",
            error: error.message
        });
    }
};

// GET - Obtener una respuesta específica por ID
exports.obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const respuesta = await Respuesta.findById(id)
            .populate("id_pregunta")
            .populate("id_profesor", "nombre email rol");

        if (!respuesta) {
            return res.status(404).json({
                success: false,
                message: "Respuesta no encontrada"
            });
        }

        res.json({
            success: true,
            data: respuesta
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener respuesta",
            error: error.message
        });
    }
};

// POST - Crear nueva respuesta
exports.crear = async (req, res) => {
    try {
        const { texto, es_correcta, explicacion, id_pregunta, orden, imagen, multimedia } = req.body;
        const id_profesor = req.usuario.id; // Del middleware de autenticación

        // Validaciones básicas
        if (!texto || !id_pregunta) {
            return res.status(400).json({
                success: false,
                message: "Texto e id_pregunta son obligatorios"
            });
        }

        // Verificar que la pregunta existe
        const pregunta = await Pregunta.findById(id_pregunta);
        if (!pregunta) {
            return res.status(404).json({
                success: false,
                message: "Pregunta no encontrada"
            });
        }

        // Verificar que el profesor es el propietario de la pregunta
        if (pregunta.id_profesor.toString() !== id_profesor && req.usuario.rol !== "ADMINISTRADOR") {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para agregar respuestas a esta pregunta"
            });
        }

        const nuevaRespuesta = new Respuesta({
            texto,
            es_correcta: es_correcta || false,
            explicacion: explicacion || "",
            id_pregunta,
            id_profesor,
            orden: orden || 0,
            imagen: imagen || null,
            multimedia: multimedia || null
        });

        await nuevaRespuesta.save();

        const respuestaPopulada = await Respuesta.findById(nuevaRespuesta._id)
            .populate("id_profesor", "nombre email rol");

        res.status(201).json({
            success: true,
            message: "Respuesta creada correctamente",
            data: respuestaPopulada
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error al crear respuesta",
            error: error.message
        });
    }
};

// PUT - Actualizar respuesta
exports.actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { texto, es_correcta, explicacion, orden, imagen, multimedia, estado } = req.body;
        const usuarioId = req.usuario.id;

        // Obtener la respuesta actual
        const respuesta = await Respuesta.findById(id);
        if (!respuesta) {
            return res.status(404).json({
                success: false,
                message: "Respuesta no encontrada"
            });
        }

        // Verificar permisos (solo el profesor propietario o admin)
        if (respuesta.id_profesor.toString() !== usuarioId && req.usuario.rol !== "ADMINISTRADOR") {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para actualizar esta respuesta"
            });
        }

        // Actualizar campos
        if (texto) respuesta.texto = texto;
        if (es_correcta !== undefined) respuesta.es_correcta = es_correcta;
        if (explicacion !== undefined) respuesta.explicacion = explicacion;
        if (orden !== undefined) respuesta.orden = orden;
        if (imagen !== undefined) respuesta.imagen = imagen;
        if (multimedia !== undefined) respuesta.multimedia = multimedia;
        if (estado) respuesta.estado = estado;

        await respuesta.save();

        const respuestaActualizada = await Respuesta.findById(id)
            .populate("id_profesor", "nombre email rol");

        res.json({
            success: true,
            message: "Respuesta actualizada correctamente",
            data: respuestaActualizada
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error al actualizar respuesta",
            error: error.message
        });
    }
};

// DELETE - Eliminar respuesta
exports.eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuario.id;

        // Obtener la respuesta
        const respuesta = await Respuesta.findById(id);
        if (!respuesta) {
            return res.status(404).json({
                success: false,
                message: "Respuesta no encontrada"
            });
        }

        // Verificar permisos
        if (respuesta.id_profesor.toString() !== usuarioId && req.usuario.rol !== "ADMINISTRADOR") {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para eliminar esta respuesta"
            });
        }

        await Respuesta.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Respuesta eliminada correctamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar respuesta",
            error: error.message
        });
    }
};

// PUT - Reordenar respuestas de una pregunta
exports.reordenarRespuestas = async (req, res) => {
    try {
        const { id_pregunta } = req.params;
        const { respuestas } = req.body; // Array: [{ id, orden }, ...]
        const usuarioId = req.usuario.id;

        if (!respuestas || !Array.isArray(respuestas)) {
            return res.status(400).json({
                success: false,
                message: "Se requiere un array de respuestas con orden"
            });
        }

        // Verificar que la pregunta existe y pertenece al profesor
        const pregunta = await Pregunta.findById(id_pregunta);
        if (!pregunta) {
            return res.status(404).json({
                success: false,
                message: "Pregunta no encontrada"
            });
        }

        if (pregunta.id_profesor.toString() !== usuarioId && req.usuario.rol !== "ADMINISTRADOR") {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para reordenar respuestas de esta pregunta"
            });
        }

        // Actualizar orden de cada respuesta
        for (const { id, orden } of respuestas) {
            const respuesta = await Respuesta.findById(id);
            if (respuesta && respuesta.id_pregunta.toString() === id_pregunta) {
                respuesta.orden = orden;
                await respuesta.save();
            }
        }

        const respuestasActualizadas = await Respuesta.find({ id_pregunta })
            .sort({ orden: 1 });

        res.json({
            success: true,
            message: "Orden de respuestas actualizado",
            data: respuestasActualizadas
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error al reordenar respuestas",
            error: error.message
        });
    }
};

// GET - Obtener respuesta correcta de una pregunta
exports.obtenerRespuestaCorrecta = async (req, res) => {
    try {
        const { id_pregunta } = req.params;

        const respuestaCorrecta = await Respuesta.findOne({
            id_pregunta,
            es_correcta: true,
            estado: "Activa"
        }).populate("id_profesor", "nombre");

        if (!respuestaCorrecta) {
            return res.status(404).json({
                success: false,
                message: "No hay respuesta correcta para esta pregunta"
            });
        }

        res.json({
            success: true,
            data: respuestaCorrecta
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener respuesta correcta",
            error: error.message
        });
    }
};