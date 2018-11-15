
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

const user = require('./user.js');
router.get('/', (req, res) => res.sendFile(__dirname+'/app/index.html'));


router.post('/user', function(req, res) {
  user.getConnectedUser(req.body.token, function(err, user){
    if(err){
      res.status(401).send();
    } else {
      res.status(200).send(user);
    }
  })
});

router.post('/signin', function(req, res){
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
})

router.post('/subscribe', function(req,res) {
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
})

app.use(router);

const server = https.createServer(options,app).listen(config.port, () => console.log(`Example app listening on port ${config.port}!`))
