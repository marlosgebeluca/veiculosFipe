const config = require('./conf_files/config.json');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

//Server
const server = express();

server.use(helmet());
server.use(bodyParser.json());
server.use(cors());
server.use(morgan('combined'));
server.use(bodyParser.urlencoded({ extended: true }))

//ROUTES
const routesAuth = require('./routes/authRoute.js');
server.use('/api/tools/auth', routesAuth);

const userStatusRoute = require('./routes/userStatusRoute.js');
server.use('/api/tools/userstatus', userStatusRoute);

const fipeTask = require('./routes/fipeRoute.js');
server.use('/api/fipe', fipeTask); //ARRUMAR ESSA BOSTA


server.listen(config.porta, function () {
  console.log('Servidor rodando na porta ' + config.porta);
});

module.exports = server;
