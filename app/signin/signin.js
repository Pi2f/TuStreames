angular.module('app').component('signin', {
  templateUrl: 'app/views/signin.template.html',
  controller: ['$scope', '$state', 'signinService', function($scope, $state, signinService){
    $scope.signin = function(){  
      signinService.signin($scope.mail, $scope.password, function(response){
        signinService.storeToken(response.data.token);
        $state.go('playlist');        
      });
    }
  }]
});

