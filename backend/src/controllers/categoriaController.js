const Categoria = require("../models/Categoria");
const Subcategoria = require("../models/Subcategoria");

// Obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.json({
            success: true,
            data: categorias
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener categorías",
            error: error.message
        });
    }
};

// Obtener una categoría por ID
exports.obtenerCategoriaPorId = async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({
                success: false,
                message: "Categoría no encontrada"
            });
        }
        res.json({
            success: true,
            data: categoria
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener categoría",
            error: error.message
        });
    }
};

// Obtener subcategorías de una categoría específica
exports.obtenerSubcategoriasPorCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({
                success: false,
                message: "Categoría no encontrada"
            });
        }

        const subcategorias = await Subcategoria.find({ id_categoria: req.params.id });
        res.json({
            success: true,
            data: {
                categoria: categoria,
                subcategorias: subcategorias
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener subcategorías",
            error: error.message
        });
    }
};

// Crear una nueva categoría
exports.crearCategoria = async (req, res) => {
    try {
        const { nombre_categoria, id_usuario } = req.body;

        if (!nombre_categoria) {
            return res.status(400).json({
                success: false,
                message: "El nombre de la categoría es requerido"
            });
        }

        if (!id_usuario) {
            return res.status(400).json({
                success: false,
                message: "El ID de usuario es requerido"
            });
        }

        const nuevaCategoria = new Categoria({
            nombre_categoria,
            id_usuario
        });

        await nuevaCategoria.save();
        res.status(201).json({
            success: true,
            message: "Categoría creada exitosamente",
            data: nuevaCategoria
        });
    } catch (error) {
        // Manejo específico para error de duplicado
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Ya existe una categoría con ese nombre"
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Error al crear categoría",
            error: error.message
        });
    }
};

// Actualizar una categoría
exports.actualizarCategoria = async (req, res) => {
    try {
        const { nombre_categoria, id_usuario } = req.body;

        const categoria = await Categoria.findByIdAndUpdate(
            req.params.id,
            { nombre_categoria, id_usuario },
            { new: true, runValidators: true }
        );

        if (!categoria) {
            return res.status(404).json({
                success: false,
                message: "Categoría no encontrada"
            });
        }

        res.json({
            success: true,
            message: "Categoría actualizada exitosamente",
            data: categoria
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar categoría",
            error: error.message
        });
    }
};

// Eliminar una categoría
exports.eliminarCategoria = async (req, res) => {
    try {
        // Verificar si tiene subcategorías asociadas
        const subcategorias = await Subcategoria.find({ id_categoria: req.params.id });
        
        if (subcategorias.length > 0) {
            return res.status(400).json({
                success: false,
                message: `No se puede eliminar la categoría porque tiene ${subcategorias.length} subcategoría(s) asociada(s)`,
                subcategorias_count: subcategorias.length
            });
        }

        const categoria = await Categoria.findByIdAndDelete(req.params.id);

        if (!categoria) {
            return res.status(404).json({
                success: false,
                message: "Categoría no encontrada"
            });
        }

        res.json({
            success: true,
            message: "Categoría eliminada exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar categoría",
            error: error.message
        });
    }
};
