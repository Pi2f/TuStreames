angular.
module('subscribe', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/subscribe', {
    templateUrl: 'app/views/subscribe.template.html',
    controller: 'subscribeCtrl'
  });
}])
.controller('subscribeCtrl', [function() {

}]);
