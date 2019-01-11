const express = require('express');
const router = express.Router();
const youtubeAPI = require('./youtube-api.js');
const vimeoAPI = require('./vimeo-api.js');
const got = require('got');
const path = require('path');

const userApiUrl = "http://localhost:3001/";
const playlistApiUrl ="http://localhost:3003/";
const logApiUrl = "http://localhost:3006/"

router.get('/user/:token', function(req, res) {
    got('/user/'+req.params.token, { 
        baseUrl: userApiUrl, 
        json: true })
    .then(response => res.send(response.body))
    .catch(handleError);
    
});

router.get('/users/:id', function(req, res) {
    got('user/all/'+req.params.id, { 
        baseUrl: userApiUrl, 
        json: true })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.post('/authenticate', function(req, res){
    got('/user/authenticate', { 
        baseUrl: userApiUrl, 
        json: true,
        body: req.body })
    .then(response => {
        res.send(response.body)}
        )
    .catch((error) => {
        console.log(error);
        res.status(error.statusCode).send(error)
    });
});

router.post('/register', function(req,res) {
    got('/user/register', { 
        baseUrl: userApiUrl, 
        json: true,
        body: req.body })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.post('/user/admin', function(req,res) {
    got('/user/admin', { 
        baseUrl: userApiUrl, 
        json: true,
        body: req.body })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.get('/user/blocked/:id', function(req,res) {
    got('/user/blocked/'+req.params.id, { 
        baseUrl: userApiUrl, 
        json: true })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.post('/user/blocked', function(req,res) {
    got('/user/blocked', { 
        baseUrl: userApiUrl, 
        json: true,
        body: req.body })
    .then(response => res.send(response.body))
    .catch(handleError);
});



router.post('/playlist', function(req,res) {
    got('/playlist', { 
        baseUrl: playlistApiUrl, 
        json: true,
        body: req.body })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.get('/playlist/:id', function(req, res) {  
    got('/playlist/'+req.params.id, { 
        baseUrl: playlistApiUrl, 
        json: true })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.post('/playlist/video', function(req, res) {
    got('/playlist/video', { 
        baseUrl: playlistApiUrl, 
        json: true,
        body: req.body })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.delete('/playlist/:id', function(req, res) {
    got('/playlist/'+req.params.id, { 
        baseUrl: playlistApiUrl, 
        json: true,
        method: 'DELETE' })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.post("/search", function(req, res) {
    if(req.body.api == "YouTube"){
        youtubeAPI.search(req,res);
    }
    if(req.body.api == "Vimeo"){
        vimeoAPI.searchListByKeyword(req, res);
    }
});

router.post("/page", function(req, res) {
    if(req.body.api == "YouTube"){
        youtubeAPI.page(req,res);
    }
    if(req.body.api == "Vimeo"){
        vimeoAPI.page(req, res);
    }
});

router.get("/log/search/:id", function(req, res) {
    got('/log/search/'+req.params.id, { 
        baseUrl: logApiUrl, 
        json: true })
    .then(response => res.send(response.body))
    .catch(handleError);
    
});

router.get("/log/:id", function(req, res) {
    got('/user/admin/'+req.params.id, {
        baseUrl: userApiUrl,
        json: true })
    .then(function(response) {
        if(response.body.isAdmin){
            got('/log/'+req.params.id, { 
                baseUrl: logApiUrl, 
                json: true })
            .then(response => res.send(response.body))
            .catch(handleError);
        }
        else {
            res.send();
        }
    })
    .catch(handleError);
});

router.delete('/log/search/:id', function(req, res) {
    got('/user/admin/'+req.params.id, {
        baseUrl: userApiUrl,
        json: true })
    .then(function(response) {
        if(response.body.isAdmin){
            got('/log/search/'+req.params.id, { 
                baseUrl: logApiUrl, 
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
        baseUrl: logApiUrl, 
        json: true,
        method: 'DELETE' })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.get('/logout/:id', function(req, res){
    got('/logout/'+req.params.id, { 
        baseUrl: logApiUrl, 
        json: true })
    .then(response => res.send(response.body))
    .catch(handleError);
});

router.post('/forgot', function (req, res) {    
    got('/forgot', {
        baseUrl: userApiUrl,
        json: true,
        body: req.body
    }).then(function(response) { 
        res.send(response.body);
    })
    .catch(handleError);
});

router.post('/resetpw/:token',function(req, res) {
    console.log("post reset : "+req.params.token);
    got('/reset/'+req.params.token, {
        baseUrl: userApiUrl,
        json: true,
        body: req.body
    }).then(function(response) { 
        res.send(response.body);
    })
    .catch(handleError);
});

function handleError(error){
    console.log('error:', error);
}

module.exports = {
    router: router,
}