let schemaTo;

/**
 * método _schemaToWhere
 * 
 * @param {*} model classe com dados do modelo
 * 
 * @returns string que contem o WHERE usado no select
 */
let _schemaToWhere = async (model) => {
    try {
        let retorno = '';
        let modelKeys = Object.keys(model);

        for (var i = 0; i < modelKeys.length; i++) {
            /* Para testes
            console.log('Model Key:' + modelKeys[i].replace('_', ''));
            console.log('Model[Modelkey]:' + model[modelKeys[i].replace('_', '')]);
            console.log('Type:' + typeof model.schema.fields[modelKeys[i].replace('_', '')].type());
            /**/

            if (model[modelKeys[i].replace('_', '')] != '' && model[modelKeys[i].replace('_', '')] != undefined) {
                if (typeof model.schema.fields[modelKeys[i].replace('_', '')].type() == 'string')
                    retorno += modelKeys[i].replace('_', '') + ' like \'%' + model[modelKeys[i].replace('_', '')] + '%\' and '
                else
                    retorno += modelKeys[i].replace('_', '') + ' = ' + model[modelKeys[i].replace('_', '')] + ' and '
            }
        }

        if (retorno != '')
            return 'WHERE ' + retorno.substring(0, retorno.length - 5);

        return retorno;
    } catch (exception) {
        return exception;
    }
}

/**
 * método _schemaToSet
 * 
 * @param {*} model classe com dados do modelo
 * 
 * @returns string que contem o SET usado no update
 */
let _schemaToSet = async (model) => {
    try {
        let retorno = '';
        let modelKeys = Object.keys(model);

        for (var i = 0; i < modelKeys.length; i++) {
            if (modelKeys[i].replace('_', '') != "id") {
                if (model[modelKeys[i].replace('_', '')] != '' && model[modelKeys[i].replace('_', '')] != undefined) {
                    if (typeof model.schema.fields[modelKeys[i].replace('_', '')].type() == 'string')
                        retorno += modelKeys[i].replace('_', '') + ' = \'' + model[modelKeys[i].replace('_', '')] + '\', '
                    else
                        retorno += modelKeys[i].replace('_', '') + ' = ' + model[modelKeys[i].replace('_', '')] + ', '
                }
            }
        }

        if (retorno != '')
            return 'SET ' + retorno.substring(0, retorno.length - 2);

        return retorno;
    } catch (exception) {
        return exception;
    }
}

/**
 * método _schemaToSelec
 * 
 * @param {*} model classe com dados do modelo
 * @param {*} filter filtros aplicado no select
 * @param {*} order ordernação aplacada no select
 * @param {*} page qual pagina está sendo buscada (usado para paginação)
 * @param {*} perPage itens por pagina (usado para paginação)
 * @param {*} sort ordernação aplacada no select
 * @param {*} fields campos para select
 * 
 * @returns string com select gerado com os dados informados
 */
let _schemaToSelect = async (model, filter, page, perPage, sort, fields = '*') => {
    try {
        let table = model.schema.table;
        let where = await _schemaToWhere(model);

        let fieldSort = null;
        let ascDesc = null;

        if (sort !== undefined && sort !== '') {
            fieldSort = sort[0];
            ascDesc = (sort[1].toLowerCase() == 'asc') ? 'ASC' : 'DESC';
        }

        let sql = 'SELECT '
            + fields + ' '
            + 'FROM ' + table + ' nolock '
            + where + ' ';
        sql += (fieldSort) ? 'ORDER BY ' + fieldSort + ' ' + ascDesc + ' ' : ' ';
        sql += (perPage) ? 'LIMIT ' + perPage + ' ' : ' ';
        sql += (perPage) ? 'OFFSET ' + (perPage * page) + ' ' : ' ';

        return sql;
    } catch (exception) {
        return exception;
    }
}

/**
 * 
 * @param {*} model 
 */
let _schemaToUpdate = async (model) => {
    try {
        let table = model.schema.table;
        let set = await _schemaToSet(model);
        let id = model.id;

        let updateSql = 'UPDATE '
            + table + ' '
            + set + ' '
            + 'WHERE id = ' + id

        return updateSql;
    } catch (exception) {
        return exception;
    }
}

schemaTo = {
    where: _schemaToWhere,
    select: _schemaToSelect,
    update: _schemaToUpdate
}

module.exports = schemaTo;