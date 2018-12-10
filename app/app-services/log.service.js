(function(){
    'use strict';
    angular.module('app').factory('LogService', LogService);

    LogService.$inject = ['$http','SessionService'];

    function LogService($http,SessionService) {
        var service = {};
        service.GetLogs = GetLogs;
        service.DeleteLogs = DeleteLogs;
        return service;

        function GetLogs(isPageAdmin) {
            if(isPageAdmin){
                return  $http.get('/api/log/'+SessionService.user.id).then(handleSuccess, handleError);
            } else {
                return $http.get('/api/log/search/'+SessionService.user.id).then(handleSuccess, handleError);
            }
        }
    
        function DeleteLogs(isPageAdmin) {
            if(isPageAdmin){
                return  $http.delete('/api/log/'+SessionService.user.id).then(handleSuccess, handleError);
            } else {
                return $http.delete('/api/log/search/'+SessionService.user.id).then(handleSuccess, handleError);
            }
        }
    }

    function handleSuccess(res){
        return res;
    }

    function handleError(error){
        return { success: false, message: error };
    }

})();
 
 
 