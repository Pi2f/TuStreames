const {
    google
} = require('googleapis');
const googleAuth = require('./google-authentication.js');
const youtube = google.youtube('v3');


function removeEmptyParameters(params) {
    for (let p in params) {
        if (!params[p] || params[p] == 'undefined') {
            delete params[p];
        }
    }
    return params;
}

function searchListByKeyword(auth, requestData, cb) {
    const parameters = removeEmptyParameters(requestData['params']);
    parameters['auth'] = auth;
    youtube.search.list(parameters, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        const res = responseData(response);
        cb(res);
    });
}

function getVideo(auth, requestData, cb) {
    const parameters = removeEmptyParameters(requestData['params']);
    parameters['auth'] = auth;
    youtube.videos.list(parameters, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        const res = responseData(response);
        cb(res);
    });
}

function responseData(response) {
    const videoSet = [];
    for (let i = 0; i < response.data.items.length; i++) {
        const video = {
            id: response.data.items[i].id.videoId,
            description: response.data.items[i].snippet.description,
            channel: response.data.items[i].snippet.channelTitle,
            title: response.data.items[i].snippet.title,
            thumbnails: {
                small: response.data.items[i].snippet.thumbnails.default.url,
                medium: response.data.items[i].snippet.thumbnails.medium.url,
                high: response.data.items[i].snippet.thumbnails.high.url
            },
            embedUrl: "https://www.youtube.com/embed/",
        }
        videoSet.push(video);
    }

    return {
        videoSet: videoSet,
        nextPageToken: response.data.nextPageToken,
        prevPageToken: response.data.prevPageToken,
    };
}

module.exports = {

    search: function (req, cb) {
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

    page: function (req, cb) {
        return googleAuth.authorize().then((auth) => {
            const params = {
                'params': {
                    'maxResults': '20',
                    'part': 'snippet',
                    'q': req.body.keyword,
                    'pageToken': req.body.pageToken,
                    'type': 'video'
                }
            }
            searchListByKeyword(auth, params, cb);
        })
    },
    video: function (req, cb) {
        return googleAuth.authorize().then((auth) => {
            const params = {
                'params': {
                    'id': req.params.id,
                    'maxResults': '1',
                    'part': 'snippet',
                }
            }
            getVideo(auth, params, cb);
        })
    }

}