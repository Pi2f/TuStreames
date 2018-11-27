(function(){
    'use strict';

    angular.module('app').component('stream',  {
        config: StreamConfig,
        templateUrl: 'app/views/stream.view.html',
        controller: StreamCtrl,
        controllerAs: 'vm'
    }).filter('trusted', StreamFilter);

    StreamCtrl.$inject = ['$stateParams'];
    function StreamCtrl($stateParams){
        console.log($stateParams)
        var vm = this;
        vm.video = $stateParams.video;
        vm.video.url = "https://www.youtube.com/embed/" + vm.video.id;
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
