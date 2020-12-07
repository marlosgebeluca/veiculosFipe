const crypto = require("crypto");
const config = require('../../conf_files/config.json');

const DADOS_CRIPTOGRAFAR = {
    algoritmo: config.auth['algoritmo'],
    codificacao: config.auth['codificacao'],
    segredo: config.auth['segredo'],
    tipo: config.auth['tipo']
};

/**
 * @method _encryptPassword
 * 
 * @param {*} password senha do usuário sem criptografia
 * 
 * @returns senha do usuário criptografada
 */

let _encryptPassword = async (password) => {
    return new Promise((resolve, reject) => {
        let cipher = crypto.createCipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
        cipher.update(password);
        resolve(cipher.final(DADOS_CRIPTOGRAFAR.tipo));
    }).catch(error => {
        reject(error);
    });
}

/**
 * @method _dencryptPassword
 * 
 * @param {*} password senha do usuário com criptografia
 * 
 * @returns senha do usuário descriptografada
 */
let _dencryptPassword = async (password) => {
    return new Promise((resolve, reject) => {
        let decipher = crypto.createDecipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
        decipher.update(password, DADOS_CRIPTOGRAFAR.tipo);
        resolve(decipher.final());
    }).catch(error => {
        reject(error);
    });
}

authCore = {
    encryptPassword: _encryptPassword,
    dencryptPassword: _dencryptPassword
}

module.exports = authCore;