const Usuario = require("../models/Usuario");

// Registro de usuario (solo ADMIN puede registrar)
exports.registro = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Validar que el rol sea válido
        if (!["ADMINISTRADOR", "PROFESOR", "ESTUDIANTE"].includes(rol)) {
            return res.status(400).json({
                success: false,
                message: "Rol inválido"
            });
        }

        // Verificar si el email ya existe
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({
                success: false,
                message: "El email ya está registrado"
            });
        }

        // Crear nuevo usuario
        const nuevoUsuario = new Usuario({
            nombre,
            email,
            password,
            rol
        });

        await nuevoUsuario.save();

        // Generar token
        const token = nuevoUsuario.generarToken();

        res.status(201).json({
            success: true,
            message: "Usuario registrado exitosamente",
            token,
            usuario: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al registrar usuario",
            error: error.message
        });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email y contraseña requeridos"
            });
        }

        // Buscar usuario y incluir password
        const usuario = await Usuario.findOne({ email }).select("+password");

        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: "Credenciales inválidas"
            });
        }

        // Comparar contraseñas
        const passwordValido = await usuario.compararPassword(password);

        if (!passwordValido) {
            return res.status(401).json({
                success: false,
                message: "Credenciales inválidas"
            });
        }

        // Generar token
        const token = usuario.generarToken();

        res.json({
            success: true,
            message: "Login exitoso",
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al iniciar sesión",
            error: error.message
        });
    }
};

// Obtener perfil del usuario autenticado
exports.miPerfil = async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                id: req.usuario._id,
                nombre: req.usuario.nombre,
                email: req.usuario.email,
                rol: req.usuario.rol,
                createdAt: req.usuario.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener perfil",
            error: error.message
        });
    }
};
