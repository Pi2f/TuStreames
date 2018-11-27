(function(){
  'use strict';
  
  angular.module('app').component('register', {
    templateUrl: 'app/views/register.view.html',
    controller: RegisterController,
    controllerAs: 'vm'
  });

  RegisterController.$inject = ['$rootScope', 'UserService', '$state']
  
  function RegisterController($rootScope, UserService){
    var vm = this;
    vm.register = register;

    function register(){
      const form = {
        username: vm.username,
        mail: vm.mail,
        password: vm.password
      }
      UserService.CreateUser(form, function(response){
        if(response.data.success){          
          $state.go('authenticate');
        }
      });
    }
  }
})();
