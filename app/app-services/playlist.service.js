(function(){
    'use strict';
    angular.module('app').factory('PlaylistService', PlaylistService);

    PlaylistService.$inject = ['$http'];

    function PlaylistService($http) {
        var service = {};
        service.CreatePlaylist = CreatePlaylist;
        service.GetPlaylistsByUserId = GetPlaylistsByUserId;

        return service;

        function CreatePlaylist(form){
            return $http.post('/playlist',form).then(handleSuccess,handleError);
        }

        function GetPlaylistsByUserId(id){
            return $http.get('/playlist/'+id).then(handleSuccess, handleError);
        }
    }

    function handleSuccess(res){
        return res;
    }

    function handleError(error){
        return { success: false, message: error };
    }

})();
 
 
 