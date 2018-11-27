(function(){
    'use strict';
    angular.module('app').factory('SearchService', SearchService);

    SearchService.$inject = ['$http'];

    function SearchService($http) {
        var service = {};
        service.Search = Search;
        return service;
        
        function Search(keyword, cb) {
            var req = {
                keyword : keyword
            };
            $http.post('/search', req)
                .then(function(resp) {
                    cb(resp.data);
                }, function(resp) {
                    alert("Erreur");
                });
        };
    
    }

    function handleSuccess(res){
        return res;
    }

    function handleError(error){
        return { success: false, message: error };
    }

})();
 
 
 