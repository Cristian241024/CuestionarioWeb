const Examen = require('../models/Examen');
const ExamenPregunta = require('../models/ExamenPregunta');
const Pregunta = require('../models/Pregunta');
const Ciclo = require('../models/Ciclo');

// ========================================
// CREAR EXAMEN (solo PROFESOR)
// ========================================
exports.crearExamen = async (req, res) => {
    try {
        const { titulo, descripcion, preguntas, duracion, ciclo } = req.body;
        
        // Validaciones básicas
        if (!titulo || !ciclo) {
            return res.status(400).json({
                success: false,
                message: 'El título y ciclo son obligatorios'
            });
        }

        // Verificar que el ciclo existe y está activo
        const cicloExiste = await Ciclo.findById(ciclo);
        if (!cicloExiste || !cicloExiste.activo) {
            return res.status(400).json({
                success: false,
                message: 'El ciclo especificado no existe o no está activo'
            });
        }

        // Verificar que las preguntas existan y estén publicadas
        if (preguntas && preguntas.length > 0) {
            const preguntasExistentes = await Pregunta.find({
                _id: { $in: preguntas },
                estado: "Publicada" // Solo preguntas publicadas
            });
            
            if (preguntasExistentes.length !== preguntas.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Algunas preguntas no existen o no están publicadas'
                });
            }
        }

        // Crear el examen
        const examen = new Examen({
            titulo,
            descripcion: descripcion || '',
            profesor: req.usuario._id,
            ciclo,
            preguntas: preguntas || [],
            duracion: duracion || 60,
            activo: true
        });

        await examen.save();

        // Si hay preguntas, crear relaciones en ExamenPregunta
        if (preguntas && preguntas.length > 0) {
            const relaciones = preguntas.map((preguntaId, index) => ({
                examen: examen._id,
                pregunta: preguntaId,
                orden: index + 1
            }));
            
            await ExamenPregunta.insertMany(relaciones);
        }

        // Poblar las referencias
        await examen.populate('profesor', 'nombre email');
        await examen.populate('ciclo', 'nombre fecha_inicio fecha_fin');
        await examen.populate('preguntas', 'texto tipo estado');

        res.status(201).json({
            success: true,
            message: 'Examen creado exitosamente',
            data: examen
        });
    } catch (error) {
        console.error('Error al crear examen:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el examen',
            error: error.message
        });
    }
};

// ========================================
// OBTENER TODOS LOS EXÁMENES
// ========================================
exports.obtenerExamenes = async (req, res) => {
    try {
        let filtro = { activo: true };
        
        // PROFESOR solo ve sus exámenes, ADMINISTRADOR ve todos
        if (req.usuario.rol === 'PROFESOR') {
            filtro.profesor = req.usuario._id;
        }

        const examenes = await Examen.find(filtro)
            .populate('profesor', 'nombre email')
            .populate('ciclo', 'nombre fecha_inicio fecha_fin activo')
            .populate('preguntas', 'texto tipo estado')
            .sort({ fechaCreacion: -1 });

        res.json({
            success: true,
            count: examenes.length,
            data: examenes
        });
    } catch (error) {
        console.error('Error al obtener exámenes:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener exámenes',
            error: error.message
        });
    }
};

// ========================================
// OBTENER EXAMEN POR ID
// ========================================
exports.obtenerExamen = async (req, res) => {
    try {
        const { id } = req.params;
        
        const examen = await Examen.findById(id)
            .populate('profesor', 'nombre email')
            .populate('ciclo', 'nombre fecha_inicio fecha_fin activo')
            .populate({
                path: 'preguntas',
                populate: [
                    { path: 'id_categoria', select: 'nombre_categoria' },
                    { path: 'id_subcategoria', select: 'nombre_subcategoria' },
                    { path: 'id_dificultad', select: 'nivel' }
                ]
            });

        if (!examen || !examen.activo) {
            return res.status(404).json({
                success: false,
                message: 'Examen no encontrado'
            });
        }

        // Verificar permisos: PROFESOR solo puede ver sus exámenes
        if (req.usuario.rol === 'PROFESOR' && 
            examen.profesor._id.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para ver este examen'
            });
        }

        // Obtener el orden de las preguntas
        const examenPreguntas = await ExamenPregunta.find({ examen: examen._id })
            .populate('pregunta')
            .sort({ orden: 1 });

        res.json({
            success: true,
            data: {
                ...examen.toObject(),
                preguntasOrdenadas: examenPreguntas
            }
        });
    } catch (error) {
        console.error('Error al obtener examen:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el examen',
            error: error.message
        });
    }
};

// ========================================
// ACTUALIZAR EXAMEN
// ========================================
exports.actualizarExamen = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, preguntas, duracion } = req.body;
        
        const examen = await Examen.findById(id);
        
        if (!examen || !examen.activo) {
            return res.status(404).json({
                success: false,
                message: 'Examen no encontrado'
            });
        }

        // Solo el PROFESOR creador puede actualizar
        if (examen.profesor.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para actualizar este examen'
            });
        }

        // Actualizar campos básicos
        if (titulo) examen.titulo = titulo;
        if (descripcion !== undefined) examen.descripcion = descripcion;
        if (duracion) examen.duracion = duracion;
        
        // Si se actualizan las preguntas
        if (preguntas !== undefined) {
            // Verificar que todas las preguntas estén publicadas
            const preguntasExistentes = await Pregunta.find({
                _id: { $in: preguntas },
                estado: "Publicada"
            });
            
            if (preguntasExistentes.length !== preguntas.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Algunas preguntas no existen o no están publicadas'
                });
            }

            // Eliminar relaciones anteriores
            await ExamenPregunta.deleteMany({ examen: examen._id });
            
            // Crear nuevas relaciones
            if (preguntas.length > 0) {
                const relaciones = preguntas.map((preguntaId, index) => ({
                    examen: examen._id,
                    pregunta: preguntaId,
                    orden: index + 1
                }));
                
                await ExamenPregunta.insertMany(relaciones);
                examen.preguntas = preguntas;
            } else {
                examen.preguntas = [];
            }
        }

        examen.fechaActualizacion = Date.now();
        await examen.save();

        // Poblar referencias
        await examen.populate('profesor', 'nombre email');
        await examen.populate('ciclo', 'nombre fecha_inicio fecha_fin');
        await examen.populate('preguntas', 'texto tipo estado');

        res.json({
            success: true,
            message: 'Examen actualizado exitosamente',
            data: examen
        });
    } catch (error) {
        console.error('Error al actualizar examen:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el examen',
            error: error.message
        });
    }
};

// ========================================
// ELIMINAR EXAMEN (soft delete)
// ========================================
exports.eliminarExamen = async (req, res) => {
    try {
        const { id } = req.params;
        
        const examen = await Examen.findById(id);
        
        if (!examen) {
            return res.status(404).json({
                success: false,
                message: 'Examen no encontrado'
            });
        }

        // Solo el PROFESOR creador puede eliminar
        if (examen.profesor.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para eliminar este examen'
            });
        }

        // Soft delete
        examen.activo = false;
        await examen.save();

        res.json({
            success: true,
            message: 'Examen eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar examen:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el examen',
            error: error.message
        });
    }
};

// ========================================
// AGREGAR PREGUNTA A EXAMEN
// ========================================
exports.agregarPregunta = async (req, res) => {
    try {
        const { id } = req.params;
        const { preguntaId } = req.body;
        
        if (!preguntaId) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la pregunta es requerido'
            });
        }

        const examen = await Examen.findById(id);
        
        if (!examen || !examen.activo) {
            return res.status(404).json({
                success: false,
                message: 'Examen no encontrado'
            });
        }

        // Verificar permisos
        if (examen.profesor.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para modificar este examen'
            });
        }

        // Verificar que la pregunta existe y está publicada
        const pregunta = await Pregunta.findById(preguntaId);
        if (!pregunta || pregunta.estado !== "Publicada") {
            return res.status(404).json({
                success: false,
                message: 'Pregunta no encontrada o no está publicada'
            });
        }

        // Verificar si ya existe la relación
        const existeRelacion = await ExamenPregunta.findOne({
            examen: examen._id,
            pregunta: preguntaId
        });

        if (existeRelacion) {
            return res.status(400).json({
                success: false,
                message: 'La pregunta ya está en el examen'
            });
        }

        // Crear relación
        const relacion = new ExamenPregunta({
            examen: examen._id,
            pregunta: preguntaId,
            orden: examen.preguntas.length + 1
        });

        await relacion.save();

        // Agregar pregunta al examen
        examen.preguntas.push(preguntaId);
        await examen.save();

        res.json({
            success: true,
            message: 'Pregunta agregada al examen exitosamente'
        });
    } catch (error) {
        console.error('Error al agregar pregunta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al agregar pregunta',
            error: error.message
        });
    }
};

// ========================================
// ELIMINAR PREGUNTA DE EXAMEN
// ========================================
exports.eliminarPregunta = async (req, res) => {
    try {
        const { id, preguntaId } = req.params;
        
        const examen = await Examen.findById(id);
        
        if (!examen || !examen.activo) {
            return res.status(404).json({
                success: false,
                message: 'Examen no encontrado'
            });
        }

        // Verificar permisos
        if (examen.profesor.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para modificar este examen'
            });
        }

        // Eliminar relación
        const relacionEliminada = await ExamenPregunta.findOneAndDelete({
            examen: examen._id,
            pregunta: preguntaId
        });

        if (!relacionEliminada) {
            return res.status(404).json({
                success: false,
                message: 'La pregunta no está en este examen'
            });
        }

        // Eliminar pregunta del array
        examen.preguntas = examen.preguntas.filter(
            pregunta => pregunta.toString() !== preguntaId
        );
        
        await examen.save();

        // Reordenar las preguntas restantes
        const preguntasRestantes = await ExamenPregunta.find({ examen: examen._id })
            .sort({ orden: 1 });
        
        for (let i = 0; i < preguntasRestantes.length; i++) {
            preguntasRestantes[i].orden = i + 1;
            await preguntasRestantes[i].save();
        }

        res.json({
            success: true,
            message: 'Pregunta eliminada del examen exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar pregunta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar pregunta',
            error: error.message
        });
    }
};