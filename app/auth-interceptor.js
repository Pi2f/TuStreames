(function () {
    'use strict';

    angular.module('app')
    .config(function($httpProvider){
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
    })

    .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        return {
            request: function(config){
                const token = localStorage.getItem('tuStreamesToken');
                if(token){
                    config.headers.authorization = token;
                }
                return config;
            },
            responseError: function (response) { 
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                    403: AUTH_EVENTS.forbidden
                }[response.status], response);
                
                return $q.reject(response);
            }
        };
    }) 
})();