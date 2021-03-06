(function(){
    'use strict';

    angular.module('app').component('stream',  {
        config: StreamConfig,
        templateUrl: 'app/views/stream.view.html',
        controller: StreamCtrl,
        controllerAs: 'vm'
    }).filter('trusted', StreamFilter);

    StreamCtrl.$inject = ['$scope','$stateParams','PlaylistService', 'PLAYLIST_EVENTS'];
    function StreamCtrl($scope, $stateParams, PlaylistService, PLAYLIST_EVENTS){
        var vm = this;

        if($stateParams.api === "YouTube"){
          PlaylistService.VideoYoutube($stateParams.videoId).then(function(response){            
            vm.video = response.data.videoSet[0];
            vm.video.id = $stateParams.videoId;
            vm.video.api = $stateParams.api;
            vm.video.url = vm.video.embedUrl + $stateParams.videoId;
          });
        }

        if($stateParams.api === "Vimeo"){
          PlaylistService.VideoVimeo($stateParams.videoId).then(function(response){
            if (response.data.err) {
              vm.info = "La vidéo en question est une VOD nécessitant de payer et n'est donc pas visible sur notre site.\nNous nous excusons du désagrément.";
            } else {
              vm.video = response.data.video;
              vm.video.id = $stateParams.videoId;
              vm.video.api = $stateParams.api;
              vm.video.url = vm.video.embedUrl + $stateParams.videoId;
            }
          });
        }

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
