(function(){
  'use strict';

  angular.module('app').component('authentication', {
    templateUrl: 'app/views/authentication.view.html',
    controller: AuthenticationController,
    controllerAs: 'vm'
  });
  
  AuthenticationController.$inject = ['$rootScope','$state', 'AuthenticationService', 'AUTH_EVENTS'];
  
  function AuthenticationController($rootScope, $state, AuthenticationService, AUTH_EVENTS){
    var vm = this;
    vm.login = login;
    return vm;

    function login(){  
      vm.isLoading = true;
      AuthenticationService.Login(vm.mail, vm.password).then(function(data){
        console.log(data);
        vm.isLoading = false;        
        if(data.err){
          $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
          vm.info = data.err;
        } else {
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, data.user);
          $state.go('home');
        }
      });
    }
  }
})();

