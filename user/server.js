const http = require('http');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config.js');
const methodOverride = require('method-override');
const helmet = require('helmet');
const user = require('./user.js');

const app = express();


app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(express.static(__dirname));


app.use(function onError(err, req, res, next) {
  res.status(500).send(err);
});

app.get('/user/:token', function(req, res){
  user.getConnectedUser(req.params.token, function(err, user){
    if(err){
        res.status(500).send(err);
    } else {
        res.status(200).send(JSON.stringify(user));
    }
  });
});


  app.get('/users/:id', function(req, res) {
    user.isAdmin(req.params.id, function(isAdmin){
      if(isAdmin){
        user.getAll(function(err, users){
          if(err) throw new Error("Broke");
          else res.status(200).send(users);
        });
      }
    });
  });
  
  app.post('/authenticate', function(req, res){
    if(req.body.mail && req.body.password){
        user.signin(req.body.mail, req.body.password, function(err, data){
            if(err) res.status(401).send();
            else {
                // log.addLoginLog(data);
                user.createToken(data, function(response){
                    res.status(200).send(JSON.stringify(response));
                });
            }
        });
    }
  });

  app.post('/register', function(req,res) {
    if(!user.isExistingUser()){
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
  


const server = http.createServer(app).listen(config.port, function(){ 
  console.log(`Example app listening on port ${config.port}!`)
});
