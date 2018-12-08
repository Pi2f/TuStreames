(function(){
  'use strict';
  angular.module('app').component('log', {
    templateUrl: 'app/views/log.view.html',
    controller: LogCtrl,
    controllerAs: 'vm',
  });
  
  LogCtrl.$inject = ['LogService'];
  function LogCtrl(LogService) {
    var vm = this;
    vm.getLogs = getLogs;
    vm.deleteSearchLogs = deleteSearchLogs;
    vm.logs = [];

    function getLogs() {
      LogService.GetSearchLog().then(function(resp){
        vm.logs = resp.data;
      })
    }

    function deleteSearchLogs() {
      LogService.DeleteAllSearchLogs().then(function(resp){
        vm.logs = [];
      })
    }
  }

})();
