const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const config = require('./config.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

mongoose.connect(config.urlDB, function(err) {
    if (err) { throw err; } else {
        console.log('Mongo: Database connected');
    }
  });

const userSchema = new mongoose.Schema({
    _userID: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    mail: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
});

userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 8, function (err, hash) {
      if (err) {
        throw err;
      }
      user.password = hash;
      next();
    });
});

function isStrongPassword(data) {
    const strongPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
    return strongPassword.test(data);
}

function isValidMail(data) {
    const validMail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);    
    return validMail.test(data);
}

function checkForExistingUser(mail, cb){
    userModel.findOne({mail: mail}, function(err, result){
        cb(result);
    });
}


const userModel = mongoose.model('Users', userSchema);

module.exports = {
    subscribe: function(data, cb){
        if(isStrongPassword(data.password) && isValidMail(data.mail)){
            checkForExistingUser(data.mail, function(result){
                if(result == null){
                    const userData = new userModel({
                        username: data.username,
                        mail: data.mail,
                        password: data.password,
                        _userID: uuidv4()
                    });
                    userData.save(function(err){
                        if(err) cb(err);
                    });
                } else {
                    cb(new Error("Mail déjà utilisé par un autre utilisateur"))
                }
            });
            
        } else {
            cb(new Error("Invalide password or mail"));
        }
    },

    signin: function(mail, password, cb){  
        userModel.findOne({mail: mail}, 
            function(err, user){
                if(err){
                    cb(err);
                } else if (!user){
                    const err = new Error("L'utilisateur n'existe pas");
                    error.status = 401;
                    return cb(err);
                } else {
                    bcrypt.compare(password, user.password, function(err, result) {
                        if(result === true){                            
                            return cb(null, user);
                        } else {                
                            return cb(new Error("Passowd false"));
                        }
                        
                    });
                }
            }
        )
    },

    createToken: function(user,cb) {
        const payload = {
            user: {
                id: user._userID,
                mail: user.mail,
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
    },

    getConnectedUser: function(token, cb){
        if(token){
            jwt.verify(token, config.secret, function(err, out){
                if(err){
                    cb(err);
                } else {
                    cb(null,out);
                }
            });
        } else cb(new Error("Invalid Token"));
    }
}