const mongoose = require("mongoose");

const dificultadSchema = new mongoose.Schema(
    {
        nivel: {
            type: String,
            enum: ["Fácil", "Intermedio", "Avanzado"],
            required: [true, "El nivel de dificultad es requerido"]
        }
    },
    { 
        timestamps: true,
        collection: 'dificultades'
    }
);

module.exports = mongoose.model("Dificultad", dificultadSchema);