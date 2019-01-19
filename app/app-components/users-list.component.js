(function(){
  'use strict';
  angular.module('app').component('usersList', {
    templateUrl: 'app/views/users-list.view.html',
    controller: UsersListCtrl,
    controllerAs: 'vm',
  });
  
  UsersListCtrl.$inject = ['SessionService','UserService', 'USER_ROLES'];
  function UsersListCtrl(SessionService, UserService, USER_ROLES) {
    var vm = this;
    vm.getUsers = getUsers;
    vm.isAdmin = isAdmin;
    vm.setAdmin = setAdmin;
    vm.toggleBlocked = toggleBlocked;
    vm.users = [];
    vm.currentUser = SessionService.user;
    vm.select = select;

    function isAdmin(user){
      if(user){
        return user.role.indexOf(USER_ROLES.admin) !== -1;
      }
    }

    function select(user){
      vm.user = user;
    }

    function setAdmin() {
      vm.isLoading = true;
      UserService.SetAdmin(vm.user).then(function(response) {
        $('#setAdmin').modal('hide');
        getUsers();
        vm.isLoading = false;
      });
    }

    function toggleBlocked(){
      vm.isLoading = true;
      UserService.ToggleBlocked(vm.user).then(function(response) {
        $('#toggleBlocked').modal('hide');
        getUsers();
        vm.isLoading = false;
      });
    }

    function getUsers() {
      vm.isLoading = true;
      UserService.GetUsers().then(function(resp){
        vm.users = resp.data;
        vm.isLoading = false;
      })
    }
  }

})();
