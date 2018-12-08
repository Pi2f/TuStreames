(function(){
    'use strict';
    angular.module('app').factory('LogService', LogService);

    LogService.$inject = ['$http','SessionService'];

    function LogService($http,SessionService) {
        var service = {};
        service.GetSearchLog = GetSearchLog;
        service.DeleteAllSearchLogs = DeleteAllSearchLogs;
        return service;

        function GetSearchLog(){
            return $http.get('/api/log/search/'+SessionService.user.id).then(handleSuccess, handleError);
        }
    
        function DeleteAllSearchLogs() {
            return $http.delete('/api/log/search/'+SessionService.user.id).then(handleSuccess, handleError);
        }
    }

    function handleSuccess(res){
        return res;
    }

    function handleError(error){
        return { success: false, message: error };
    }

})();
 
 
 