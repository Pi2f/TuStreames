(function(){
  'use strict';
  
  angular.module('app').component('register', {
    templateUrl: 'app/views/register.view.html',
    controller: RegisterController,
    controllerAs: 'vm'
  });

  RegisterController.$inject = ['$state', 'UserService']
  
  function RegisterController($state, UserService){
    var vm = this;
    vm.register = register;

    function register(){
      vm.isLoading = true;
      const form = {
        username: vm.username,
        mail: vm.mail,
        password: vm.password
      }
      UserService.CreateUser(form).then(function(response){
        if(response.data.success){          
          vm.isLoading = false
          $state.go('authentication');
        }
      });
    }
  }
})();
