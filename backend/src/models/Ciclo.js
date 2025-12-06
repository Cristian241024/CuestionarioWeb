const mongoose = require("mongoose");

const cicloSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, "El nombre del ciclo es requerido"],
            unique: true,
            trim: true,
            minlength: [3, "El nombre debe tener mínimo 3 caracteres"],
            maxlength: [100, "El nombre no puede exceder 100 caracteres"]
        },
        fecha_inicio: {
            type: Date,
            required: [true, "La fecha de inicio es requerida"]
        },
        fecha_fin: {
            type: Date,
            required: [true, "La fecha de fin es requerida"]
        },
        id_admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required: [true, "El administrador es requerido"]
        },
        activo: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        collection: "ciclos"
    }
);

// Validación custom: fecha_fin debe ser mayor a fecha_inicio
cicloSchema.pre("save", function(next) {
    if (this.fecha_fin <= this.fecha_inicio) {
        return next(new Error("La fecha de fin debe ser mayor a la fecha de inicio"));
    }
    next();
});

// Validación custom: verificar que el admin tiene rol ADMINISTRADOR
cicloSchema.pre("save", async function(next) {
    if (this.isModified("id_admin")) {
        const Usuario = mongoose.model("Usuario");
        const admin = await Usuario.findById(this.id_admin);
        
        if (!admin) {
            return next(new Error("El administrador especificado no existe"));
        }
        
        if (admin.rol !== "ADMINISTRADOR") {
            return next(new Error("El usuario debe tener rol ADMINISTRADOR"));
        }
    }
    next();
});

// Índices para mejorar rendimiento de consultas
cicloSchema.index({ nombre: 1 }, { unique: true });
cicloSchema.index({ id_admin: 1 });
cicloSchema.index({ activo: 1 });
cicloSchema.index({ fecha_inicio: 1 });
cicloSchema.index({ fecha_fin: 1 });

// Índice compuesto para búsquedas complejas
cicloSchema.index({ activo: 1, fecha_inicio: 1, fecha_fin: 1 });

// Método virtual para calcular el estado del ciclo
cicloSchema.virtual('estado').get(function() {
    const ahora = new Date();
    
    if (!this.activo) {
        return 'Inactivo';
    }
    
    if (ahora < this.fecha_inicio) {
        return 'Próximo';
    }
    
    if (ahora >= this.fecha_inicio && ahora <= this.fecha_fin) {
        return 'Vigente';
    }
    
    return 'Finalizado';
});

// Incluir virtuals en JSON
cicloSchema.set('toJSON', { virtuals: true });
cicloSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Ciclo", cicloSchema);
