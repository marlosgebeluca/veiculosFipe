let userSisController,
    UserSisModel = require('../model/usersisModel.js'),
    PermissionModel = require('../model/permissionModel.js'),
    auth = require('./core/auth.js'),
    connection = require('./core/connection.js'),
    coreAuxFunction = require('../controller/core/auxFunctions.js'),
    config = require('../conf_files/config.json');

/**
 * @method authUser autentica usuário
 * @param {*} login login do usuário
 * @param {*} password senha do usuário
 * @param {*} status status do usuário -> 1 Ativo
 *                                        2 Inativo
 * 
 * @returns json de autenticação
 */
let _authUser = async (login, password, status) => {

    try {
        let encryptPassword = await auth.encryptPassword(password);

        let user = new UserSisModel();
        user.login = login;
        user.senha = encryptPassword;
        user.status = status;

        let usersis = await connection.select(user);
        if (usersis.length == 0) {
            let msg02 = await coreAuxFunction.getMessage("0002");
            let retorno = { message: msg02.message }
            
            return retorno;
        }

        else {
            let permissions = await _getPermission(usersis[0].permission_id);
            let token = await _getToken(usersis[0]);
            let msg01 = await coreAuxFunction.getMessage("0001");

            let retorno = {
                usersis: {
                    usersis_id: usersis[0].usersis_id,
                    permissions: permissions,
                    token: token,
                    language: config.idioma,
                },
                message: msg01.message
            }

            return retorno;
        }
    } catch (error) {
        return error;
    }
};

/**
 * @method _getPermission 
 * @param {*} permission_id permissão do usuário
 * 
 * @returns descrição permissão 
 */
let _getPermission = async (permission_id) => {
    let msg03 = await coreAuxFunction.getMessage("0003");

    return new Promise((resolve, reject) => {
        let usersis_permission = new PermissionModel();
        usersis_permission.permission_id = permission_id;

        connection.select(usersis_permission).then(permission => {
            if (permission.length == 0)
                resolve(msg03.message);
            else
                resolve(permission[0].descricao);
        })
    });
};

/**
 * @method _getToken
 * @param {*} user usersisModel para gerar token usando o @method encryptPassword
 * 
 * @returns token gerado
 */
let _getToken = async (user) => {
    return new Promise((resolve, reject) => {
        let transformarEmToken = user.usersis_id + user.login + user.nome;
        auth.encryptPassword(transformarEmToken).then(token => {
            resolve(token);
        }).catch(erro => {
            reject(erro);
        });
    });
};

userSisController = {
    authUser: _authUser
}

module.exports = userSisController;