angular.module('app').component('subscribe', {
  templateUrl: 'app/views/subscribe.template.html',
  controller: ['$scope', '$state', 'subscribeService', function($scope, $state, subscribeService){
    $scope.subscribe = function(){  
      const form = {
        username: $scope.username,
        mail: $scope.mail,
        password: $scope.password
      }
      subscribeService.subscribe(form, function(response){
        if(response.data.success){          
          $state.go('login');
        }
      });
    }
  }]
});
