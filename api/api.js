const express = require('express');
const router = express.Router();
const user = require('../user.js');
const playlist = require('../playlist.js');
const log = require('../log.js');
const youtubeAPI = require('./youtube-api.js');
const vimeoAPI = require('./vimeo-api.js');

router.get('/user/:token', function(req, res) {
    user.getConnectedUser(req.params.token, function(err, user){
        if(err){
            res.status(500).send(err);
        } else {
            res.status(200).send(JSON.stringify(user));
        }
    });
});

router.get('/users/:id', function(req, res) {
    user.isAdmin(req.params.id, function(isAdmin){
        if(isAdmin){
            user.getAll(function(err, users){
                if(err) throw new Error("Broke");
                else res.status(200).send(users);
            });
        }
    });
});

router.post('/authenticate', function(req, res){
    if(req.body.mail && req.body.password){
        user.signin(req.body.mail, req.body.password, function(err, data){
            if(err) res.status(401).send();
            else {
                log.addLoginLog(data);
                user.createToken(data, function(response){
                    res.status(200).send(JSON.stringify(response));
                });
            }
        });
    }
});

router.get('/logout/:id', function(req, res){
    log.addLogoutLog(req.params.id, function(err){
        if(err) res.status(500).send(err);
        else res.status(200).send();
    });
})

router.post('/register', function(req,res) {
    if(!user.isExistingUser){
        user.subscribe(req.body, function(err){
            if(err){
                res.status(500).send({
                    error: err
                })
            }
            res.status(201).send();
        });
    }
});

router.post('/playlist', function(req,res) {
    playlist.add(req.body, function(err){
        if(err) res.status(500).send();
        else res.status(201).send();
    });
});

router.get('/playlist/:id', function(req, res) {  
    playlist.getByUserId(req.params.id, function(err, playlists){
        if(err) res.status(500).send(err);
        else res.status(200).send(JSON.stringify(playlists));
    });
});

router.post('/playlist/video', function(req, res) {
    playlist.updatePlaylist(req.body, function(err){
        if(err) res.status(500).send(err);
        else res.status(200).send();
    });
});

router.delete('/playlist/:id', function(req, res) {
    playlist.deletePlaylist(req.params.id, function(err){
        if(err) res.status(500).send(err);
        else res.status(200).send();
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
    log.getSearchLogByUserId(req.params.id, function(err, logs){
        if(err) res.status(500).send(err);
        else res.status(200).send(JSON.stringify(logs));
    });
});

router.get("/log/:id", function(req, res) {
    user.isAdmin(req.params.id, function(isAdmin){
        if(isAdmin){
            log.getAllLogs(function(err, logs){
                if(err) res.status(500).send(err);
                else res.status(200).send(JSON.stringify(logs));
            });
        }
    });
});

router.delete('/log/search/:id', function(req, res) {
    log.deleteAllSearchLogs(req.params.id, function(err){
        if(err) res.status(500).send(err);
        else res.status(200).send();
    });
});

router.delete('/log/:id', function(req, res) {
    user.isAdmin(req.params.id, function(isAdmin){
        if(isAdmin){
            log.deleteAllAuthLogs(function(err){
                if(err) res.status(500).send(err);
                else res.status(200).send();
            });
        }
    });
});

module.exports = {
    router: router,
}