const express = require('express');
const router = express.Router();
const log = require('../log/log.js');
const youtubeAPI = require('./youtube-api.js');
const vimeoAPI = require('./vimeo-api.js');
const got = require('got');

const userApiUrl = "http://localhost:3001/";
const playlistApiUrl ="http://localhost:3003/";
const logApiUrl = "http://localhost:3006/"

router.get('/user/:token', function(req, res) {
    got('/user/'+req.params.token, { 
        baseUrl: userApiUrl, 
        json: true })
    .then(function(response) { 
        res.send(response.body);
    })
    .catch(function(error){
        console.log('error:', error);
    });
    
});

router.get('/users/:id', function(req, res) {
    got('/users/'+req.params.id, { 
        baseUrl: userApiUrl, 
        json: true })
    .then(function(response) { 
        res.send(response.body);
    })
    .catch(function(error){
        console.log('error:', error);
    });
});

router.post('/authenticate', function(req, res){
    got('/authenticate', { 
        baseUrl: userApiUrl, 
        json: true,
        body: req.body })
    .then(function(response) { 
        res.send(response.body);
    })
    .catch(function(error){
        console.log('error:', error);
    });
});

router.post('/forgot', function (req, res) {    
    got('/forgot', {
        baseUrl: userApiUrl,
        json: true,
        body: req.body
    }).then(function(response) { 
        res.send(response.body);
    })
    .catch(function(error){
        console.log('error:', error);
    });
});
/*
var path = require ('path');

router.get('/reset/:token', function(req, res) {
    console.log("get reset : "+req.params.token);

   return res.sendFile(path.join(__dirname + '/../app/views/resetPassword.view.html'));
});
*/

router.post('/resetpw/:token',function(req, res) {
    console.log("post reset : "+req.params.token);
    got('/reset/'+req.params.token, {
        baseUrl: userApiUrl,
        json: true,
        body: req.body
    }).then(function(response) { 
        res.send(response.body);
    })
    .catch(function(error){
        console.log('error:', error);
    });
});

router.post('/register', function(req,res) {
    got('/register', { 
        baseUrl: userApiUrl, 
        json: true,
        body: req.body })
    .then(function(response) { 
        res.send(response.body);
    })
    .catch(function(error){
        console.log('error:', error);
    });
});



router.post('/playlist', function(req,res) {
    got('/playlist', { 
        baseUrl: playlistApiUrl, 
        json: true,
        body: req.body })
    .then(function(response) { 
        res.send(response.body);
    })
    .catch(function(error){
        console.log('error:', error);
    });
});

router.get('/playlist/:id', function(req, res) {  
    got('/playlist/'+req.params.id, { 
        baseUrl: playlistApiUrl, 
        json: true })
    .then(function(response) { 
        res.send(response.body);
    })
    .catch(function(error){
        console.log('error:', error);
    });
});

router.post('/playlist/video', function(req, res) {
    got('/playlist/video', { 
        baseUrl: playlistApiUrl, 
        json: true,
        body: req.body })
    .then(function(response) { 
        res.send(response.body);
    })
    .catch(function(error){
        console.log('error:', error);
    });
});

router.delete('/playlist/:id', function(req, res) {
    got('/playlist/'+req.params.id, { 
        baseUrl: playlistApiUrl, 
        json: true,
        method: 'DELETE' })
    .then(function(response) { 
        res.send(response.body);
    })
    .catch(function(error){
        console.log('error:', error);
    });
});

router.post("/search", function(req, res) {
    if(req.body.api == "YouTube"){
        youtubeAPI.search(req,res);
    }

    if(req.body.api == "Vimeo"){
        vimeoAPI.searchListByKeyword(req, res);
    }
});

router.get("/log/search/:id", function(req, res) {
    got('/log/search'+req.params.id, { 
        baseUrl: logApiUrl, 
        json: true })
    .then(function(response) { 
        res.send(response.body);
    })
    .catch(function(error){
        console.log('error:', error);
    });
});

router.get("/log/:id", function(req, res) {
    got('/log/'+req.params.id, { 
        baseUrl: logApiUrl, 
        json: true })
    .then(function(response) { 
        res.send(response.body);
    })
    .catch(function(error){
        console.log('error:', error);
    });
});

router.delete('/log/search/:id', function(req, res) {
    got('/log/search/'+req.params.id, { 
        baseUrl: logApiUrl, 
        json: true,
        method: 'DELETE' })
    .then(function(response) { 
        res.send(response.body);
    })
    .catch(function(error){
        console.log('error:', error);
    });
});

router.delete('/log/:id', function(req, res) {
    got('/log/'+req.params.id, { 
        baseUrl: logApiUrl, 
        json: true,
        method: 'DELETE' })
    .then(function(response) { 
        res.send(response.body);
    })
    .catch(function(error){
        console.log('error:', error);
    });
});

router.get('/logout/:id', function(req, res){
    got('/logout/'+req.params.id, { 
        baseUrl: logApiUrl, 
        json: true })
    .then(function(response) { 
        res.send(response.body);
    })
    .catch(function(error){
        console.log('error:', error);
    });
});

module.exports = {
    router: router,
}