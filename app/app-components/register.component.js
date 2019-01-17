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
        vm.isLoading = false;
        if(response.data.err){
          vm.info = response.data.err;
        } else {
          $state.go('authentication');
          toastr["success"]("Success! Your account still need to be activated. A confirmation mail has been sent to "+vm.mail);                    
        }
      });
    }
  }
})();
