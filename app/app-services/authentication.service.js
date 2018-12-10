(function(){
    'use strict';
    angular.module('app').factory('AuthenticationService', AuthenticationService);
    
    AuthenticationService.$inject = ['$http', 'SessionService', 'UserService'];
    function AuthenticationService($http, SessionService) { 
        
        var service = {};
        service.Login = Login;
        service.isAuthenticated = isAuthenticated;
        service.Logout = Logout;

        return service;

        function Login(mail, password) {
            return $http.post('/api/authenticate',{mail: mail, password: password})
            .then(function(response){
                var session = {
                    user: response.data.user,
                    token: response.data.token
                }
                SessionService.CreateSession(session);
                return session;
            }); 
        }

        function isAuthenticated() {
            return SessionService.GetSession().then(function(success){
                if(success){
                    return SessionService.user;
                }
            });
        }

        function Logout() {
            return $http.get('/api/logout/'+SessionService.user.id).then(function(){
                SessionService.DeleteSession();
            });
        }
    }
})();