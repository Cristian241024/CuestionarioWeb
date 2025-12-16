const mongoose = require("mongoose");

const examenSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: [true, "El título es requerido"],
            trim: true
        },
        descripcion: {
            type: String,
            trim: true
        },
        profesor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required: [true, "El profesor es requerido"]
        },
        preguntas: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pregunta"
        }],
        duracion: {
            type: Number, // en minutos
            min: 1
        },
        fechaCreacion: {
            type: Date,
            default: Date.now
        },
        fechaActualizacion: {
            type: Date,
            default: Date.now
        },
        ciclo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ciclo",
            required: [true, "El ciclo es requerido"]  
        },
        activo: {
            type: Boolean,
            default: true
        }
    },
    { 
        timestamps: true,
        collection: 'examenes'
    }
);

// Actualizar fechaActualizacion antes de guardar
examenSchema.pre('save', function(next) {
    this.fechaActualizacion = Date.now();
    next();
});

module.exports = mongoose.model("Examen", examenSchema);