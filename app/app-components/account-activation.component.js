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
        const token = document.location.href.split('token=')[1];
        UserService.Activate(token).then(function() {          
            $state.go('authentication');
            toastr["success"]("Success! Your account has been activated.")
        });  
      }  
    }
})();