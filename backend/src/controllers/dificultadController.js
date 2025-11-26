const Dificultad = require("../models/Dificultad");

// Obtener todas las dificultades
exports.obtenerDificultades = async (req, res) => {
    try {
        const dificultades = await Dificultad.find();
        res.json({
            success: true,
            data: dificultades
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener dificultades",
            error: error.message
        });
    }
};

// Obtener una dificultad por ID
exports.obtenerDificultadPorId = async (req, res) => {
    try {
        const dificultad = await Dificultad.findById(req.params.id);
        if (!dificultad) {
            return res.status(404).json({
                success: false,
                message: "Dificultad no encontrada"
            });
        }
        res.json({
            success: true,
            data: dificultad
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener dificultad",
            error: error.message
        });
    }
};

// Crear una nueva dificultad
exports.crearDificultad = async (req, res) => {
    try {
        const { nivel } = req.body;

        if (!nivel) {
            return res.status(400).json({
                success: false,
                message: "El nivel es requerido"
            });
        }

        // Validar que sea uno de los valores permitidos
        if (!["Fácil", "Intermedio", "Avanzado"].includes(nivel)) {
            return res.status(400).json({
                success: false,
                message: "El nivel debe ser: Fácil, Intermedio o Avanzado"
            });
        }

        const nuevaDificultad = new Dificultad({
            nivel
        });

        await nuevaDificultad.save();
        res.status(201).json({
            success: true,
            message: "Dificultad creada exitosamente",
            data: nuevaDificultad
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear dificultad",
            error: error.message
        });
    }
};

// Actualizar una dificultad
exports.actualizarDificultad = async (req, res) => {
    try {
        const { nivel } = req.body;

        if (nivel && !["Fácil", "Intermedio", "Avanzado"].includes(nivel)) {
            return res.status(400).json({
                success: false,
                message: "El nivel debe ser: Fácil, Intermedio o Avanzado"
            });
        }

        const dificultad = await Dificultad.findByIdAndUpdate(
            req.params.id,
            { nivel },
            { new: true, runValidators: true }
        );

        if (!dificultad) {
            return res.status(404).json({
                success: false,
                message: "Dificultad no encontrada"
            });
        }

        res.json({
            success: true,
            message: "Dificultad actualizada exitosamente",
            data: dificultad
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar dificultad",
            error: error.message
        });
    }
};

// Eliminar una dificultad
exports.eliminarDificultad = async (req, res) => {
    try {
        const dificultad = await Dificultad.findByIdAndDelete(req.params.id);

        if (!dificultad) {
            return res.status(404).json({
                success: false,
                message: "Dificultad no encontrada"
            });
        }

        res.json({
            success: true,
            message: "Dificultad eliminada exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar dificultad",
            error: error.message
        });
    }
};