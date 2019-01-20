(function(){
  'use strict';
  
  angular.module('app').component('playlist', {
    templateUrl: 'app/views/playlist.view.html',
    controller: PlaylistCtrl,
    controllerAs: 'vm',
  });

  PlaylistCtrl.$inject = ['$stateParams', 'PlaylistService'];

  function PlaylistCtrl($stateParams, PlaylistService) {
    const vm = this;
    vm.playlistId = $stateParams.id;
    vm.removeVideo = removeVideo;
    getPlaylist();

    function removeVideo(videoId){
      vm.isLoading = true;
      const index = vm.playlist.videos.findIndex(function(video){
        return video.id == videoId;
      });
      vm.playlist.videos.splice(index,1);
      PlaylistService.UpdatePlaylist(vm.playlist).then(function(){
        vm.isLoading = false;
      });
    }

    function getPlaylist(){
      PlaylistService.GetPlaylistsById(vm.playlistId).then(function(response){
        vm.playlist = response.data;
      })
    }

  }

})();



