
const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config.js');

const options = {
  key: fs.readFileSync(path.resolve('server.key')),
  cert : fs.readFileSync(path.resolve('server.cert')),
}

const app = express();
const router = express.Router();

app.use(morgan('dev'));
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


const user = require('./user.js');
const playlist = require('./playlist.js');
const googleAuth = require('./google-authentication.js');
const youtubeAPI = require('./youtube-api.js');

router.get('/', (req, res) => res.sendFile(__dirname+'/app/index.html'));


router.get('/user/:token', function(req, res) {
  user.getConnectedUser(req.params.token, function(err, user){
    if(err){
      res.status(500).send(err);
    } else {
      res.status(200).send(JSON.stringify(user));
    }
  })
});

router.post('/authenticate', function(req, res){
  if(req.body.mail && req.body.password){
    user.signin(req.body.mail, req.body.password, function(err, data){
      if(err) res.status(500).send();
      else {
        user.createToken(data, function(response){
          res.status(200).send(response);
        });
      }
    });
  }
});

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
    if(err){
      res.status(500).send();
    } else {
      res.status(201).send();
    }
  });
});

router.get('/playlist/:id', function(req, res) {
  playlist.getByUserId(req.params.id, function(err, playlists){
    if(err){
      res.status(500).send(err);
    } else {
      res.status(200).send(JSON.stringify(playlists));
    }
  })
});

app.use(router);


app.post("/search", function(req, res) {
  // Load client secrets from a local file.
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the YouTube API.
    //See full code sample for authorize() function code.
    googleAuth.authorize(JSON.parse(content), {'params': {'maxResults': '20',
                 'part': 'snippet',
                 'q': req.body.keyword,
                 'type': 'video'}}, res, youtubeAPI.searchListByKeyword);

  });
});


const server = https.createServer(options,app).listen(config.port, () => console.log(`Example app listening on port ${config.port}!`))
