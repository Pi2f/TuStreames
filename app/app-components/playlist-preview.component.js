(function(){
  'use strict';
  
  angular.module('app').component('playlistpreview', {
    templateUrl: 'app/views/playlist-preview.view.html',
    controller: PlaylistPreviewCtrl,
    controllerAs: 'vm',
  });

  PlaylistPreviewCtrl.$inject = ['PlaylistService'];

  function PlaylistPreviewCtrl(PlaylistService) {
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

    $('#removePlaylist').on('show.bs.modal', function(e) {
      vm.playlist = $(e.relatedTarget).data('playlist');
    });

    function deletePlaylist() {
      PlaylistService.DeletePlaylist(vm.playlist).then(getPlaylists);
      $('#removePlaylist').modal('hide');
    }
  }

})();



