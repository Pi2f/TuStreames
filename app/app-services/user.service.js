(function(){
    'use strict';
    angular.module('app').factory('UserService', UserService);

    UserService.$inject = ['$http', 'SessionService'];

    function UserService($http, SessionService) {
        var service = {};
        service.CreateUser = CreateUser;
        service.GetUsers = GetUsers;

        return service;

        function GetUsers(){
            return $http.get('/api/users/'+SessionService.user.id).then(handleSuccess, handleError);
        }

        function CreateUser(form, cb){
            return $http.post('/api/register',form)
            .then(handleSuccess,handleError);
        }
    }

    function handleSuccess(res){
        return res;
    }

    function handleError(error){
        return { success: false, message: error };
    }

})();
 
 
 