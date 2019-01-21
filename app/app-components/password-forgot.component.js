(function(){
    'use strict';

    angular.module('app').component('passwordForgot', {
      templateUrl: 'app/views/password-forgot.view.html',
      controller: PasswordForgotController,
      controllerAs: 'vm'
    });
    
    PasswordForgotController.$inject = ['UserService'];

    function PasswordForgotController(UserService){
      var vm = this;
      vm.forgot = forgot;

      function forgot(){
        vm.isLoading = true;
        UserService.Forgot(vm.mail).then(function () {
          vm.isLoading = false;
          if(response.data.err){
            vm.info = response.data.err;
          } else {
            toastr["info"]("Reset password send");          
          }
        });
      }

    }
  })();