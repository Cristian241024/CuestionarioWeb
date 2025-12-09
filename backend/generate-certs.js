const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const certsDir = path.join(__dirname, 'certs');

console.log('📦 Instalando node-forge...\n');

try {
  execSync('npm install node-forge --save-dev', { stdio: 'pipe' });
  
  console.log('✅ Instalado\n');
  console.log('🔐 Generando certificados...\n');
  
  const forge = require('node-forge');
  
  if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
  }
  
  const keys = forge.pki.rsa.generateKeyPair(2048);
  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notAfter.getFullYear() + 1);
  
  const attrs = [{ name: 'commonName', value: 'localhost' }];
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.sign(keys.privateKey, forge.md.sha256.create());
  
  const certPem = forge.pki.certificateToPem(cert);
  const keyPem = forge.pki.privateKeyToPem(keys.privateKey);
  
  fs.writeFileSync(path.join(certsDir, 'cert.pem'), certPem);
  fs.writeFileSync(path.join(certsDir, 'key.pem'), keyPem);
  
  console.log('✅ ¡Certificados creados!\n');
  console.log('📄 Archivos:');
  console.log('   - certs/cert.pem');
  console.log('   - certs/key.pem\n');
  console.log('🚀 Ejecuta: npm start\n');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}