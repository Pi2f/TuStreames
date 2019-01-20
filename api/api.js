const express = require('express');
const router = express.Router();
const youtubeAPI = require('./youtube-api.js');
const vimeoAPI = require('./vimeo-api.js');
const got = require('got');
const jwt = require('jsonwebtoken');
const config = require('./../config.js');


router.use(
    function verifyToken(req, res, next) {
        const token = req.headers.authorization;
        if (token) {
            jwt.verify(token, config.secret, function (err, out) {
                if (err) {
                    res.status(200).send(JSON.stringify(err));
                } else {
                    req.user = out.user;
                    next();
                }
            });
        } else res.status(200).send(JSON.stringify({
            err: "InvalidToken"
        }));
    }
);

router.get('/session', function (req, res) {
    res.status(200).send(JSON.stringify({ user: req.user }));
});

router.get('/user/:id', function (req, res) {
    got('/user/admin/' + req.user.id, {
        baseUrl: config.userApiUrl,
        json: true
    })
    .then(function (response) {
        if (response.body.isAdmin) {
            got('user/' + req.params.id, {
                    baseUrl: config.userApiUrl,
                    json: true
                })
                .then(response => res.send(response.body))
                .catch(handleError);
        } else {
            res.end();
        }
})
.catch(handleError);
});

router.get('/users', function (req, res) {
    got('user/all/' + req.user.id, {
            baseUrl: config.userApiUrl,
            json: true
        })
        .then(response => res.send(response.body))
        .catch(handleError);
});

router.post('/register', function (req, res) {
    got('/user/register', {
            baseUrl: config.userApiUrl,
            json: true,
            body: req.body
        })
        .then(response => res.send(response.body))
        .catch(handleError);
});

router.post('/user/activateAccount/:token', function (req, res) {
    got('/user/activateAccount/' + req.params.token, {
            baseUrl: config.userApiUrl,
            json: true,
            body: req.body
        })
        .then(response => res.send(response.body))
        .catch(handleError);
});

router.post('/user/admin', function (req, res) {
    got('/user/admin', {
            baseUrl: config.userApiUrl,
            json: true,
            body: req.body
        })
        .then(response => res.send(response.body))
        .catch(handleError);
});

router.post('/user/blocked', function (req, res) {
    got('/user/blocked', {
            baseUrl: config.userApiUrl,
            json: true,
            body: req.body
        })
        .then(response => res.send(response.body))
        .catch(handleError);
});

router.post('/playlist', function (req, res) {
    got('/playlist', {
            baseUrl: config.playlistApiUrl,
            json: true,
            body: req.body
        })
        .then(response => res.send(response.body))
        .catch(handleError);
});

router.get('/playlists/user', function (req, res) {
    got('/playlists/user/' + req.user.id, {
            baseUrl: config.playlistApiUrl,
            json: true
        })
        .then(response => res.send(response.body))
        .catch(handleError);
});

router.get('/playlist/:id', function (req, res) {
    got('/playlist/' + req.params.id, {
            baseUrl: config.playlistApiUrl,
            json: true
        })
        .then(response => res.send(response.body))
        .catch(handleError);
});

router.post('/playlist/video', function (req, res) {
    got('/playlist/video', {
            baseUrl: config.playlistApiUrl,
            json: true,
            body: req.body
        })
        .then(response => res.send(response.body))
        .catch(handleError);
});

router.delete('/playlist/:id', function (req, res) {
    got('/playlist/' + req.params.id, {
            baseUrl: config.playlistApiUrl,
            json: true,
            method: 'DELETE'
        })
        .then(response => res.send(response.body))
        .catch(handleError);
});

router.post("/search", function (req, res) {
    if (req.body.api == "YouTube") {
        youtubeAPI.search(req, function (response) {
            res.status(200).send(JSON.stringify(response));
        });
    }
    if (req.body.api == "Vimeo") {
        vimeoAPI.search(req, function (response) {
            res.status(200).send(JSON.stringify(response));
        });
    }
});

router.post("/page", function (req, res) {
    if (req.body.api == "YouTube") {
        youtubeAPI.page(req, function (response) {
            res.status(200).send(JSON.stringify(response));
        });
    }
    if (req.body.api == "Vimeo") {
        vimeoAPI.page(req, function (response) {
            res.status(200).send(JSON.stringify(response));
        });
    }
});

router.get("/video/youtube/:id", function (req, res) {
    youtubeAPI.video(req, function (response) {
        res.status(200).send(JSON.stringify(response));
    });
});

router.get("/video/vimeo/:id", function (req, res) {
    vimeoAPI.video(req, function (response) {
        res.status(200).send(JSON.stringify(response));
    });
});

router.get("/log/search/", function (req, res) {
    got('/log/search/' + req.user.id, {
            baseUrl: config.logApiUrl,
            json: true
        })
        .then(response => res.send(response.body))
        .catch(handleError);
});

router.post("/log/search", function (req, res) {
    got('/log/search', {
            baseUrl: config.logApiUrl,
            json: true,
            body: req.body
        })
        .then(response => res.send(response.body))
        .catch(handleError);
});

router.get("/log", function (req, res) {
    got('/user/admin/' + req.user.id, {
            baseUrl: config.userApiUrl,
            json: true
        })
        .then(function (response) {
            if (response.body.isAdmin) {
                got('/log/' + req.user.id, {
                        baseUrl: config.logApiUrl,
                        json: true
                    })
                    .then(response => res.send(response.body))
                    .catch(handleError);
            } else {
                res.end();
            }
        })
        .catch(handleError);
});

router.delete('/log', function (req, res) {
    got('/user/admin/' + req.user.id, {
            baseUrl: config.userApiUrl,
            json: true
        })
        .then(function (response) {
            if (response.body.isAdmin) {
                got('/log/search/' + req.user.id, {
                        baseUrl: config.logApiUrl,
                        json: true,
                        method: 'DELETE'
                    })
                    .then(response => res.send(response.body))
                    .catch(handleError);
            } else {
                res.send();
            }
        })
        .catch(handleError);
});

router.delete('/log/search', function (req, res) {
    got('/log/search' + req.user.id, {
            baseUrl: config.logApiUrl,
            json: true,
            method: 'DELETE'
        })
        .then(response => res.send(response.body))
        .catch(handleError);
});

router.get('/logout', function (req, res) {
    got('/logout/' + req.user.id, {
            baseUrl: config.logApiUrl,
            json: true
        })
        .then(response => res.send(response.body))
        .catch(handleError);
});

function handleError(error) {
    console.log('error:', error);
}

module.exports = {
    router: router,
}