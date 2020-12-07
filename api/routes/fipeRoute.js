let express = require('express'),
    router = express(),
    fipeController = require('../controller/fipeController.js');

router.get('/:categoria/marcas', (req, res) => {
    let categoria = req.params.categoria;

    fipeController.findMarcas(categoria).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('erro');
        res.send(error);
    });
});

router.get('/:categoria/:marca', (req, res) => {
    let categoria = req.params.categoria,
        marca = req.params.marca;

    fipeController.findModelos(categoria, marca).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('erro');
        res.send(error);
    });
});

router.get('/:categoria/:marca/codmodelo/:codmodelo', (req, res) => {
    let categoria = req.params.categoria,
        marca = req.params.marca;
        codModelo = req.params.codmodelo;

    fipeController.findAnosModelo(categoria, marca, codModelo).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('erro');
        res.send(error);
    });
});

router.get('/:categoria/:fipe/anomodelo/:anomodelo', (req, res) => {
    let categoria = req.params.categoria,
        tipoConsulta = 'codigo',
        fipe = req.params.fipe,
        anoModelo = req.params.anomodelo;

    fipeController.findVeiculo(fipe, anoModelo, categoria, tipoConsulta).then(response => {
        console.log(response);
        res.send(response);
    }).catch(error => {
        console.log('erro');
        res.send(error);
    });
});

router.get('/:categoria/:marca/:codmodelo/:anomodelo', (req, res) => {
    let categoria = req.params.categoria,
        tipoConsulta = 'tradicional',
        marca = req.params.marca,
        anoModelo = req.params.anomodelo,
        codModelo = req.params.codmodelo;

    fipeController.findVeiculo(marca, anoModelo, categoria, tipoConsulta, codModelo).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('erro');
        res.send(error);
    });
});



module.exports = router;