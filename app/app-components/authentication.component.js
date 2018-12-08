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
      AuthenticationService.Login(vm.mail, vm.password).then(function(data){
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, data.user);
        $state.go('home');        
      }, function () {
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      });
    }
  }
})();

