const mongoose = require("mongoose");

const subcategoriaSchema = new mongoose.Schema(
    {
        nombre_subcategoria: {
            type: String,
            required: [true, "El nombre de la subcategoría es requerido"],
            trim: true,
            maxlength: [100, "El nombre no puede exceder 100 caracteres"]
        },
        descripcion: {
            type: String,
            trim: true,
            maxlength: [500, "La descripción no puede exceder 500 caracteres"],
            default: ""
        },
        activo: {
            type: Boolean,
            default: true
        },
        id_categoria: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Categoria',
            required: [true, "La categoría es requerida"]
        }
    },
    { 
        timestamps: true,
        collection: 'subcategorias'
    }
);

// Índice para mejorar consultas por categoría
subcategoriaSchema.index({ id_categoria: 1 });
subcategoriaSchema.index({ activo: 1 });

// Índice compuesto único: nombre_subcategoria + id_categoria
// Esto permite el mismo nombre en diferentes categorías, pero no duplicados en la misma
subcategoriaSchema.index({ nombre_subcategoria: 1, id_categoria: 1 }, { unique: true });

module.exports = mongoose.model("Subcategoria", subcategoriaSchema);
