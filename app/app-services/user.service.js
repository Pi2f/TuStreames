(function(){
    'use strict';
    angular.module('app').factory('UserService', UserService);

    UserService.$inject = ['$http', 'SessionService'];

    function UserService($http, SessionService) {
        var service = {};
        service.CreateUser = CreateUser;
        service.GetUsers = GetUsers;
        service.SetAdmin = SetAdmin;
        service.ToggleBlocked = ToggleBlocked;
        service.Forgot = Forgot;
        service.Reset = Reset;

        return service;

        function GetUsers(){
            return $http.get('/api/users/'+SessionService.user.id).then(handleSuccess, handleError);
        }

        function CreateUser(form){
            return $http.post('/api/register',form)
            .then(handleSuccess,handleError);
        }

        function SetAdmin(form) {
            return $http.post('/api/user/admin',form)
            .then(handleSuccess,handleError);
        }

        function ToggleBlocked(form) {
            return $http.post('/api/user/blocked',form)
            .then(handleSuccess,handleError);
        }

        function Forgot(mail) {
            const form = {
                mail : mail
            }
            return $http.post("/api/forgot", form)
            .then(handleSuccess, handleError);
        };

        function Reset(password, token) {            
            const form = {
                password : password
            }
            return $http.post("/api/resetpw/"+token, form)
            .then(handleSuccess, handleError);
        };
    }

    function handleSuccess(res){
        return res;
    }

    function handleError(error){
        return { success: false, message: error };
    }

})();
 
 
 