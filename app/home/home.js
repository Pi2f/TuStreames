angular.
module('home', ['ngRoute']).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'app/home/home.template.html',
    controller: 'homeCtrl'
  });
}])

.controller('homeCtrl', [function() {

}]);
