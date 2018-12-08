(function(){
  'use strict';
  
  angular.module('app').component('sidebar', {
    templateUrl: 'app/views/sidebar.view.html',
    controller: SidebarCtrl,
    controllerAs: 'vm',
  });

  SidebarCtrl.$inject = ['PlaylistService', 'SessionService'];

  function SidebarCtrl(PlaylistService, SessionService) {
    var vm = this;
    vm.toggle = toggle;
    vm.addPlaylist = addPlaylist;
    vm.getPlaylists = getPlaylists;
    vm.playlists = [];
    vm.currentUser = SessionService.user;
    
    function toggle(){
      $('.sidebar').toggleClass('active');
      $(vm).toggleClass('active');
      getPlaylists();
    };

    function addPlaylist(){  
      PlaylistService.CreatePlaylist({name: vm.name, user: vm.currentUser}).then(function(){
        $('#newPlaylist').modal('hide');
        getPlaylists();
      });
    }

    function getPlaylists(){  
      PlaylistService.GetPlaylistsByUserId(vm.currentUser.id).then(function(resp){
        vm.playlists = resp.data;
      });
    }

  }

})();


