(function(){
    'use strict';
  
    angular.module('app').component('passwordLost', {
      templateUrl: 'app/views/passwordLost.view.html',
      controller: passwordLostController,
      controllerAs: 'vm'
    });
    //TOUJOURS PENSER A AJOUTER DANS LE INDEX.HTML
    passwordLostController.$inject = ['$scope','$rootScope','$state', 'passwordLostService'];
    
    function passwordLostController($scope, $rootScope, $state, passwordLostService){
      var vm = this;
      vm.forgot = forgot;
      return vm;
  
      function forgot(){
        const mail = vm.mail;
        passwordLostService.forgot(mail, function (response) {
          if (response.data.success) {
            alert('Reset envoyé');
          } else {
            alert('Err : '+response.data.errorMsg)
          }
        });
      }
      
    }
  })();
  
  