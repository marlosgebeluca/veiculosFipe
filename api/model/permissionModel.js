class PermissionModel {
    constructor(permission_id, descricao) {
        this._permission_id = permission_id;
        this._descricao = descricao;
    }

    set permission_id(permission_id) { this._permission_id = permission_id }
    get permission_id() { return this._permission_id }

    set descricao(descricao) { this._descricao = descricao }
    get descricao() { return this._descricao }

    get schema() {
        return {
            table: 'usersis_permission',
            fields: {
                permission_id: { type: Number, required: true },
                descricao: { type: String, required: true }
            }
        }
    }
}

module.exports = PermissionModel;