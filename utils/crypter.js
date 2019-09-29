/**
 * Created by wolle on 7/11/16.
 */

const crypto = require('crypto');

const crypter = {
  getSalt: () => new Promise((resolve, reject) => {
    crypto.randomBytes(512, (err, buf) => {
      if (err) {
        return reject(err);
      }
      const salt = buf.toString('base64');
      resolve(salt);
    });
  }),

  encrypt: (text, salt, iteration = 10000) => new Promise((resolve, reject) => {
    crypto.pbkdf2(text, salt, iteration, 512, 'sha512', (err, key) => {
      if (err) return reject(err);
      const skey = key.toString('base64');
      return resolve(skey);
    });
  }),

  encryptPassword: async (password, iteration = 100000) => {
    try {
      const salt = await Crypter.getSalt();
      const key = await Crypter.encrypt(password, salt, iteration);
      const keymap = `${salt}::${key}::${iteration}`;
      return Promise.resolve(keymap);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  isPasswordValid: async (password, encrypted) => {
    const ingredients = encrypted.split('::');
    if (ingredients.length !== 3) throw new Error('Encrypted has no valid schema');
    const [salt, saved, iteration] = ingredients;
    const generated = await Crypter.encrypt(password, salt, iteration);
    if (generated === saved) {
      return true;
    }
    return false;
  },
};

module.exports = crypter;
