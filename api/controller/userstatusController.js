let userStatusController,
    UserStatusModel = require('../model/userstatusModel.js'),
    connection = require('./core/connection.js'),
    config = require('../conf_files/config.json');

/**
 * @method listBy lista o status por id
 * 
 * @param {*} filter - filtro usado para seleção
 * @param {*} order - ordenação
 * @param {*} page - pagina que se encontra a busca
 * @param {*} perPage - registros a serem exibidos por pagina
 * @param {*} sort - orden by
 * 
 * @returns json
 */
let _list = async (filter, page, perPage, sort) => {
    try {
        let statusModel = new UserStatusModel();
        if (filter.q) {
            statusModel.descricao = filter.q;
        }

        let userStatus = await connection.select(statusModel, filter, page, perPage, sort);
        let userStatusCount = await connection.count(statusModel);

        let userStatusJson = {
            'userStatus': userStatus,
            'userStatusCount': userStatusCount,
        }

        return userStatusJson;
    } catch (error) {
        return error;
    }
};

/**
 * @method listBy lista o status por id
 * 
 * @param {*} id - id do status
 * 
 * @returns json
 */
let _listBy = async (id) => {
    try {
        let statusModel = new UserStatusModel();
        statusModel.id = id

        let userStatus = await connection.select(statusModel);

        return userStatus;
    } catch (error) {
        return error;
    }
};

/**
 * @method _update atualiza o registro status
 * 
 * @param {*} id - id a ser atualizado
 * @param {*} jsonSend - novos dados a serem atualizados
 */
let _update = async (id, jsonSend) => {
    try {
        let statusModel = new UserStatusModel();
        statusModel.id = id
        statusModel.descricao = jsonSend.descricao;

        let response = await connection.update(statusModel);
        let msg02 = await coreAuxFunction.getMessage("0200");
        let retorno = { message: msg02.message + ':' + response.rowCount }

        return retorno;
    } catch (error) {
        return error;
    }
};

userStatusController = {
    list: _list,
    listBy: _listBy,
    update: _update
}

module.exports = userStatusController;