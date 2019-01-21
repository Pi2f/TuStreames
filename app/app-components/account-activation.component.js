(function(){
    'use strict';
  
    angular.module('app').component('accountActivation', {
      templateUrl: 'app/views/account-activation.view.html',
      controller: accountActivationCtrl,
      controllerAs: 'vm'
    });
  
    accountActivationCtrl.$inject = ['$state','UserService'];
  
    function accountActivationCtrl($state, UserService){
      var vm = this;
      vm.activate = activate;
  
      function activate(){
        vm.isLoading = true;
        const token = document.location.href.split('token=')[1];
        UserService.Activate(token).then(function(response) {     
          vm.isLoading = false;
          if(response.data.err){
            vm.info = response.data.err;
          } else {     
            $state.go('authentication');
            toastr["success"]("Success! Your account has been activated.");
          }
        });  
      }  
    }
})();