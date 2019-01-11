(function(){
    'use strict';

    angular.module('app').component('stream',  {
        config: StreamConfig,
        templateUrl: 'app/views/stream.view.html',
        controller: StreamCtrl,
        controllerAs: 'vm'
    }).filter('trusted', StreamFilter);

    StreamCtrl.$inject = ['$stateParams','PlaylistService', 'PLAYLIST_EVENTS'];
    function StreamCtrl($stateParams, PlaylistService, PLAYLIST_EVENTS){
        var vm = this;
        vm.video = $stateParams.video;
        vm.video.url = vm.video.embedUrl + vm.video.id;
        vm.addToPlaylist = addToPlaylist;

        $('#addToPlaylist').on('shown.bs.modal', function () {
          getPlaylists();
        })

        function getPlaylists(){  
          PlaylistService.GetPlaylistsByUserId().then(function(resp){
            vm.playlists = resp.data;
          });
        }

        function addToPlaylist(playlist) {
          playlist.videos.push(vm.video);
          vm.isLoading = true;
          PlaylistService.UpdatePlaylist(playlist).then(function(){
            $('#addToPlaylist').modal('hide');
            toastr["success"]("Video added to playlist " + playlist.name);
            $scope.$emit(PLAYLIST_EVENTS.playlistUpdated,{});
            vm.isLoading = false;
          });
        }
    }

    StreamConfig.$inject == ['$sceDelegateProvider'];
    function StreamConfig($sceDelegateProvider){
      $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://www.youtube.com/**',
        'localhost:3000',
        'https://www.youtube-nocookie.com/**'
      ]);
    }

    StreamFilter.$inject = ['$sce'];
    function StreamFilter($sce) {
      return function(url) {
        return $sce.trustAsResourceUrl(url);
      };
    }
})();
