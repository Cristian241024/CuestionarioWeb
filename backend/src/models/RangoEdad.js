const mongoose = require("mongoose");

const rangoEdadSchema = new mongoose.Schema(
    {
        descripcion: {
            type: String,
            required: [true, "La descripción es requerida"],
            trim: true
        },
        edadMinima: {
            type: Number,
            required: [true, "La edad mínima es requerida"],
            min: 0
        },
        edadMaxima: {
            type: Number,
            required: [true, "La edad máxima es requerida"],
            min: 0
        }
    },
    { 
        timestamps: true,
        collection: 'rangosedad'
    }
);

module.exports = mongoose.model("RangoEdad", rangoEdadSchema);