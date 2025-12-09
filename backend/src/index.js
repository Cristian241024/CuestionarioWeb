require('dotenv').config();
const app = require('./app');
const https = require('https');
const http = require('http');
const spdy = require('spdy');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4000;
const HTTPS_PORT = process.env.HTTPS_PORT || 4443;

// Configuración para HTTPS/HTTP2
const getSSLOptions = () => {
  const certPath = path.join(__dirname, '../certs/cert.pem');
  const keyPath = path.join(__dirname, '../certs/key.pem');

  if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
    console.warn('⚠️  Certificados SSL no encontrados');
    console.warn('    Ruta esperada:', certPath);
    console.warn('    Ejecuta: node generate-certs.js');
    return null;
  }

  try {
    return {
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath)
    };
  } catch (error) {
    console.error('❌ Error al leer certificados:', error.message);
    return null;
  }
};

// Middleware para detectar protocolo
app.use((req, res, next) => {
  const protocol = req.httpVersion;
  res.setHeader('X-Protocol', protocol);
  next();
});

// Iniciar servidores
const sslOptions = getSSLOptions();

// Servidor HTTP (redirigir a HTTPS)
http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(PORT, () => {
  console.log(`🚀 Servidor HTTP corriendo en http://localhost:${PORT}`);
  console.log(`   ➜ Redirige automáticamente a HTTPS\n`);
});

// Servidor HTTPS/HTTP2
if (sslOptions) {
  try {
    // Usar SPDY para HTTP/2
    const server = spdy.createServer(
      {
        key: sslOptions.key,
        cert: sslOptions.cert,
        protocols: ['h2', 'http/1.1'] // Soportar HTTP/2 y HTTP/1.1
      },
      app
    );

    server.listen(HTTPS_PORT, () => {
      console.log(`🔒 Servidor HTTPS/HTTP2 corriendo en https://localhost:${HTTPS_PORT}`);
      console.log('   ✓ HTTP/2 habilitado');
      console.log('   ✓ Certificados cargados\n');
    });

  } catch (error) {
    console.error('❌ Error al crear servidor HTTP/2:', error.message);
    console.log('⚠️  Usando HTTPS estándar sin HTTP/2\n');

    // Fallback a HTTPS estándar
    https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
      console.log(`🔒 Servidor HTTPS corriendo en https://localhost:${HTTPS_PORT}`);
    });
  }
} else {
  console.warn('⚠️  HTTPS/HTTP2 no disponible - solo HTTP activo');
}