const mongoose = require("mongoose");

const preguntaSchema = new mongoose.Schema(
    {
        texto: {
            type: String,
            required: [true, "El texto de la pregunta es requerido"],
            trim: true,
            minlength: [10, "El texto debe tener mínimo 10 caracteres"],
            maxlength: [1000, "El texto no puede exceder 1000 caracteres"]
        },
        tipo: {
            type: String,
            enum: {
                values: ["Selección múltiple", "Respuesta corta", "Dinámica", "Interactiva"],
                message: "{VALUE} no es un tipo válido de pregunta"
            },
            required: [true, "El tipo de pregunta es requerido"]
        },
        estado: {
            type: String,
            enum: {
                values: ["Borrador", "Publicada"],
                message: "{VALUE} no es un estado válido"
            },
            default: "Borrador",
            required: [true, "El estado es requerido"]
        },
        fecha_publicacion: {
            type: Date,
            default: null
        },
        id_profesor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required: [true, "El profesor es requerido"]
        },
        id_categoria: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Categoria",
            required: [true, "La categoría es requerida"]
        },
        id_subcategoria: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subcategoria",
            required: [true, "La subcategoría es requerida"]
        },
        id_rango_edad: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RangoEdad",
            required: [true, "El rango de edad es requerido"]
        },
        id_dificultad: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dificultad",
            required: [true, "La dificultad es requerida"]
        }
    },
    {
        timestamps: true,
        collection: "preguntas"
    }
);

// Validación custom: verificar que el profesor tiene rol PROFESOR
preguntaSchema.pre("save", async function(next) {
    if (this.isModified("id_profesor")) {
        const Usuario = mongoose.model("Usuario");
        const profesor = await Usuario.findById(this.id_profesor);
        
        if (!profesor) {
            return next(new Error("El profesor especificado no existe"));
        }
        
        if (profesor.rol !== "PROFESOR" && profesor.rol !== "ADMINISTRADOR") {
            return next(new Error("El usuario debe tener rol PROFESOR o ADMINISTRADOR"));
        }
    }
    next();
});

// Validación custom: verificar que subcategoría pertenece a categoría
preguntaSchema.pre("save", async function(next) {
    if (this.isModified("id_subcategoria") || this.isModified("id_categoria")) {
        const Subcategoria = mongoose.model("Subcategoria");
        const subcategoria = await Subcategoria.findById(this.id_subcategoria);
        
        if (!subcategoria) {
            return next(new Error("La subcategoría especificada no existe"));
        }
        
        if (subcategoria.id_categoria.toString() !== this.id_categoria.toString()) {
            return next(new Error("La subcategoría no pertenece a la categoría seleccionada"));
        }
    }
    next();
});

// Índices para mejorar rendimiento de consultas
preguntaSchema.index({ id_profesor: 1 });
preguntaSchema.index({ estado: 1 });
preguntaSchema.index({ id_categoria: 1 });
preguntaSchema.index({ id_subcategoria: 1 });
preguntaSchema.index({ id_dificultad: 1 });
preguntaSchema.index({ id_rango_edad: 1 });
preguntaSchema.index({ tipo: 1 });
preguntaSchema.index({ createdAt: -1 });

// Índice compuesto para búsquedas complejas
preguntaSchema.index({ estado: 1, id_categoria: 1, id_dificultad: 1 });
preguntaSchema.index({ id_profesor: 1, estado: 1 });

module.exports = mongoose.model("Pregunta", preguntaSchema);
