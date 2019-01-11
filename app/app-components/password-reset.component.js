(function(){
  'use strict';

  angular.module('app').component('passwordReset', {
    templateUrl: 'app/views/password-reset.view.html',
    controller: PasswordResetCtrl,
    controllerAs: 'vm'
  });

  PasswordResetCtrl.$inject = ['$state','UserService'];

  function PasswordResetCtrl($state, UserService){
    var vm = this;
    vm.reset = reset;

    function reset(){
      if (vm.password == vm.passwordCheck) {
        const token = document.location.href.split('token=')[1];
        UserService.Reset(vm.password, token).then(function() {          
          $state.go('authentication');
          toastr["success"]("Success! Your password has been changed.")
        });
      } else {
        vm.password = "";
        vm.passwordCheck = "";
      }  
    }  
  }
})();

