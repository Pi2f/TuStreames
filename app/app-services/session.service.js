(function(){
    'use strict';
    angular.module('app').factory('SessionService', SessionService);

    SessionService.$inject = ['UserService']
    
    function SessionService(UserService) { 
        var service = {};
        service.DeleteSession = DeleteSession;
        service.CreateSession = CreateSession;
        service.StoreToken = StoreToken;
        service.RemoveToken = RemoveToken;
        service.GetToken = GetToken;
        service.GetSession = GetSession;
        service.user = null;

        return service;

        function StoreToken(token){
            localStorage.setItem('tuStreamesToken', token)
        }

        function RemoveToken(){
            localStorage.removeItem('tuStreamesToken');        
        }

        function GetSession(){
            var token = GetToken();
            if(token != null) {
                return UserService.GetUser(token)
                .then(function(response){
                    var session = {
                        user: response.data.user,
                        token: token
                    }
                    CreateSession(session);
                    return true;
                }, function(){
                    return false;
                });
            } else {
                return new Promise(function(resolve, reject){
                    resolve(false);
                });
            }
        }

        function GetToken(){
            return localStorage.getItem('tuStreamesToken');
        }

        function CreateSession(session) {
            service.user = session.user;
            StoreToken(session.token);
        }

        function DeleteSession() {
            service.user = null;
            RemoveToken();
        }

    
    }
})();