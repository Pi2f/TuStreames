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

        return service;

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
 
 
 