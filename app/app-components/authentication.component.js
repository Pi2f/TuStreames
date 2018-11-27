(function(){
  'use strict';

  angular.module('app').component('authentication', {
    templateUrl: 'app/views/authentication.view.html',
    controller: AuthenticationController,
    controllerAs: 'vm'
  });
  
  AuthenticationController.$inject = ['$rootScope', '$state', 'AuthenticationService'];
  
  function AuthenticationController($rootScope, $state, AuthenticationService){
    var vm = this;

    vm.login = login;

    return vm;

    function login(){  
      AuthenticationService.Login(vm.mail, vm.password).then(function(response){
        $rootScope.user = response.data.user;
        AuthenticationService.StoreToken(response.data.token);
        $state.go('home');        
      });
    }
  }
})();

