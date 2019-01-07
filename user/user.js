const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('./config.js');

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
    role: {
        type: Array,
        required: true,
        default: ['*'],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
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

    getUserModel : function() {
        return userModel;
    },

    isAdmin: function(data, cb){
        return userModel.findOne({
            _userID: data,
        }, function (err, user) {
           cb(user.role.indexOf('admin') !== -1);
        })
    },

    subscribe: function(data, cb){
        if(isStrongPassword(data.password) && isValidMail(data.mail)){
            console.log("strong password & valid email");
            checkForExistingUser(data.mail, function(result){
                if(result == null){
                    console.log("user don't exist yet")
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
                    console.log("user already exist");
                    cb(new Error("Mail déjà utilisé par un autre utilisateur"))
                }
            });
            
        } else {
            console.log("Invalide password or mail");
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
    },

    getAll: function(cb){
        userModel.find({}, function(err, users) {
            if(err) cb(err);
            else cb(null, users);
        })
    },

    checkForExistingUser : function (mail, cb){
        userModel.findOne({mail: mail}, function(err, result){
            cb(result);
        });
    }
}