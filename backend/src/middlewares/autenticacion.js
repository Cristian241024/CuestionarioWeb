const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

// Middleware para verificar JWT
exports.verificarToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token no proporcionado"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findById(decoded.id);
        
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

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

// NUEVO: Solo ADMIN puede registrar usuarios
exports.soloAdminRegistra = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        // Si no hay token, es el primer registro (primer admin)
        if (!token) {
            // Verificar si ya existen usuarios en la BD
            const usuariosExistentes = await Usuario.findOne();
            if (usuariosExistentes) {
                return res.status(403).json({
                    success: false,
                    message: "Solo el ADMIN puede registrar nuevos usuarios. Contacta al administrador."
                });
            }
            // Es el primer usuario, permitir
            return next();
        }

        // Si hay token, verificar que es ADMIN
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findById(decoded.id);
        
        if (usuario.rol !== "ADMINISTRADOR") {
            return res.status(403).json({
                success: false,
                message: "Acceso denegado. Solo administradores pueden registrar usuarios"
            });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Acceso denegado",
            error: error.message
        });
    }
};