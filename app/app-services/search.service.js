(function(){
    'use strict';
    angular.module('app').factory('SearchService', SearchService);

    SearchService.$inject = ['$http'];

    function SearchService($http) {
        var service = {};
        service.Search = Search;
        service.Page = Page;
        return service;
        
        function Search(data) {
            return $http.post('/api/search', data)
                .then(handleSuccess, handleError);
        };

        function Page(data) {
            return $http.post('/api/page', data)
                .then(handleSuccess, handleError);
        };
    }

    function handleSuccess(res){
        return res.data;
    }

    function handleError(error){
        return { success: false, message: error };
    }

})();
 
 
 