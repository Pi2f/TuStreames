(function(){
    'use strict';

    angular.module('app').component('search',  {
        templateUrl: 'app/views/search.view.html',
        controller: SearchCtrl,
        controllerAs: 'vm'
    });

    SearchCtrl.$inject = ['$rootScope','$stateParams','SearchService', 'SessionService'];
    function SearchCtrl($rootScope, $stateParams, SearchService,SessionService){
        var vm = this;
        vm.videoSet = [];
        search($stateParams);
        
        function search() {
          if ($stateParams.value) {
            SearchService.Search({
              userID: SessionService.user,
              keyword: $stateParams.value,
            }, function(resp) {
              if (resp.success == true) {                
                for (var i = 0; i < resp.data.items.length; i++) {            
                  var video = {
                    id : resp.data.items[i].id.videoId,
                    description : resp.data.items[i].snippet.description,
                    channel : resp.data.items[i].snippet.channelTitle,
                    title : resp.data.items[i].snippet.title,
                    thumbnails : {
                      small: resp.data.items[i].snippet.thumbnails.default.url,
                      medium: resp.data.items[i].snippet.thumbnails.medium.url,
                      high: resp.data.items[i].snippet.thumbnails.high.url
                    }
                  }
                  vm.videoSet.push(video);
                }
              } else {
                alert("recherche échouée")
              }
            });
          } else {
            alert("Aucun mot clef renseigné")
          }
        };
    }
    
})();
