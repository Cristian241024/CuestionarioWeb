const RangoEdad = require("../models/RangoEdad");

exports.obtenerRangos = async (req, res) => {
    try {
        const rangos = await RangoEdad.find();
        res.json({
            success: true,
            data: rangos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener rangos de edad",
            error: error.message
        });
    }
};

exports.obtenerRangoPorId = async (req, res) => {
    try {
        const rango = await RangoEdad.findById(req.params.id);
        if (!rango) {
            return res.status(404).json({
                success: false,
                message: "Rango de edad no encontrado"
            });
        }
        res.json({
            success: true,
            data: rango
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener rango",
            error: error.message
        });
    }
};

exports.crearRango = async (req, res) => {
    try {
        const { descripcion, edadMinima, edadMaxima } = req.body;

        if (!descripcion || edadMinima === undefined || edadMaxima === undefined) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son requeridos"
            });
        }

        if (edadMinima > edadMaxima) {
            return res.status(400).json({
                success: false,
                message: "La edad mínima no puede ser mayor a la edad máxima"
            });
        }

        const duplicado = await RangoEdad.findOne({
            edadMinima,
            edadMaxima
        });

        if (duplicado) {
            return res.status(400).json({
                success: false,
                message: "Este rango de edad ya existe"
            });
        }

        const solapado = await RangoEdad.findOne({
            $or: [
                {
                    edadMinima: { $lte: edadMaxima },
                    edadMaxima: { $gte: edadMinima }
                }
            ]
        });

        if (solapado) {
            return res.status(400).json({
                success: false,
                message: `El rango se solapa con el existente: ${solapado.edadMinima}-${solapado.edadMaxima}`
            });
        }

        const nuevoRango = new RangoEdad({
            descripcion,
            edadMinima,
            edadMaxima
        });

        await nuevoRango.save();

        res.status(201).json({
            success: true,
            message: "Rango de edad creado exitosamente",
            data: nuevoRango
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear rango",
            error: error.message
        });
    }
};

exports.actualizarRango = async (req, res) => {
    try {
        const { descripcion, edadMinima, edadMaxima } = req.body;

        if (edadMinima && edadMaxima && edadMinima > edadMaxima) {
            return res.status(400).json({
                success: false,
                message: "La edad mínima no puede ser mayor a la edad máxima"
            });
        }

        const rango = await RangoEdad.findByIdAndUpdate(
            req.params.id,
            { descripcion, edadMinima, edadMaxima },
            { new: true, runValidators: true }
        );

        if (!rango) {
            return res.status(404).json({
                success: false,
                message: "Rango de edad no encontrado"
            });
        }

        res.json({
            success: true,
            message: "Rango de edad actualizado exitosamente",
            data: rango
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar rango",
            error: error.message
        });
    }
};

exports.eliminarRango = async (req, res) => {
    try {
        const rango = await RangoEdad.findByIdAndDelete(req.params.id);

        if (!rango) {
            return res.status(404).json({
                success: false,
                message: "Rango de edad no encontrado"
            });
        }

        res.json({
            success: true,
            message: "Rango de edad eliminado exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar rango",
            error: error.message
        });
    }
};