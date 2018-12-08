
const http = require('http');
const fs = require('fs');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config.js');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); //ici être plus restrictif, genre le lien de l'app mobile
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-with, content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/', (req, res) => res.sendFile(__dirname+'/app/index.html'));

const server = http.createServer(app)
.listen(config.port, function(){ 
  console.log(`Example app listening on port ${config.port}!`)
});
