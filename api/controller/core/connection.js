let connection;
const config = require('../../conf_files/config.json'),
    schemaTo = require('../core/auxSchema.js'),
    { Pool, Client } = require('pg');

/**
 * @method _getConnection
 * 
 * @returns conexão com bd
 */
let _getConnection = async () => {
    try {
        const connectionString = config.dbStringConnection;

        const client = new Client({
            connectionString: connectionString
        });

        return client;
    } catch (exception) {
        return exception
    }
}

/**
 * método _execQuery executa a query no postgres
 * 
 * @param {*} sql 
 * 
 * @return Promise com retorno da execução
 */
let _execQuery = async (sql) => {
    try {
        const client = await _getConnection();
        client.connect();

        return new Promise((resolve, reject) => {
            client.query(sql, (error, response) => {
                client.end();
                resolve(response);
            });
        });
    } catch (exception) {
        return exception;
    }
}

/**
 * @method _count
 * 
 * @param {*} model classe com dados do modelo buscado
 * 
 * @returns Promisse com o maximo de registros da tabela
 */
let _count = async (model) => {
    const client = await _getConnection();
    let table = model.schema.table;

    try {
        client.connect();
        let sql = 'SELECT COUNT(0)' + 'FROM ' + table + ' nolock '
        let response = await _execQuery(sql);

        return response.rows[0].count;
    } catch (exception) {
        return exception;
    }
}

/**
 * @method _select
 * 
 * @param {*} model classe com dados do modelo buscado
 * @param {*} fields campos selecionados separados por virgula 
 * 
 * @returns Promisse com as linhas encontradas na tabela
 */
let _select = async (model, filter, page, perPage, sort, fields = '*') => {
    try {
        let sql = await schemaTo.select(model, filter, page, perPage, sort, fields = '*');
        let response = await _execQuery(sql);

        return response.rows;
    } catch (exception) {
        return exception;
    }
}

let _update = async (model) => {
    try {
        let sql = await schemaTo.update(model);
        let response = await _execQuery(sql);

        return response;
    } catch (exception) {
        return exception;
    }
}

connection = {
    select: _select,
    update: _update,
    count: _count,
}

module.exports = connection;