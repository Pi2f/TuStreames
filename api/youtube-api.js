var { google } = require('googleapis');
const googleAuth = require('./google-authentication.js');
const fs = require('fs');
const log = require('../log.js');

/**
 * Remove parameters that do not have values.
 *
 * @param {Object} params A list of key-value pairs representing request
 *                        parameters and their values.
 * @return {Object} The params object minus parameters with no values set.
 */
function removeEmptyParameters(params) {
    for (var p in params) {
        if (!params[p] || params[p] == 'undefined') {
            delete params[p];
        }
    }
    return params;
}
    
/**
 * Create a JSON object, representing an API resource, from a list of
 * properties and their values.
 *
 * @param {Object} properties A list of key-value pairs representing resource
 *                            properties and their values.
 * @return {Object} A JSON object. The function nests properties based on
 *                  periods (.) in property names.
 */
// function createResource(properties) {
//     var resource = {};
//     var normalizedProps = properties;
//     for (var p in properties) {
//         var value = properties[p];
//         if (p && p.substr(-2, 2) == '[]') {
//         var adjustedName = p.replace('[]', '');
//         if (value) {
//             normalizedProps[adjustedName] = value.split(',');
//         }
//         delete normalizedProps[p];
//         }
//     }
//     for (var p in normalizedProps) {
    //         // Leave properties that don't have values out of inserted resource.
    //         if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
        //         var propArray = p.split('.');
        //         var ref = resource;
        //         for (var pa = 0; pa < propArray.length; pa++) {
            //             var key = propArray[pa];
            //             if (pa == propArray.length - 1) {
//             ref[key] = normalizedProps[p];
//             } else {
    //             ref = ref[key] = ref[key] || {};
    //             }
//         }
//         };
//     }
//     return resource;
// }

function searchListByKeyword(auth, requestData, res) {
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
        res.send(JSON.stringify(videoSet));
    });
}  
          
module.exports = {

    search: function(req, res){
         // Load client secrets from a local file.
         return fs.readFile('./api/client_secret.json', function processClientSecrets(err, content) {
            if (err) {
                console.log('Error loading client secret file: ' + err);
                return;
            }
            // Authorize a client with the loaded credentials, then call the YouTube API.
            //See full code sample for authorize() function code.
            googleAuth.authorize(JSON.parse(content), {'params': {'maxResults': '20',
                        'part': 'snippet',
                        'q': req.body.keyword,
                        'type': 'video'}}, res, searchListByKeyword);
            log.addSearchLog(req.body);
        });
    },

}