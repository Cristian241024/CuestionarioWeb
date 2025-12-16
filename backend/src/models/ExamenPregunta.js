const mongoose = require("mongoose");

const examenPreguntaSchema = new mongoose.Schema(
    {
        examen: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Examen",
            required: true
        },
        pregunta: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pregunta",
            required: true
        },
        orden: {
            type: Number,
            default: 0
        },
        puntos: {
            type: Number,
            default: 1,
            min: 0
        }
    },
    { 
        timestamps: true,
        collection: 'examenpreguntas'
    }
);

// Índice compuesto para evitar duplicados
examenPreguntaSchema.index({ examen: 1, pregunta: 1 }, { unique: true });

module.exports = mongoose.model("ExamenPregunta", examenPreguntaSchema);