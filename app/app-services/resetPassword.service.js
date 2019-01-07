(function(){
    'use strict';
    angular.module('app').factory('resetPasswordService', resetPasswordService);
    
    resetPasswordService.$inject = ['$http'];
    function resetPasswordService($http) { 
        
        var service = {};
        service.reset = reset;


        return service;

        function reset(password, token, cb) {
            console.log(password+":"+token);
            const form = {
                password : password
            }
            $http.post("/api/resetpw/"+token, form)
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