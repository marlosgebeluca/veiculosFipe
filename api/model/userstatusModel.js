class UserStatusModel {
    constructor(id, descricao) {
        this._id = id;
        this._descricao = descricao;
    }

    set id(id) { this._id = id }
    get id() { return this._id }

    set descricao(descricao) { this._descricao = descricao }
    get descricao() { return this._descricao }

    get schema() {
        return {
            table: 'usersis_status',
            fields: {
                id: { type: Number, required: true },
                descricao: { type: String, required: true },
            }
        }
    }
}

module.exports = UserStatusModel;