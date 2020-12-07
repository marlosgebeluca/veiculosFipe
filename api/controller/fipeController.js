let fipeController,
    fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio');

const mainUrl = 'https://veiculos.fipe.org.br/';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
    'Content-Type': 'application/x-www-form-urlencoded'
};

const codigosTipoVeiculo = {
    carro: 1,
    moto: 2,
    caminhao: 3
}

let _findTabelaReferencia = () => {
    return new Promise((resolve, reject) => {
        let url = mainUrl + 'api/veiculos//ConsultarTabelaDeReferencia';

        request.post({ url: url, headers: headers }, function (error, response, body) {
            resolve(JSON.parse(body)[0]['Codigo']);
        });
    });
}

let _getTipoVeiculo = (categoria) => {

    switch (categoria) {
        case 'carro':
            return codigosTipoVeiculo.carro
        case 'moto':
            return codigosTipoVeiculo.moto
        case 'caminhao':
            return codigosTipoVeiculo.caminhao
        default:
            console.log('deu ruim categoria');
            return 'carro';
    }
}

let _findMarcas = async (categoria) => {

    let tipoVeiculo = await _getTipoVeiculo(categoria);

    let promessa = new Promise((resolve, reject) => {
        _findTabelaReferencia().then(referencia => {
            let url = mainUrl + 'api/veiculos//ConsultarMarcas';

            let form = {
                codigoTabelaReferencia: referencia,
                codigoTipoVeiculo: tipoVeiculo
            };

            request.post({
                url: url,
                form: form,
                headers: headers
            }, (error, response, body) => {
                resolve(JSON.parse(body));
            });
        }).catch(erro => {
            reject(erro);
        });
    });

    return promessa;
}

let _findModelos = async (categoria, marca) => {
    let tipoVeiculo = await _getTipoVeiculo(categoria);

    let promessa = new Promise((resolve, reject) => {
        _findTabelaReferencia().then(referencia => {
            let url = mainUrl + 'api/veiculos//ConsultarModelos';

            let form = {
                codigoTipoVeiculo: tipoVeiculo,
                codigoTabelaReferencia: referencia,
                codigoModelo: '',
                codigoMarca: marca,
                ano: '',
                codigoTipoCombustivel: '',
                anoModelo: '',
                modeloCodigoExterno: '',
            };

            request.post({
                url: url,
                form: form,
                headers: headers
            }, (error, response, body) => {
                resolve(JSON.parse(body));
            });
        }).catch(erro => {
            reject(erro);
        });
    });

    return promessa;
}

let _findAnosModelo = async (categoria, marca, codigoModelo) => {
    let tipoVeiculo = await _getTipoVeiculo(categoria);

    let promessa = new Promise((resolve, reject) => {
        _findTabelaReferencia().then(referencia => {
            let url = mainUrl + 'api/veiculos//ConsultarAnoModelo';

            let form = {
                codigoTipoVeiculo: tipoVeiculo,
                codigoTabelaReferencia: referencia,
                codigoModelo: codigoModelo,
                codigoMarca: marca,
                ano: '',
                codigoTipoCombustivel: '',
                anoModelo: '',
                modeloCodigoExterno: '',
            };

            request.post({
                url: url,
                form: form,
                headers: headers
            }, (error, response, body) => {
                resolve(JSON.parse(body));
            });
        }).catch(erro => {
            reject(erro);
        });
    });

    return promessa;
}

let _findAnoModeloPeloCodigoModelo = (codMarca, referencia, tipoVeiculo, codModelo, categoria) => {
    return new Promise((resolve, reject) => {
        let url = mainUrl + 'api/veiculos//ConsultarAnoModelo';

        let form = {
            codigoTipoVeiculo: tipoVeiculo,
            codigoTabelaReferencia: referencia,
            codigoModelo: codModelo,
            codigoMarca: codMarca,
            ano: '',
            codigoTipoCombustivel: '',
            anoModelo: '',
            modeloCodigoExterno: '',
        };

        request.post({ url: url, form: form, headers: headers }, function (error, response, body) {
            resolve(JSON.parse(body));
        });
    });
}

let _findAnoModeloPeloCodigoFipe = (referencia, tipoVeiculo, fipe, categoria) => {
    return new Promise((resolve, reject) => {
        let url = mainUrl + 'api/veiculos//ConsultarAnoModeloPeloCodigoFipe';

        let form = {
            codigoTipoVeiculo: tipoVeiculo,
            codigoTabelaReferencia: referencia,
            codigoModelo: '',
            codigoMarca: '',
            ano: '',
            codigoTipoCombustivel: '',
            anoModelo: '',
            modeloCodigoExterno: fipe,
        };

        request.post({ url: url, form: form, headers: headers }, function (error, response, body) {
            resolve(JSON.parse(body));
        });
    });
}

let _findValorComTodosParametrosCodigo = (referencia, tipoVeiculo, fipe, anoCombustivel, anoModelo, categoria, tipoConsulta) => {
    return new Promise((resolve, reject) => {
        let url = mainUrl + 'api/veiculos//ConsultarValorComTodosParametros';
        let jsonRetorno = '';
        let combustivel;

        let veiculos = new Promise((resolveVeiculos, rejectVeiculos) => {
            anoCombustivel.forEach((data, index) => {
                let valueResult = data.Value.split("-");
                if (anoModelo == valueResult[0])
                    combustivel = valueResult[1];

                if (index === anoCombustivel.length - 1)
                    resolveVeiculos();
            });
        });

        veiculos.then(() => {
            let form = {
                codigoTabelaReferencia: referencia,
                codigoMarca: '',
                codigoModelo: '',
                codigoTipoVeiculo: tipoVeiculo,
                anoModelo: anoModelo,
                codigoTipoCombustivel: combustivel,
                tipoVeiculo: categoria,
                modeloCodigoExterno: fipe,
                tipoConsulta: tipoConsulta
            };

            request.post({ url: url, form: form, headers: headers }, function (error, response, body) {
                jsonRetorno = body;
                resolve(jsonRetorno);
            });
        });
    });
};

let _findValorComTodosParametrosTradicional = (referencia, tipoVeiculo, codMarca, anoCombustivel, anoModelo, categoria, tipoConsulta, codModelo) => {
    return new Promise((resolve, reject) => {
        let url = mainUrl + 'api/veiculos//ConsultarValorComTodosParametros';
        let jsonRetorno = '';
        let combustivel;

        let veiculos = new Promise((resolveVeiculos, rejectVeiculos) => {
            anoCombustivel.forEach((data, index) => {
                let valueResult = data.Value.split("-");
                if (anoModelo == valueResult[0])
                    combustivel = valueResult[1];

                if (index === anoCombustivel.length - 1)
                    resolveVeiculos();
            });
        });

        veiculos.then(() => {
            let form = {
                codigoTabelaReferencia: referencia,
                codigoMarca: codMarca,
                codigoModelo: codModelo,
                codigoTipoVeiculo: tipoVeiculo,
                anoModelo: anoModelo,
                codigoTipoCombustivel: combustivel,
                tipoVeiculo: categoria,
                modeloCodigoExterno: '',
                tipoConsulta: tipoConsulta
            };

            request.post({ url: url, form: form, headers: headers }, function (error, response, body) {
                jsonRetorno = body;
                resolve(jsonRetorno);
            });
        });
    });
};

let _findVeiculo = async (fipeOuMarca, anoModelo, categoria, tipoConsulta, codModelo) => {
    let tipoVeiculo = await _getTipoVeiculo(categoria);

    switch (tipoConsulta) {
        case 'tradicional':
            return _findVeiculoTradicional(fipeOuMarca, anoModelo, categoria, tipoConsulta, tipoVeiculo, codModelo);
        case 'codigo':
            return _findVeiculoCodigo(fipeOuMarca, anoModelo, categoria, tipoConsulta, tipoVeiculo);
        default:
            console.log('deu ruim no tipo consulta');
    }
}

let _findVeiculoTradicional = async (marca, anoModelo, categoria, tipoConsulta, tipoVeiculo, codModelo) => {
    return new Promise((resolve, reject) => {
        _findTabelaReferencia().then(referencia => {
            _findAnoModeloPeloCodigoModelo(marca, referencia, tipoVeiculo, codModelo, categoria).then(anoCombustivel => {
                _findValorComTodosParametrosTradicional(referencia, tipoVeiculo, marca, anoCombustivel, anoModelo, categoria, tipoConsulta, codModelo).then(response => {
                    resolve(response);
                }).catch(erro => {
                    reject(erro);
                });
            }).catch(erro => {
                reject(erro);
            });
        }).catch(erro => {
            reject(erro);
        });
    });
}

let _findVeiculoCodigo = async (fipe, anoModelo, categoria, tipoConsulta, tipoVeiculo) => {
    return new Promise((resolve, reject) => {
        _findTabelaReferencia().then(referencia => {
            _findAnoModeloPeloCodigoFipe(referencia, tipoVeiculo, fipe, categoria).then(anoCombustivel => {
                _findValorComTodosParametrosCodigo(referencia, tipoVeiculo, fipe, anoCombustivel, anoModelo, categoria, tipoConsulta).then(response => {
                    resolve(response);
                }).catch(erro => {
                    reject(erro);
                });
            }).catch(erro => {
                reject(erro);
            });
        }).catch(erro => {
            reject(erro);
        });
    });
}

fipeController = {
    findVeiculo: _findVeiculo,
    findMarcas: _findMarcas,
    findModelos: _findModelos,
    findAnosModelo: _findAnosModelo
}

module.exports = fipeController;