(function(){
  'use strict';
  angular.module('app').component('log', {
    templateUrl: 'app/views/log.view.html',
    controller: LogCtrl,
    controllerAs: 'vm',
  });
  
  LogCtrl.$inject = ['LogService', 'USER_ROLES', '$state'];
  function LogCtrl(LogService, USER_ROLES, $state) {
    var vm = this;
    vm.getLogs = getLogs;
    vm.deleteLogs = deleteLogs;
    vm.isPageAdmin = isPageAdmin;
    vm.logs = [];

    function getLogs() {
      LogService.GetLogs(isPageAdmin()).then(function(resp){
        vm.logs = resp.data;
      })
    }

    function deleteLogs() {
      LogService.DeleteLogs(isPageAdmin()).then(function(){
        vm.logs = [];
      })
    }

    function isPageAdmin() {
      return USER_ROLES.admin === $state.current.name;
    }
  }

})();
