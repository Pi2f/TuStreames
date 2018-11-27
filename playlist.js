const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const config = require('./config.js');

mongoose.connect(config.urlDB, function(err) {
    if (err) { throw err; } else {
        console.log('Mongo: Database connected');
    }
});

const playlistSchema = new mongoose.Schema({
    _playlistID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    userID: {
        type: String,
        required: true,
        trim: true
    }
});


const playlistModel = mongoose.model('Playlists', playlistSchema);

module.exports = {
    add: function(data, cb){

        const playlistData = new playlistModel({
            _playlistID: uuidv4(),
            name: data.name,
            userID: data.user.id,
        });
        playlistData.save(function(err){
            if(err) cb(err);
            else cb();
        });
    },

    getByUserId: function(id, cb){
        playlistModel.find({userID: id}, function(err, playlists) {
            if(err) cb(err);
            else cb(null, playlists)
        })
    }

}