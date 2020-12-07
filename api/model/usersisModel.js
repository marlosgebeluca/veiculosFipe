class UserSisModel {
    constructor(usersis_id, nome, login, senha, status) {
        this._usersis_id = usersis_id;
        this._nome = nome;
        this._login = login;
        this._senha = senha;
        this._status = status;
    }

    set usersis_id(usersis_id) { this._usersis_id = usersis_id }
    get usersis_id() { return this._usersis_id }

    set nome(nome) { this._nome = nome }
    get nome() { return this._nome }

    set login(login) { this._login = login }
    get login() { return this._login }

    set senha(senha) { this._senha = senha }
    get senha() { return this._senha }

    set status(status) { this._status = status }
    get status() { return this._status }

    get schema() {
        return {
            table: 'usersis',
            fields: {
                usersis_id: { type: Number, required: true },
                nome: { type: String, required: false },
                login: { type: String, required: true },
                senha: { type: String, required: true },
                status: { type: Number, required: true }
            }
        }
    }
}

module.exports = UserSisModel;