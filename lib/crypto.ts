import CryptoJS from 'crypto-js';

export const deriveKey = (password: string, salt: string): string => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  }).toString(CryptoJS.enc.Hex);
};

export const encryptData = (data: string, key: string): string => {
  if (data === null || data === undefined) return '';
  return CryptoJS.AES.encrypt(data, key).toString();
};

export const decryptData = (ciphertext: string, key: string): string => {
  if (ciphertext === null || ciphertext === undefined) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed:", error);
    return ''; // Return empty string or handle error appropriately
  }
};