angular.
module('administration', ['ngRoute']).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/administration', {
    templateUrl: 'app/views/administration.template.html',
    controller: 'administrationCtrl'
  });
}])

.controller('administrationCtrl', [function() {

}]);
