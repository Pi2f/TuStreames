(function(){
  'use strict';
  
  angular.module('app').component('playlistpreview', {
    templateUrl: 'app/views/playlist-preview.view.html',
    controller: PlaylistPreviewCtrl,
    controllerAs: 'vm',
  });

  PlaylistPreviewCtrl.$inject = ['$scope','PlaylistService', 'PLAYLIST_EVENTS'];

  function PlaylistPreviewCtrl($scope, PlaylistService, PLAYLIST_EVENTS) {
    var vm = this;
    vm.getPlaylists = getPlaylists;
    vm.deletePlaylist = deletePlaylist;
    vm.addPlaylist = addPlaylist;
    vm.playlists = [];
    vm.thumbnailDefault = 'http://placehold.it/120x90';

    function getPlaylists(){
      vm.isLoading = true;
      PlaylistService.GetPlaylistsByUserId().then(function(resp){
        vm.playlists = resp.data;
        vm.isLoading = false;
      });
    }

    $scope.$on(PLAYLIST_EVENTS.syncPlaylist, function (event) {
      getPlaylists();
    })

    $('#removePlaylist').on('show.bs.modal', function(e) {
      vm.playlist = $(e.relatedTarget).data('playlist');
    });

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

    function deletePlaylist() {
      vm.isLoading = true;
      PlaylistService.DeletePlaylist(vm.playlist).then(function () {
        $('#removePlaylist').modal('hide');
        toastr["success"]("Playlist removed !!");
        $scope.$emit(PLAYLIST_EVENTS.playlistUpdated,{});
        vm.isLoading = false;
      });
    }
  }

})();



