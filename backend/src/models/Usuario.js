const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const usuarioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, "El nombre es requerido"],
            trim: true,
            minlength: [3, "El nombre debe tener mínimo 3 caracteres"],
            maxlength: [50, "El nombre no puede exceder 50 caracteres"]
        },
        email: {
            type: String,
            required: [true, "El email es requerido"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: function(v) {
                    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
                },
                message: "Email inválido"
            }
        },
        password: {
            type: String,
            required: [true, "La contraseña es requerida"],
            minlength: [6, "La contraseña debe tener mínimo 6 caracteres"],
            maxlength:[50,"La contraseña no debe exceder 50 caracteres"],
            select: false  // No incluir en queries por defecto
        },
        rol: {
            type: String,
            enum: {
                values: ["ADMINISTRADOR", "PROFESOR", "ESTUDIANTE"],
                message: "{VALUE} no es un rol válido"
            },
            default: "ESTUDIANTE",
            required: [true, "El rol es requerido"]
        }
    },
    {
        timestamps: true,
        collection: "usuarios"
    }
);

// Middleware pre-save: Encriptar contraseña antes de guardar
usuarioSchema.pre("save", async function(next) {
    // Solo encriptar si la contraseña fue modificada o es nueva
    if (!this.isModified("password")) {
        return next();
    }

    try {
        // Generar salt y encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
usuarioSchema.methods.compararPassword = async function(passwordIngresado) {
    try {
        return await bcrypt.compare(passwordIngresado, this.password);
    } catch (error) {
        throw new Error("Error al comparar contraseñas");
    }
};

// Método para generar JWT (placeholder para Etapa 2)
usuarioSchema.methods.compararPassword = async function(passwordIngresado) {
    return await bcrypt.compare(passwordIngresado, this.password);
};
// La Persona 2 implementará este método cuando agregue JWT
usuarioSchema.methods.generarToken = function() {
    return jwt.sign(
        { 
            id: this._id, 
            email: this.email, 
            rol: this.rol 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Índices para mejorar consultas
usuarioSchema.index({ email: 1 });
usuarioSchema.index({ rol: 1 });

module.exports = mongoose.model("Usuario", usuarioSchema);
