let auxFunction,
    messageJson = require('../../conf_files/message.json'),
    config = require('../../conf_files/config.json');

/**
 * método _getMessage
 * @param {*} operation numéro da operação sendo realizada
 * @param {*} fields campos que estão errados na validação
 * 
 * @returns mensagens obtidas durante o processo
 */
let _getMessage = async (operation, fields) => {
    let msg = [],
        message,
        fieldsString = "";

    if (fields) {
        fields.forEach(element => { fieldsString = fieldsString + element + ", " });
        fieldsString = fieldsString.substring(0, fieldsString.length - 2);
        message = messageJson[config.idioma][operation] + " (" + fieldsString + ")";
    } else {
        message = messageJson[config.idioma][operation];
    }

    msg["message"] = message;

    return msg;
}

auxFunction = {
    getMessage: _getMessage
}

module.exports = auxFunction;