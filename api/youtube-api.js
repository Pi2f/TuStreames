var { google } = require('googleapis');
const googleAuth = require('./google-authentication.js');
require('dotenv').config();

function removeEmptyParameters(params) {
    for (var p in params) {
        if (!params[p] || params[p] == 'undefined') {
            delete params[p];
        }
    }
    return params;
}

function searchListByKeyword(auth, requestData, cb) {
    var service = google.youtube('v3');
    var parameters = removeEmptyParameters(requestData['params']);
    var videoSet = [];
    parameters['auth'] = auth;
    service.search.list(parameters, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }

        for (var i = 0; i < response.data.items.length; i++) {            
            var video = {
              id : response.data.items[i].id.videoId,
              description : response.data.items[i].snippet.description,
              channel : response.data.items[i].snippet.channelTitle,
              title : response.data.items[i].snippet.title,
              thumbnails : {
                small: response.data.items[i].snippet.thumbnails.default.url,
                medium: response.data.items[i].snippet.thumbnails.medium.url,
                high: response.data.items[i].snippet.thumbnails.high.url
              },
              embedUrl : "https://www.youtube.com/embed/",
            }
            videoSet.push(video);
        }

        const res = {
            videoSet: videoSet,
            nextPageToken: response.data.nextPageToken,
            prevPageToken: response.data.prevPageToken,
        };
        
        cb(res);
    });
}  
          
module.exports = {

    search: function(req, cb){
        return googleAuth.authorize().then((auth) => {
            const params = {
                'params': {
                     'maxResults': '20',
                     'part': 'snippet',
                     'q': req.body.keyword,            
                     'type': 'video'
                 }
             }
            searchListByKeyword(auth, params, cb);

        })
    },

    page: function(req, cb){
           return googleAuth.authorize().then((auth) => {
               const params = {
                   'params': {
                        'maxResults': '20',
                        'part': 'snippet',
                        'q': req.body.keyword,   
                        'pageToken':req.body.pageToken,         
                        'type': 'video'
                    }
                }
               searchListByKeyword(auth, params, cb);

           })
   }, 

}