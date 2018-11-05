var testRouting = angular.
module('testAPI', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/testAPI', {
    templateUrl: 'app/views/testAPI.html',
    controller: 'testAPICtrl'
  });
}])
.controller('testAPICtrl', ['$scope', '$rootScope', '$http', '$location', 'testAPIService', function($scope, $rootScope, $http, $location, testAPIService) {

  var videoSet = [];

  $scope.rechercher = function() {
    if ($scope.keyword) {
      testAPIService.rechercher($scope.keyword, function(resp) {
        if (resp.success == true) {
          console.log(resp.data.items[0]);
          for (var i = 0; i < resp.data.items.length; i++) {
            
            video = {
              id : resp.data.items[i].id.videoId,
              description : resp.data.items[i].snippet.description,
              channel : resp.data.items[i].snippet.channelTitle,
              title : resp.data.items[i].snippet.title,
              thumbnail : resp.data.items[i].snippet.thumbnails.default.url
            }
            videoSet.push(video);
          }
          $scope.nbRes = resp.data.items.length;
          $scope.videoSet = videoSet;
        } else {
          alert("recherche échouée")
        }
      });
    } else {
      alert("Aucun mot clef renseigné")
    }
  };

  $scope.rechercherVimeo = function() {
    if ($scope.keywordVimeo) {
      testAPIService.rechercherVimeo($scope.keywordVimeo, function(resp) {
        
      });
    } else {
      alert ("Pas de mot clef renseigné")
    }
  };

  $scope.stream = function(video) {
      $rootScope.videoStream = video;

      //$state.go('streaming');
      $location.path('/streaming');
  }

}]);
