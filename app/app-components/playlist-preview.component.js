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
    vm.playlists = [];
    vm.thumbnailDefault = 'http://placehold.it/120x90';

    function getPlaylists(){
      PlaylistService.GetPlaylistsByUserId().then(function(resp){
        vm.playlists = resp.data;
      });
    }

    $scope.$on(PLAYLIST_EVENTS.syncPlaylist, function (event) {
      getPlaylists();
    })

    $('#removePlaylist').on('show.bs.modal', function(e) {
      vm.playlist = $(e.relatedTarget).data('playlist');
    });

    function deletePlaylist() {
      vm.isLoading = true;
      PlaylistService.DeletePlaylist(vm.playlist).then(getPlaylists);
      $('#removePlaylist').modal('hide');
      toastr["success"]("Playlist removed !!");
      $scope.$emit(PLAYLIST_EVENTS.playlistUpdated,{});
      vm.isLoading = false;
    }
  }

})();



