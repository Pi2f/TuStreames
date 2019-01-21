const Vimeo = require('vimeo').Vimeo;
const config = require('../config.js');
const vimeo = new Vimeo(config.vimeo.clientID, config.vimeo.secret, config.vimeo.unauthenticatedToken);

function responseDataList(response) {
    const videoSet = [];
    for (let i = 0; i < response.data.length; i++) {
        let video = {
            id: response.data[i].uri.split("/")[2],
            description: response.data[i].description,
            channel: response.data[i].user.name,
            title: response.data[i].name,
            thumbnails: {
                small: response.data[i].pictures.sizes[0].link,
                medium: response.data[i].pictures.sizes[1].link,
                high: response.data[i].pictures.sizes[2].link
            },
            embedUrl: "https://player.vimeo.com/video/"
        };

        if (video.description != null && video.description.length > 156) {
            video.description = video.description.substring(0, 156) + "...";
        }
        videoSet.push(video);
    }

    return {
        videoSet: videoSet,
        nextPageToken: response.paging.next,
        prevPageToken: response.paging.previous
    }
}

function responseData(response) {
    const video = {
        id: response.uri.split("/")[2],
        description: response.description,
        channel: response.user.name,
        title: response.name,
        thumbnails: {
            small: response.pictures.sizes[0].link,
            medium: response.pictures.sizes[1].link,
            high: response.pictures.sizes[2].link
        },
        embedUrl: "https://player.vimeo.com/video/"
    };

    if (video.description != null && video.description.length > 156) {
        video.description = video.description.substring(0, 156) + "...";
    }

    return {
        video: video,
    }
}

module.exports = {
    search: function (req, cb) {
        vimeo.request({
            method: 'GET',
            path: '/videos',
            query: {
                query: req.body.keyword,
                per_page: 20
            }
        }, function (error, response) {
            if (error) {
                console.log(error);
            }
            const res = responseDataList(response);
            cb(res);
        });
    },

    page: function (req, cb) {
        vimeo.request({
            method: 'GET',
            path: req.body.pageToken,
        }, function (error, response) {
            if (error) {
                console.log(error);
            }
            const res = responseDataList(response);
            cb(res);
        });
    },

    video: function (req, cb) {
        vimeo.request({
            method: 'GET',
            path: '/videos/' + req.params.id,
        }, function (error, response) {
            if (error) {
                console.log(error);
                cb({err:error});
            } else {
                const res = responseData(response);
                cb(res);
            }
        });
    }
}