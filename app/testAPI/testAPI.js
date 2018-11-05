var testRouting = angular.
module('testAPI', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/testAPI', {
    templateUrl: 'app/views/testAPI.html',
    controller: 'testAPICtrl'
  });
}])
.controller('testAPICtrl', ['$scope', '$rootScope', '$http', '$location', 'testAPIService', function($scope, $rootScope, $http, $location, testAPIService) {

  $scope.idVideo = "";
  $scope.descriptionVideo = "";
  $scope.chaineVideo = "";

  $scope.rechercher = function() {
    if ($scope.keyword) {
      testAPIService.rechercher($scope.keyword, function(resp) {
        if (resp.success == true) {
          alert("recherche réussie");

          $scope.idVideo = resp.data.items[0].id.videoId;
          $scope.descriptionVideo = resp.data.items[0].snippet.description;
          $scope.chaineVideo = resp.data.items[0].snippet.channelTitle;
          $scope.titreVideo = resp.data.items[0].snippet.title;
          
        } else {
          alert("recherche ratée")
        }
      });
    } else {
      alert("champ recherche vide")
    }
  };

  $scope.seeVideo = function() {
    if ($scope.idVideo) {
      $rootScope.videoStream = {
        id : $scope.idVideo,
        description : $scope.descriptionVideo,
        chaine : $scope.chaineVideo,
        titre : $scope.titreVideo
      }

      //$state.go('streaming');
      $location.path('/streaming');
    
    } else {
      alert('pas d\'id')
    }
  }

}]);
