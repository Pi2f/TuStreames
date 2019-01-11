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

    .factory('AuthInterceptor', function ($rootScope, $q, $location, AUTH_EVENTS) {
        return {
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