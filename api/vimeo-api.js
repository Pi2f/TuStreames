const got = require('got');
var Vimeo = require('vimeo').Vimeo;
const config = require('../config.js');
const client = new Vimeo(config.vimeo.clientID, config.vimeo.secret, config.vimeo.unauthenticatedToken);
          
          
module.exports = {
    search: function (req, cb) {
        client.request({
            method: 'GET',
            path: '/videos',
            query: {
              query : req.body.keyword,
              per_page : 20
            }
          }, function (error, response) {
            if (error) {
              console.log(error);
            }
            var videoSet = [];
            for (var i = 0; i < response.data.length; i++) {  
                video = {
                    id: response.data[i].uri.split("/")[2],
                    description:response.data[i].description,
                    channel:response.data[i].user.name,
                    title:response.data[i].name,
                    thumbnails:{
                          small: response.data[i].pictures.sizes[0].link,
                          medium: response.data[i].pictures.sizes[1].link,
                          high: response.data[i].pictures.sizes[2].link
                    },
                    embedUrl : "https://player.vimeo.com/video/"
                };
                videoSet.push(video);
            }
            const res = {
                videoSet: videoSet,
                nextPageToken: response.paging.next,  
                prevPageToken: response.paging.previous
            }
            cb(res);
          });
    },

    page: function (req, cb) {
        client.request({
            method: 'GET',
            path: req.body.pageToken,
          }, function (error, response) {
            if (error) {
              console.log(error);
            }
            var videoSet = [];
            for (var i = 0; i < response.data.length; i++) {  
                video = {
                    id: response.data[i].uri.split("/")[2],
                    description: response.data[i].description,
                    channel:response.data[i].user.name,
                    title:response.data[i].name,
                    thumbnails:{
                          small: response.data[i].pictures.sizes[0].link,
                          medium: response.data[i].pictures.sizes[1].link,
                          high: response.data[i].pictures.sizes[2].link
                    },
                    embedUrl : "https://player.vimeo.com/video/"
                };
                if(video.description.length > 156) {
                    video.description = video.substring(0,156)+"...";
                }
                videoSet.push(video);
            }

            const res = {
                videoSet: videoSet,
                nextPageToken: response.paging.next,  
                prevPageToken: response.paging.previous
            }
            cb(res);
          });
    }   
}