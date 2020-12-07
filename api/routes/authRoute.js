var express = require('express'),
    router = express.Router(),
    usersisController = require('../controller/usersisController.js');

/**
 * Rota para autenticar o usuário
 * recebe no body o login e password
 *
 * @example json enviado
 *  {
 *      "login": "loginusuario",
 *      "password": "senhausuario"
 *  }
 */
router.post('/user', function (req, res) {
    var user = req.body;
    usersisController.authUser(user.login, user.password, 1).then(response => {
        res.status(200).send(response);
    }).catch(error => {
        res.json({
            "error": {
                "message": error.message,
                "stack": error.stack
            }
        });
    });
});

module.exports = router;