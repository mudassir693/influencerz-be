import * as Crypto from 'crypto';

export async function CryptoEncryption(text: string){
    const key = await deriveKey();
    const iv = Crypto.randomBytes(16); // Generate a random initialization vector
    const cipher = Crypto.createCipheriv('aes-256-cbc', key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
} 

export async function CryptoDecryption(cipherText: string) {
    const [ivHex, encryptedTextHex] = cipherText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedTextHex, 'hex');
    const key = await deriveKey();
    const decipher = Crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString()
  }

  async function deriveKey(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      Crypto.pbkdf2(process.env.CRYPTO_PASSWORD, process.env.CRYPTO_SECRET, 100000, 32, 'sha256', (err, derivedKey) => {
        if (err) {
          reject(err);
        } else {
          resolve(derivedKey);
        }
      });
    });
  }