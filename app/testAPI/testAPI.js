var testRouting = angular.
module('testAPI', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/testAPI', {
    templateUrl: 'app/views/testAPI.html',
    controller: 'testAPICtrl'
  });
}])
.controller('testAPICtrl', ['$scope', '$http', 'testAPIService', function($scope, $http, testAPIService) {

  var v = "au revoir";

  $scope.setText = function() {
    $scope.maVar = v;
  };

  $scope.setText();
}]);
