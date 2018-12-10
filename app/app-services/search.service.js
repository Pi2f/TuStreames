(function(){
    'use strict';
    angular.module('app').factory('SearchService', SearchService);

    SearchService.$inject = ['$http'];

    function SearchService($http) {
        var service = {};
        service.Search = Search;
        return service;
        
        function Search(data) {
            return $http.post('/api/search', data)
                .then(function(resp) {                
                    return resp.data;
                }
                ,handleError);
        };
    
    }

    // function handleSuccess(res){
    //     return res;
    // }

    function handleError(error){
        return { success: false, message: error };
    }

})();
 
 
 