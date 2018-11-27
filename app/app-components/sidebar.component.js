(function(){
  'use strict';
  
  angular.module('app').component('sidebar', {
    templateUrl: 'app/views/sidebar.view.html',
    controller: SidebarCtrl,
    controllerAs: 'vm'
  });

  var chevron = true;
  SidebarCtrl.$inject = ['$rootScope', 'PlaylistService'];

  function SidebarCtrl($rootScope, PlaylistService) {
    var vm = this;
    vm.toggle = toggle;
    vm.addPlaylist = addPlaylist;
    vm.getPlaylists = getPlaylists;
    vm.playlists = [];
    
    function toggle(){
      $('.sidebar').toggleClass('active');
      $(vm).toggleClass('active');
    };

    function addPlaylist(){ 
      $('#modal').modal('hide'); 
      PlaylistService.CreatePlaylist({name: vm.name, user: $rootScope.user}).then(function(){
        getPlaylists();
      });
    }

    function getPlaylists(){  
      PlaylistService.GetPlaylistsByUserId($rootScope.user.id).then(function(resp){
        vm.playlists = resp.data;
      });
    }

  }

})();


