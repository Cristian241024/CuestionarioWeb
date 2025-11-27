const Subcategoria = require("../models/Subcategoria");
const Categoria = require("../models/Categoria");

// Obtener todas las subcategorías
exports.obtenerSubcategorias = async (req, res) => {
    try {
        const { id_categoria, activo } = req.query;
        
        // Construir filtro dinámico
        let filtro = {};
        if (id_categoria) filtro.id_categoria = id_categoria;
        if (activo !== undefined) filtro.activo = activo === 'true';

        const subcategorias = await Subcategoria.find(filtro).populate('id_categoria', 'nombre_categoria');
        res.json({
            success: true,
            data: subcategorias
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener subcategorías",
            error: error.message
        });
    }
};

// Obtener una subcategoría por ID
exports.obtenerSubcategoriaPorId = async (req, res) => {
    try {
        const subcategoria = await Subcategoria.findById(req.params.id).populate('id_categoria', 'nombre_categoria');
        if (!subcategoria) {
            return res.status(404).json({
                success: false,
                message: "Subcategoría no encontrada"
            });
        }
        res.json({
            success: true,
            data: subcategoria
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener subcategoría",
            error: error.message
        });
    }
};

// Crear una nueva subcategoría
exports.crearSubcategoria = async (req, res) => {
    try {
        const { nombre_subcategoria, descripcion, activo, id_categoria } = req.body;

        if (!nombre_subcategoria) {
            return res.status(400).json({
                success: false,
                message: "El nombre de la subcategoría es requerido"
            });
        }

        if (!id_categoria) {
            return res.status(400).json({
                success: false,
                message: "La categoría es requerida"
            });
        }

        // Verificar que la categoría existe
        const categoriaExiste = await Categoria.findById(id_categoria);
        if (!categoriaExiste) {
            return res.status(404).json({
                success: false,
                message: "La categoría especificada no existe"
            });
        }

        const nuevaSubcategoria = new Subcategoria({
            nombre_subcategoria,
            descripcion,
            activo: activo !== undefined ? activo : true,
            id_categoria
        });

        await nuevaSubcategoria.save();
        
        // Poblar la categoría en la respuesta
        await nuevaSubcategoria.populate('id_categoria', 'nombre_categoria');
        
        res.status(201).json({
            success: true,
            message: "Subcategoría creada exitosamente",
            data: nuevaSubcategoria
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear subcategoría",
            error: error.message
        });
    }
};

// Actualizar una subcategoría
exports.actualizarSubcategoria = async (req, res) => {
    try {
        const { nombre_subcategoria, descripcion, activo, id_categoria } = req.body;

        // Si se actualiza la categoría, verificar que existe
        if (id_categoria) {
            const categoriaExiste = await Categoria.findById(id_categoria);
            if (!categoriaExiste) {
                return res.status(404).json({
                    success: false,
                    message: "La categoría especificada no existe"
                });
            }
        }

        const subcategoria = await Subcategoria.findByIdAndUpdate(
            req.params.id,
            { nombre_subcategoria, descripcion, activo, id_categoria },
            { new: true, runValidators: true }
        ).populate('id_categoria', 'nombre_categoria');

        if (!subcategoria) {
            return res.status(404).json({
                success: false,
                message: "Subcategoría no encontrada"
            });
        }

        res.json({
            success: true,
            message: "Subcategoría actualizada exitosamente",
            data: subcategoria
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar subcategoría",
            error: error.message
        });
    }
};

// Activar/Desactivar subcategoría (toggle)
exports.toggleActivoSubcategoria = async (req, res) => {
    try {
        const subcategoria = await Subcategoria.findById(req.params.id);

        if (!subcategoria) {
            return res.status(404).json({
                success: false,
                message: "Subcategoría no encontrada"
            });
        }

        subcategoria.activo = !subcategoria.activo;
        await subcategoria.save();
        await subcategoria.populate('id_categoria', 'nombre_categoria');

        res.json({
            success: true,
            message: `Subcategoría ${subcategoria.activo ? 'activada' : 'desactivada'} exitosamente`,
            data: subcategoria
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al cambiar estado de subcategoría",
            error: error.message
        });
    }
};

// Eliminar una subcategoría
exports.eliminarSubcategoria = async (req, res) => {
    try {
        const subcategoria = await Subcategoria.findByIdAndDelete(req.params.id);

        if (!subcategoria) {
            return res.status(404).json({
                success: false,
                message: "Subcategoría no encontrada"
            });
        }

        res.json({
            success: true,
            message: "Subcategoría eliminada exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar subcategoría",
            error: error.message
        });
    }
};
