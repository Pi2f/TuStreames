(function(){
  'use strict';
  
  angular.module('app').component('sidebar', {
    templateUrl: 'app/views/sidebar.view.html',
    controller: SidebarCtrl,
    controllerAs: 'vm',
  });

  SidebarCtrl.$inject = ['$scope','PlaylistService', 'SessionService', 'PLAYLIST_EVENTS'];

  function SidebarCtrl($scope, PlaylistService, SessionService, PLAYLIST_EVENTS) {
    var vm = this;
    vm.toggle = toggle;
    vm.addPlaylist = addPlaylist;
    vm.getPlaylists = getPlaylists;
    vm.currentUser = SessionService.user;
    
    $scope.$on(PLAYLIST_EVENTS.syncPlaylist, function (event) {
      getPlaylists();
    })

    function toggle(){
      $('.sidebar').toggleClass('active');
      $(vm).toggleClass('active');
    };

    function addPlaylist(){
      vm.isLoading = true;  
      PlaylistService.CreatePlaylist({name: vm.name, user: vm.currentUser}).then(function(){
        vm.name = "";
        $('#newPlaylist').modal('hide');
        toastr["success"]("Playlist added !!");
        $scope.$emit(PLAYLIST_EVENTS.playlistUpdated,{});
        vm.isLoading = false;
      });
    }

    function getPlaylists(){
      vm.isLoading = true;
      PlaylistService.GetPlaylistsByUserId(vm.currentUser.id).then(function(resp){
        vm.playlists = resp.data;
        vm.isLoading = false;
      });
    }

  }

})();


