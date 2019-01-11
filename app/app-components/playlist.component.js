(function(){
  'use strict';
  
  angular.module('app').component('playlist', {
    templateUrl: 'app/views/playlist.view.html',
    controller: PlaylistCtrl,
    controllerAs: 'vm',
  });

  PlaylistCtrl.$inject = ['$stateParams', 'PlaylistService'];

  function PlaylistCtrl($stateParams, PlaylistService) {
    var vm = this;
    vm.playlist = $stateParams.playlist;
    vm.removeVideo = removeVideo;

    function removeVideo(videoId){
      vm.isLoading = true;
      var index = vm.playlist.videos.findIndex(function(video){
        return video.id == videoId;
      });
      vm.playlist.videos.splice(index,1);
      PlaylistService.UpdatePlaylist(vm.playlist).then(function(){
        vm.isLoading = false;
      });
    }

  }

})();



