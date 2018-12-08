(function(){
    'use strict';

    angular.module('app').component('stream',  {
        config: StreamConfig,
        templateUrl: 'app/views/stream.view.html',
        controller: StreamCtrl,
        controllerAs: 'vm'
    }).filter('trusted', StreamFilter);

    StreamCtrl.$inject = ['$stateParams','PlaylistService'];
    function StreamCtrl($stateParams, PlaylistService){
        var vm = this;
        vm.video = $stateParams.video;
        vm.video.url = "https://www.youtube.com/embed/" + vm.video.id;
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
          PlaylistService.UpdatePlaylist(playlist).then(function(){
            $('#addToPlaylist').modal('hide');
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
