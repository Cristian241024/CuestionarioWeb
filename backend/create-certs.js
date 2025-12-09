const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const certsDir = path.join(__dirname, 'certs');

console.log('📦 Instalando paquetes necesarios...\n');

try {
  // Instalar paquetes
  execSync('npm install node-forge --save-dev', { stdio: 'pipe' });
  
  console.log('✅ Paquetes instalados\n');
  console.log('🔐 Generando certificados...\n');
  
  // Usar node-forge para generar certificados
  const forge = require('node-forge');
  
  // Crear carpeta si no existe
  if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
  }
  
  // Generar par de claves
  const keys = forge.pki.rsa.generateKeyPair(2048);
  
  // Crear certificado
  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notAfter.getFullYear() + 1);
  
  const attrs = [
    { name: 'commonName', value: 'localhost' },
    { name: 'organizationName', value: 'Local Dev' }
  ];
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.setExtensions([
    {
      name: 'basicConstraints',
      cA: false
    },
    {
      name: 'keyUsage',
      keyCertSign: false,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    },
    {
      name: 'subjectAltName',
      altNames: [
        { type: 2, value: 'localhost' },
        { type: 7, ip: '127.0.0.1' }
      ]
    }
  ]);
  
  cert.sign(keys.privateKey, forge.md.sha256.create());
  
  // Convertir a PEM
  const certPem = forge.pki.certificateToPem(cert);
  const keyPem = forge.pki.privateKeyToPem(keys.privateKey);
  
  // Guardar archivos
  fs.writeFileSync(path.join(certsDir, 'cert.pem'), certPem);
  fs.writeFileSync(path.join(certsDir, 'key.pem'), keyPem);
  
  console.log('✅ ¡Certificados creados correctamente!\n');
  console.log('📄 Archivos generados:');
  console.log('   ✓ certs/cert.pem (certificado público)');
  console.log('   ✓ certs/key.pem (clave privada)\n');
  console.log('🚀 Ahora ejecuta: npm start\n');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}