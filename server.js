
const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config.js');
const api = require('./api.js');
const database = require('./database.js');
const evh = require('express-vhost');
const methodOverride = require('method-override');
var helmet = require('helmet');

const options = {
  key: fs.readFileSync(path.resolve('server.key')),
  cert : fs.readFileSync(path.resolve('server.cert')),
}

const app = express();

app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(function (req, res, next) {
  next();
});

app.get('/', (req, res) => res.sendFile(__dirname+'/app/index.html'));
app.use('/api', api.router);

app.use(function(req, res, next) {
  res.status(404).sendFile(__dirname+'/app/404/404.html');
});

const server = https.createServer(options,app).listen(config.port, function(){ 
  console.log(`Example app listening on port ${config.port}!`)
});

evh.register('user', require('./user').app);
evh.register('log', require('./log'));
evh.register('playlist', require('./playlist'));
