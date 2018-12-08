const mongoose = require('mongoose');
const config = require('./config.js');

mongoose.connect(config.urlDB,{
    useFindAndModify: false,
}, function(err) {
    if (err) { throw err; } else {
        console.log('Mongo: Database connected');
    }
});