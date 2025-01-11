import * as Crypto from 'crypto';

export async function encryptText(text: string) {
    const key = await generateEncryptionKey();
    const iv = Crypto.randomBytes(16);  
    const cipher = Crypto.createCipheriv('aes-256-cbc', key, iv);
    const encryptedData = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return `${iv.toString('hex')}:${encryptedData.toString('hex')}`;
}

export async function decryptText(cipherText: string) {
    const [ivHex, encryptedTextHex] = cipherText.split(':');
    const iv = Buffer.from(ivHex, 'hex'); 
    const encryptedText = Buffer.from(encryptedTextHex, 'hex');  
    const key = await generateEncryptionKey();
    const decipher = Crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decryptedData = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decryptedData.toString(); 
}


async function generateEncryptionKey(): Promise<Buffer> {
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

