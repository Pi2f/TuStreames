const express = require('express');
const router = express.Router();
const youtubeAPI = require('./youtube-api.js');
const vimeoAPI = require('./vimeo-api.js');
const got = require('got');
const jwt = require('jsonwebtoken');
const config = require('./../config.js');

router.get('/:token', function(req, res) {
    verifyToken(req.params.token, function (resp) {
        res.status(200).send(JSON.stringify(resp));
    });
});

router.get('/user/:id', function(req, res) {
    got('user/'+req.params.id, { 
        baseUrl: config.userApiUrl, 
        json: true })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.get('/users/:id', function(req, res) {
    got('user/all/'+req.params.id, { 
        baseUrl: config.userApiUrl, 
        json: true })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.post('/authenticate', function(req, res){
    got('/user/authenticate', { 
        baseUrl: config.userApiUrl, 
        json: true,
        body: req.body })
    .then(response => {
        addLoginLog(response.body.user);
        createToken(response.body.user, function (response) {
            res.send(response);
        });
    })
    .catch((error) => {        
        res.status(error.statusCode).end();
    });
});

function createToken(user,cb) {
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

function addLoginLog(data, res) {
    got('/log/login', {
        baseUrl: config.logApiUrl,
        json: true,
        body: data
    })
    .then(response => res.send(response.body))
    .catch(handleError);
}

router.post('/register', function(req,res) {
    got('/user/register', { 
        baseUrl: config.userApiUrl, 
        json: true,
        body: req.body })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.post('/user/admin', function(req,res) {
    got('/user/admin', { 
        baseUrl: config.userApiUrl, 
        json: true,
        body: req.body })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.get('/user/blocked/:id', function(req,res) {
    got('/user/blocked/'+req.params.id, { 
        baseUrl: config.userApiUrl, 
        json: true })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.post('/user/blocked', function(req,res) {
    got('/user/blocked', { 
        baseUrl: config.userApiUrl, 
        json: true,
        body: req.body })
    .then(response => res.send(response.body))
    .catch(handleError);
});



router.post('/playlist', function(req,res) {
    got('/playlist', { 
        baseUrl: config.playlistApiUrl, 
        json: true,
        body: req.body })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.get('/playlist/:id', function(req, res) {  
    got('/playlist/'+req.params.id, { 
        baseUrl: config.playlistApiUrl, 
        json: true })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.post('/playlist/video', function(req, res) {
    got('/playlist/video', { 
        baseUrl: config.playlistApiUrl, 
        json: true,
        body: req.body })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.delete('/playlist/:id', function(req, res) {
    got('/playlist/'+req.params.id, { 
        baseUrl: config.playlistApiUrl, 
        json: true,
        method: 'DELETE' })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.post("/search", function(req, res) {
    if(req.body.api == "YouTube"){
        youtubeAPI.search(req,function (response) {
            res.status(200).send(JSON.stringify(response));
        });
    }
    if(req.body.api == "Vimeo"){
        vimeoAPI.search(req, function (response) {
            res.status(200).send(JSON.stringify(response));
        });
    }
});

router.post("/page", function(req, res) {
    if(req.body.api == "YouTube"){
        youtubeAPI.page(req,function (response) {
            res.status(200).send(JSON.stringify(response));
        });
    }
    if(req.body.api == "Vimeo"){
        vimeoAPI.page(req, function(response){
            res.status(200).send(JSON.stringify(response));
        });
    }
});

router.get("/log/search/:id", function(req, res) {
    got('/log/search/'+req.params.id, { 
        baseUrl: config.logApiUrl, 
        json: true })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.post("/log/search", function(req, res) {
    got('/log/search', { 
        baseUrl: config.logApiUrl, 
        json: true,
        body: req.body })
      .then(function(response) { 
          res.send(response.body);
      })
      .catch(handleError); 
});

router.get("/log/:id", function(req, res) {
    got('/user/admin/'+req.params.id, {
        baseUrl: config.userApiUrl,
        json: true })
    .then(function(response) {
        if(response.body.isAdmin){
            got('/log/'+req.params.id, { 
                baseUrl: config.logApiUrl, 
                json: true })
            .then(response => res.send(response.body))
            .catch(handleError);
        }
        else {
            res.end();
        }
    })
    .catch(handleError);
});

router.delete('/log/search/:id', function(req, res) {
    got('/user/admin/'+req.params.id, {
        baseUrl: config.userApiUrl,
        json: true })
    .then(function(response) {
        if(response.body.isAdmin){
            got('/log/search/'+req.params.id, { 
                baseUrl: config.logApiUrl, 
                json: true,
                method: 'DELETE' })
            .then(response => res.send(response.body))
            .catch(handleError);
        }
        else {
            res.send();
        }
    })
    .catch(handleError);
});

router.delete('/log/:id', function(req, res) {
    got('/log/'+req.params.id, { 
        baseUrl: config.logApiUrl, 
        json: true,
        method: 'DELETE' })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.get('/logout/:id', function(req, res){
    got('/logout/'+req.params.id, { 
        baseUrl: config.logApiUrl, 
        json: true })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.post('/forgot', function (req, res) {    
    got('/forgot', {
        baseUrl: config.userApiUrl,
        json: true,
        body: req.body
    }).then(function(response) { 
        res.send(response.body);
    })
    .catch(handleError);
});

router.post('/resetpw/:token',function(req, res) {
    got('/reset/'+req.params.token, {
        baseUrl: config.userApiUrl,
        json: true,
        body: req.body
    }).then(function(response) { 
        res.send(response.body);
    })
    .catch(handleError);
});

function verifyToken(token, cb){
    if(token){
        jwt.verify(token, config.secret, function(err, out){
            if(err){                    
                cb(err);
            } else {                    
                cb(out);
            }
        });
    } else cb("Invalid Token");
}

function handleError(error){
    console.log('error:', error);
}

module.exports = {
    router: router,
}