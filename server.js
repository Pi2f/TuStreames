
const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config.js');
const api = require('./api/api.js');
const database = require('./database.js');
const evh = require('express-vhost');
const methodOverride = require('method-override');
const helmet = require('helmet');
const Sentry = require('@sentry/node');


Sentry.init({ 
    dsn: 'https://1f623e025fe041aaa5a504dcaf2eba8b@sentry.io/1340719',
    maxBreadcrumbs: 50,
    debug: true, 
  });


const options = {
  key: fs.readFileSync(path.resolve('server.key')),
  cert : fs.readFileSync(path.resolve('server.cert')),
}

const app = express();


app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
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


app.use(function onError(err, req, res, next) {
  res.statusCode = 500;
  res.end(res.sentry + '\n');
});

app.use(function(req, res, next) {
  res.status(404).sendFile(__dirname+'/app/404/404.html');
});

const server = https.createServer(options,app).listen(config.port, function(){ 
  console.log(`Example app listening on port ${config.port}!`)
});

evh.register('user', require('./user').app);
evh.register('log', require('./log'));
evh.register('playlist', require('./playlist'));
