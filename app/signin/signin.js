angular.
module('signin', ['ngRoute']).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/signin', {
    templateUrl: 'app/views/signin.template.html',
    controller: 'signinCtrl'
  });
}])

.controller('signinCtrl', [function() {

}]);
