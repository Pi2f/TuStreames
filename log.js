const uuidv4 = require('uuid/v4');
const mongoose = require('mongoose');

const type = {
    SEARCH: 'Search',
    AUTH: 'Auth',
}

const logSchema = new mongoose.Schema({
    _logID: {
        type: String,
        required: true,
        unique: true
    },   
    date: {
        type: Date,
        default: new Date(),
        required: true,
    },
    type: {
        type: String,
        required: true,
        trim: true,
    },
    userID: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true,
    }
});

logSchema.pre('remove', function () {
    var log = this;
    logModel.update(log,
        {
            isActive: false 
        }, function(err){

        }
    );
});

logSchema.pre('find', function (next) {
    var query = this;
    query.where({isActive: true});
    next();
});


const logModel = mongoose.model('Logs', logSchema);

module.exports = {
    addSearchLog: function(data, cb){
        const logData = new logModel({
            _logID: uuidv4(),
            type: type.SEARCH,
            userID: data.user.id,
            message: data.keyword,
        });
        logData.save(function(err){
            console.log(err)
        });
    },

    addLoginLog: function(data, cb){
        const logData = new logModel({
            _logID: uuidv4(),
            type: type.AUTH,
            userID: data._userID,
            message: "Connexion",
        });
        logData.save(function(err){
            console.log(err)
        });
    },

    addLogoutLog: function(data, cb){
        const logData = new logModel({
            _logID: uuidv4(),
            type: type.AUTH,
            userID: data,
            message: "Deconnexion",
        });
        logData.save(function(err){
            console.log(err)
        });
    },

    getSearchLogByUserId: function(id, cb){
        logModel.find({
            userID: id,
            type: type.SEARCH,
        }, function(err, logs) {
            if(err) cb(err);
            else cb(null, logs);
        })
    },

    getAllLogs: function(cb){
        logModel.find({
        }, function(err, logs) {
            if(err) cb(err);
            else cb(null, logs);
        })
    },

    deleteAllAuthLogs: function(cb){
        logModel.find({type: type.AUTH}, 
            function(err, logs){
                logs.forEach(function(log){
                    log.remove(function(err){
                        console.log(err);   
                    });
                })
                if(err) cb(err);
                else cb(null, logs);
            }
        );
    },

    deleteAllSearchLogs: function(id, cb){
        logModel.find(
            { 
                userID: id,
                type: type.SEARCH 
            }, 
            function(err, logs){
                logs.forEach(function(log){
                    log.remove(function(err){
                        console.log(err);   
                    });
                })
                if(err) cb(err);
                else cb(null, logs);
            }
        );
    }
}