// const https = require('https');
const http = require('http');
const fs = require('fs');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config.js');
const api = require('./api/api.js');
const methodOverride = require('method-override');
const helmet = require('helmet');

const options = {
  key: fs.readFileSync(__dirname+'/server.key'),
  cert : fs.readFileSync(__dirname+'/server.cert'),
}

const app = express();

app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.static(path.resolve('node_modules')));
app.use(express.static(__dirname+'/app/app-components'));
app.use(express.static(__dirname+'/app/app-services'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); //ici être plus restrictif, genre le lien de l'app mobile
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-with, content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.get('/', (req, res) => res.sendFile(__dirname+'/app/index.html'));


app.use('/api', api.router);


// app.use(function onError(err, req, res, next) {
//   res.statusCode = 500;
//   res.end(res.sentry + '\n');
// });

app.use(function(req, res, next) {
  res.status(404).sendFile(__dirname+'/app/errors/404/404.html');
});

// const server = https.createServer(options,app).listen(process.env.PORT || config.port, function(){ 
const server = http.createServer(app).listen(process.env.PORT || config.port, function(){ 
  console.log(`Example app listening on port ${config.port}!`)
});

// evh.register('user', require('./user'));
// evh.register('log', require('./log'));
// evh.register('playlist', require('./playlist'));
