var testRouting = angular.
module('streaming', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/streaming', {
    templateUrl: 'app/views/streaming.html',
    controller: 'streamingCtrl'
  });
}])
.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'https://www.youtube.com/**',
    'localhost:3000',
    'https://www.youtube-nocookie.com/**'
  ]);
}).controller('streamingCtrl', ['$scope', '$rootScope', '$http', 'streamingService', function($scope, $rootScope, $http, streamingService) {
    $scope.video = {
        id : $rootScope.videoStream.id,
        description : $rootScope.videoStream.description,
        chaine : $rootScope.videoStream.chaine,
        titre : $rootScope.videoStream.titre,
        url : $rootScope.videoStream.embedUrl + $rootScope.videoStream.id
    };
    
}])
.filter('trusted', ['$sce', function($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);