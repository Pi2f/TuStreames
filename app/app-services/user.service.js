(function(){
    'use strict';
    angular.module('app').factory('UserService', UserService);

    UserService.$inject = ['$http'];

    function UserService($http) {
        var service = {};
        service.GetUser = GetUser;
        service.CreateUser = CreateUser;

        return service;
        
        function GetUser(token) {
            return $http.get('/user/'+token)
            .then(handleSuccess,handleError);
        }

        function CreateUser(form, cb){
            return $http.post('/register',form)
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
 
 
 