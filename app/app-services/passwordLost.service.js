(function(){
    'use strict';
    angular.module('app').factory('passwordLostService', passwordLostService);
    
    passwordLostService.$inject = ['$http'];
    function passwordLostService($http) { 
        
        var service = {};
        service.forgot = forgot;


        return service;

        function forgot(email, cb) {
            console.log(email);
            const form = {
                mail : email
            }
            $http.post("/api/forgot", form)
            .then( 
                function(res) {
                    console.log('done');
                    cb(res);
                }, function(res) {
                    console.log('error');
                    cb(res);
                });
        };
        
    }
})();