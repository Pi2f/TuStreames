(function(){
  'use strict';
  angular.module('app').component('usersList', {
    templateUrl: 'app/views/users-list.view.html',
    controller: UsersListCtrl,
    controllerAs: 'vm',
  });
  
  UsersListCtrl.$inject = ['UserService'];
  function UsersListCtrl(UserService) {
    var vm = this;
    vm.getUsers = getUsers;
    vm.users = [];

    function getUsers() {
      UserService.GetUsers().then(function(resp){
        vm.users = resp.data;
      })
    }
  }

})();
