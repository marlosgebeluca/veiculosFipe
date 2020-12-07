var express = require('express'),
    router = express.Router(),
    userstatusController = require('../controller/userstatusController.js');

/**
 * Rota para retornar o status de usuário
 */
router.get('/', function (req, res) {
    let filter = (req.query.filter) ? JSON.parse(req.query.filter) : '';
    let range = (req.query.range) ? JSON.parse(req.query.range) : '';
    let sort = (req.query.sort) ? JSON.parse(req.query.sort) : '';
    let perPage = (range[1] + 1) - range[0];
    let page = range[0] / perPage;

    userstatusController.list(filter, page, perPage, sort).then(response => {
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Content-Range', 'user 0-' + perPage + '/' + response.userStatusCount);

        res.status(200).send(response.userStatus);
    }).catch(error => {
        res.json({
            'error': {
                'message': error.message,
                'stack': error.stack
            }
        });
    });
});

/**
 * Rota para retornar o status escolhido por id
 */
router.get('/:id', function (req, res) {
    userstatusController.listBy(req.params.id).then(userStatus => {
        res.status(200).send(userStatus);
    }).catch(error => {
        res.json({
            'error': {
                'message': error.message,
                'stack': error.stack
            }
        });
    });
});

/**
 * Roda para atualizar o registro do status
 */
router.put('/:id', function (req, res) {
    var jsonSend = req.body;

    userstatusController.update(req.params.id, jsonSend).then(userStatus => {
        res.status(200).send(userStatus);
    }).catch(error => {
        res.json({
            'error': {
                'message': error.message,
                'stack': error.stack
            }
        });
    });
  });

module.exports = router;