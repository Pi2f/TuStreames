(function(){
    'use strict';

    angular.module('app').component('search',  {
        templateUrl: 'app/views/search.view.html',
        controller: SearchCtrl,
        controllerAs: 'vm'
    });

    SearchCtrl.$inject = ['SearchService', '$stateParams'];
    function SearchCtrl(SearchService, $stateParams){
        var vm = this;
        vm.videoSet = [];
        search($stateParams);
        
        function search() {
          if ($stateParams.value) {
            SearchService.Search($stateParams.value, function(resp) {
              if (resp.success == true) {                
                for (var i = 0; i < resp.data.items.length; i++) {
                  var video = {
                    id : resp.data.items[i].id.videoId,
                    description : resp.data.items[i].snippet.description,
                    channel : resp.data.items[i].snippet.channelTitle,
                    title : resp.data.items[i].snippet.title,
                    thumbnail : resp.data.items[i].snippet.thumbnails.default.url
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
