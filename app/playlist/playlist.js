angular.
module('playlist', ['ngRoute']).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/playlist', {
    templateUrl: 'app/views/playlist.template.html',
    controller: 'playlistCtrl'
  });
}])

.controller('playlistCtrl', [function() {

}]);
