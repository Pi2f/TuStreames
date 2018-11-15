angular.module('app').factory('subscribeService', ['$http', function($http) {
    return {
        subscribe: function (form, cb) {
            $http.post('/subscribe',form)
            .then(function(value){
                cb(value);
            }, function(err){

            });
        }
    }
    
}])