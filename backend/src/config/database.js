const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(" Base de datos conectada");
    } catch (error) {
        console.log(" Error de conexion de BD", error);
        process.exit(1);
    }
};

module.exports = connectDB;
