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
    console.log("server user");
        user.subscribe(req.body, function(err){
            if(err){
              console.log("erreur serveur");
                res.status(500).send({
                    error: err
                })
            }
            console.log("a fonctionné");
            res.status(201).send();
        });
  });


  
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var User = require('./user.js');
var waterfall = require('async-waterfall');
const routeurHost = 'localhost:3000';

app.post('/forgot', function(req, res) {
  waterfall([
    function(done) {      
      crypto.randomBytes(20, function(err, buf) {
        if (err) console.log("erreur crypto : "+err)
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.getUserModel().findOne({ mail: req.body.mail }, function(err, user) {

        if (!user) {
          console.log('No account with that email address exists.');
          res.status(401).send();
        }
        
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          if (err) console.log("erreur mongo : "+err);
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {      
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'tustreamesnoreply@gmail.com',
          pass: 'heihei89'
        }
      });
      var mailOptions = {
        to: user.mail,
        from: 'tustreamesnoreply@gmail.com',
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          //'https://' + routeurHost + '/api/reset/' + token + '\n\n' +
          'https://' + routeurHost + '/#!/resetPassword?token=' + token + '\n\n' + //A test !
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        if (err) console.log("erreur transporteur : "+err);
        console.log('An e-mail has been sent to ' + user.email + ' with further instructions.');        
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.status(200).send(JSON.stringify({success : true}));
  });
});


/*var path = require ('path');

app.get('/reset/:token', function(req, res) {
  console.log("hello get reset !");
  User.getUserModel().findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    console.log("trouvé!");
    if (!user) {
      console.log('Password reset token is invalid or has expired.');
      //return res.redirect('/forgot');
    }
      return res.sendFile(path.join(__dirname + '/../app/views/resetPassword.view.html'));
  });
});*/

app.post('/reset/:token', function(req, res) {
  waterfall([
    function(done) {
      User.getUserModel().findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          console.log('Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          console.log("password saved");
          done(err, user);
        });
      });
    },
    function(user, done) {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'tustreamesnoreply@gmail.com',
          pass: 'heihei89'
        }
      });
      var mailOptions = {
        to: user.mail,
        from: 'tustreamesnoreply@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.mail + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        console.log('Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    console.log("reset fait");
  });
});


const server = http.createServer(app).listen(config.port, function(){ 
  console.log(`Example app listening on port ${config.port}!`)
});
