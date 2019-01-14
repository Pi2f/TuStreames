(function(){
    'use strict';
    angular.module('app').factory('PlaylistService', PlaylistService);

    PlaylistService.$inject = ['$http', 'SessionService'];

    function PlaylistService($http,SessionService) {
        var service = {};
        service.CreatePlaylist = CreatePlaylist;
        service.GetPlaylistsByUserId = GetPlaylistsByUserId;
        service.UpdatePlaylist = UpdatePlaylist;
        service.DeletePlaylist = DeletePlaylist;
        service.StoreVideo = StoreVideo;
        service.GetVideo = GetVideo;
        
        return service;
        
        function StoreVideo(video){
            localStorage.setItem('embedUrl', video.embedUrl);
            localStorage.setItem('title', video.title);
            localStorage.setItem('description', video.description);
            localStorage.setItem('id', video.id);
            localStorage.setItem('channel', video.channel);
            localStorage.setItem('thumbnailHigh', video.thumbnails.high);
            localStorage.setItem('thumbnailMedium', video.thumbnails.medium);
            localStorage.setItem('thumbnailSmall', video.thumbnails.small);
        }

        function GetVideo(video){
            video.embedUrl = localStorage.getItem('embedUrl');
            video.title = localStorage.getItem('title');
            video.description = localStorage.getItem('description');
            video.channel = localStorage.getItem('channel');
            video.id = localStorage.getItem('id');
            video.thumbnails = {};
            video.thumbnails.small = localStorage.getItem('thumbnailSmall');
            video.thumbnails.medium = localStorage.getItem('thumbnailMedium');
            video.thumbnails.high = localStorage.getItem('thumbnailHigh');
        }

        function CreatePlaylist(form){
            return $http.post('/api/playlist',form).then(handleSuccess,handleError);
        }

        function GetPlaylistsByUserId(){
            return $http.get('/api/playlist/'+SessionService.user.id).then(handleSuccess, handleError);
        }

        function UpdatePlaylist(playlist) {
            return $http.post('/api/playlist/video',{playlist: playlist}).then(handleSuccess, handleError);
        }

        function DeletePlaylist(playlist) {
            return $http.delete('/api/playlist/'+playlist._playlistID).then(handleSuccess, handleError);
        }
    }

    function handleSuccess(res){
        return res;
    }

    function handleError(error){
        return { success: false, message: error };
    }

})();
 
 
 