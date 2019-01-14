(function(){
  'use strict';
  angular.module('app').component('log', {
    templateUrl: 'app/views/log.view.html',
    controller: LogCtrl,
    controllerAs: 'vm',
  });
  
  LogCtrl.$inject = ['LogService', 'USER_ROLES', '$state', 'UserService'];
  function LogCtrl(LogService, USER_ROLES, $state, UserService) {
    var vm = this;
    vm.getLogs = getLogs;
    vm.deleteLogs = deleteLogs;
    vm.isPageAdmin = isPageAdmin;
    vm.logs = [];

    function getLogs() {
      LogService.GetLogs(isPageAdmin()).then(function(resp){
        vm.logs = resp.data;
        vm.logs.forEach(log => 
          UserService.GetUser(log.userID).then(function(resp){
            log.username = resp.data.username;
          })
        );
      })
    }

    function deleteLogs() {
      vm.isLoading = true;
      LogService.DeleteLogs(isPageAdmin()).then(function(){
        vm.logs = [];
        vm.isLoading = false;
      })
    }

    function isPageAdmin() {
      return USER_ROLES.admin === $state.current.name;
    }
  }

})();
