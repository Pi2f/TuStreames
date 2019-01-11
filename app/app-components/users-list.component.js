(function(){
  'use strict';
  angular.module('app').component('usersList', {
    templateUrl: 'app/views/users-list.view.html',
    controller: UsersListCtrl,
    controllerAs: 'vm',
  });
  
  UsersListCtrl.$inject = ['UserService', 'USER_ROLES'];
  function UsersListCtrl(UserService, USER_ROLES) {
    var vm = this;
    vm.getUsers = getUsers;
    vm.isAdmin = isAdmin;
    vm.setAdmin = setAdmin;
    vm.toggleBlocked = toggleBlocked;
    vm.users = [];

    $('#setAdmin').on('show.bs.modal', function(e) {
      vm.user = $(e.relatedTarget).data('user');
    });

    $('#toggleBlocked').on('show.bs.modal', function(e) {
      vm.user = $(e.relatedTarget).data('user');
    });

    function isAdmin(user){
      return user.role.indexOf(USER_ROLES.admin) !== -1;
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
      UserService.GetUsers().then(function(resp){
        vm.users = resp.data;
      })
    }
  }

})();
