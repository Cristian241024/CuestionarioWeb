const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

// Middleware para verificar JWT
exports.verificarToken = async (req, res, next) => {
    try {
        // Obtener token del header
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token no proporcionado"
            });
        }

        // Verificar y decodificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Obtener usuario del token
        const usuario = await Usuario.findById(decoded.id);
        
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        // Agregar usuario al request
        req.usuario = usuario;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token inválido o expirado",
            error: error.message
        });
    }
};

// Middleware para verificar rol ADMINISTRADOR
exports.verificarAdmin = (req, res, next) => {
    if (req.usuario.rol !== "ADMINISTRADOR") {
        return res.status(403).json({
            success: false,
            message: "Acceso denegado. Solo administradores"
        });
    }
    next();
};

// Middleware para verificar rol PROFESOR
exports.verificarProfesor = (req, res, next) => {
    if (req.usuario.rol !== "PROFESOR") {
        return res.status(403).json({
            success: false,
            message: "Acceso denegado. Solo profesores"
        });
    }
    next();
};