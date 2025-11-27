const mongoose = require("mongoose");

const categoriaSchema = new mongoose.Schema(
    {
        nombre_categoria: {
            type: String,
            required: [true, "El nombre de la categoría es requerido"],
            trim: true,
            maxlength: [100, "El nombre no puede exceder 100 caracteres"]
        },
        id_usuario: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "El ID de usuario es requerido"],
            // Mock: sin ref a modelo Usuario (aún no existe)
        }
    },
    { 
        timestamps: true,
        collection: 'categorias',
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual para obtener subcategorías de esta categoría
categoriaSchema.virtual('subcategorias', {
    ref: 'Subcategoria',
    localField: '_id',
    foreignField: 'id_categoria'
});

module.exports = mongoose.model("Categoria", categoriaSchema);
