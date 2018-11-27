(function(){
    'use strict';
    angular.module('app').factory('AuthenticationService', AuthenticationService);
    
    AuthenticationService.$inject = ['$http', '$rootScope', 'UserService'];
    function AuthenticationService($http, $rootScope, UserService) { 
        
        var service = {};
        service.Login = Login;
        service.StoreToken = StoreToken;
        service.GetToken = GetToken;
        service.RemoveToken = RemoveToken;

        return service;

        function Login(mail, password, cb) {
            return $http.post('/authenticate',{mail: mail, password: password})
            .then(handleSuccess,handleError); 
        }
        
        function StoreToken(token){
            localStorage.setItem('tuStreamesToken', token)
        }

        function RemoveToken(){
            localStorage.removeItem('tuStreamesToken');        
        }

        function GetToken(){
            return localStorage.getItem('tuStreamesToken');
        }
        

        function handleSuccess(res){
            return res;
        }
    
        function handleError(error){
            return { success: false, message: error };
        }
    }
})();