const mongoose = require("mongoose");

const respuestaSchema = new mongoose.Schema(
    {
        texto: {
            type: String,
            required: [true, "El texto de la respuesta es requerido"],
            trim: true,
            minlength: [5, "El texto debe tener mínimo 5 caracteres"],
            maxlength: [2000, "El texto no puede exceder 2000 caracteres"]
        },
        es_correcta: {
            type: Boolean,
            required: [true, "Debe especificar si la respuesta es correcta"],
            default: false
        },
        explicacion: {
            type: String,
            trim: true,
            maxlength: [1000, "La explicación no puede exceder 1000 caracteres"],
            default: ""
        },
        id_pregunta: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pregunta",
            required: [true, "La pregunta es requerida"]
        },
        id_profesor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required: [true, "El profesor es requerido"]
        },
        orden: {
            type: Number,
            default: 0,
            description: "Orden de visualización de las respuestas"
        },
        estado: {
            type: String,
            enum: {
                values: ["Activa", "Inactiva"],
                message: "{VALUE} no es un estado válido"
            },
            default: "Activa",
            required: [true, "El estado es requerido"]
        },
        imagen: {
            type: String,
            default: null,
            description: "URL de imagen asociada a la respuesta (para respuestas visuales)"
        },
        multimedia: {
            type: String,
            default: null,
            description: "URL de archivo multimedia (audio, video)"
        }
    },
    {
        timestamps: true,
        collection: "respuestas"
    }
);

// Validación custom: verificar que el profesor existe y tiene rol correcto
respuestaSchema.pre("save", async function(next) {
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

// Validación custom: verificar que la pregunta existe
respuestaSchema.pre("save", async function(next) {
    if (this.isModified("id_pregunta")) {
        const Pregunta = mongoose.model("Pregunta");
        const pregunta = await Pregunta.findById(this.id_pregunta);
        
        if (!pregunta) {
            return next(new Error("La pregunta especificada no existe"));
        }
    }
    next();
});

// Validación custom: asegurar que solo una respuesta sea correcta en selección múltiple
respuestaSchema.pre("save", async function(next) {
    if (this.isModified("es_correcta") && this.es_correcta) {
        const Pregunta = mongoose.model("Pregunta");
        const pregunta = await Pregunta.findById(this.id_pregunta);
        
        if (pregunta && pregunta.tipo === "Selección múltiple") {
            const respuestasCorrectas = await mongoose.model("Respuesta").countDocuments({
                id_pregunta: this.id_pregunta,
                es_correcta: true,
                _id: { $ne: this._id }
            });
            
            if (respuestasCorrectas > 0) {
                return next(new Error("Ya existe una respuesta correcta para esta pregunta de selección múltiple"));
            }
        }
    }
    next();
});

// Índices para mejorar rendimiento de consultas
respuestaSchema.index({ id_pregunta: 1 });
respuestaSchema.index({ id_profesor: 1 });
respuestaSchema.index({ estado: 1 });
respuestaSchema.index({ es_correcta: 1 });
respuestaSchema.index({ createdAt: -1 });

// Índices compuestos para búsquedas complejas
respuestaSchema.index({ id_pregunta: 1, estado: 1 });
respuestaSchema.index({ id_profesor: 1, estado: 1 });
respuestaSchema.index({ id_pregunta: 1, es_correcta: 1 });

module.exports = mongoose.model("Respuesta", respuestaSchema);