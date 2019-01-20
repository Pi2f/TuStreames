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
const got = require('got');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');

const options = {
    key: fs.readFileSync(__dirname + '/server.key'),
    cert: fs.readFileSync(__dirname + '/server.cert'),
}

const app = express();

app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.static(path.resolve('node_modules')));
app.use(express.static(__dirname + '/app/app-components'));
app.use(express.static(__dirname + '/app/app-services'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-with, content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.get('/', (req, res) => res.sendFile(__dirname + '/app/index.html'));


app.use('/api', api.router);

app.post('/authenticate', function (req, res) {
    got('/user/authenticate', {
            baseUrl: config.userApiUrl,
            json: true,
            body: req.body
        })
        .then(response => {
            if (response.body.user) {
                addLoginLog(response.body.user, res);
                createToken(response.body.user, function (response) {
                    res.send(response);
                });
            } else {
                res.send(response.body);
            }
        })
        .catch((error) => {
            res.status(error.statusCode).end();
        });
});

function addLoginLog(data, res) {
    got('/log/login', {
            baseUrl: config.logApiUrl,
            json: true,
            body: data
        })
        .then()
        .catch(handleError);
}

app.get('/logout', function (req, res) {
    got('/logout/' + req.user.user.id, {
            baseUrl: config.logApiUrl,
            json: true
        })
        .then(response => res.send(response.body))
        .catch(handleError);
});

function createToken(user, cb) {
    const payload = {
        user: {
            id: user._userID,
            mail: user.mail,
            role: user.role,
        }
    };

    const token = jwt.sign(payload, config.secret, {
        expiresIn: "1 days"
    });
    const response = {
        token: token,
        user: payload.user
    }
    return cb(response);
}

app.post('/forgot', function (req, res) {
    got('/forgot', {
            baseUrl: config.userApiUrl,
            json: true,
            body: req.body
        }).then(response => res.send(response.body))
        .catch(handleError);
});

app.post('/resetpw/:token', function (req, res) {
    got('/reset/' + req.params.token, {
            baseUrl: config.userApiUrl,
            json: true,
            body: req.body
        }).then(response => res.send(response.body))
        .catch(handleError);
});

function handleError(error) {
    console.log('error:', error);
}


app.use(function (req, res) {
    res.status(404).sendFile(__dirname + '/app/errors/404/404.html');
});

// const server = https.createServer(options,app).listen(process.env.PORT || config.port, function(){ 
const server = http.createServer(app).listen(process.env.PORT || config.port, function () {
    console.log(`Example app listening on port ${config.port}!`)
});