(function () {
    'use strict';

    angular.module('http-auth-interceptor', ['http-auth-interceptor-buffer'])
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
            responseError: function (response) { 
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                }[response.status], response);
                
                return $q.reject(response);
            }
        };
    })
})();