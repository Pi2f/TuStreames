(function(){
    'use strict';
  
    angular.module('app').component('resetPassword', {
      templateUrl: 'app/views/resetPassword.view.html',
      controller: resetPasswordController,
      controllerAs: 'vm'
    });
    //TOUJOURS PENSER A AJOUTER DANS LE INDEX.HTML
    resetPasswordController.$inject = ['$scope','$rootScope','$state', 'resetPasswordService'];
    
    function resetPasswordController($scope, $rootScope, $state, resetPasswordService){
      var vm = this;
      vm.reset = reset;
      return vm;
  
      function reset(){
        if (vm.password == vm.passwordCheck) {
          const pw = vm.password;
          const token = document.location.href.split('token=')[1];
          resetPasswordService.reset(pw, token, function(res) {
            if(res.data.success) {
              console.log("success");
            } else {
              console.log("failure");
            }
          });
        } else {
          $scope.password = "";
          $scope.passwordCheck = "";
          alert("Les mots de passe sont différents");
        }  
      }  
    }
  })();
  
  