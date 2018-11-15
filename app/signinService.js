angular.module('app').factory('signinService', ['$http', function($http) { 
    return {
        signin: function (mail, password, cb) {
            $http.post('/signin',{mail, password})
            .then(function(response){
                cb(response);
            }, function(err){
                console.log(err);
            });
        },
        
        storeToken: function(token){
            localStorage.setItem('tuStreamesToken', token)
        },
        
        removeToken: function(){
            localStorage.removeItem('tuStreamesToken');        
        },
        
        getToken: function(){
            return localStorage.getItem('tuStreamesToken');
        },

        getConnectedUser: function(cb) {
            var token = localStorage.getItem('tuStreamesToken');
            $http.post('/user',{ token })
            .then(function(response){
                cb(null, response.data);
            }, function(err){
                cb(err);
            });
        },
    }
    
}])