const crypto = require('crypto');

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

// Export keys in DER format
const publicKeyDER = publicKey.export({ type: 'spki', format: 'der' });
const privateKeyDER = privateKey.export({ type: 'pkcs8', format: 'der' });

console.log('Public Key (DER format):', publicKeyDER.toString('hex'));
console.log('Private Key (DER format):', privateKeyDER.toString('hex'));

const publicKeyObj = crypto.createPublicKey({ key: publicKeyDER, format: 'der', type: 'spki' });
const privateKeyObj = crypto.createPrivateKey({ key: privateKeyDER, format: 'der', type: 'pkcs8' });

// Example message to encrypt
const message = 'Hello, RSA with DER!';

// Encrypt the message using the public key in DER format
const encryptedMessage = crypto.publicEncrypt(publicKeyObj, Buffer.from(message));

console.log('Encrypted Message:', encryptedMessage.toString('hex'));

// Decrypt the message using the private key in DER format
const decryptedMessage = crypto.privateDecrypt(privateKeyObj, encryptedMessage);

console.log('Decrypted Message:', decryptedMessage.toString('utf8'));
