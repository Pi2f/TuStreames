(function(){
    'use strict';

    angular.module('app').component('search',  {
        templateUrl: 'app/views/search.view.html',
        controller: SearchCtrl,
        controllerAs: 'vm'
    });

    SearchCtrl.$inject = ['$stateParams','SearchService', 'SessionService'];
    function SearchCtrl($stateParams, SearchService,SessionService){
        var vm = this;
        vm.videoSet = [];
        search();
        
        function search() {
          if ($stateParams.value) {
            SearchService.Search({
              user: SessionService.user,
              keyword: $stateParams.value,
              api: $stateParams.api,
            }).then((videoSet) => vm.videoSet = videoSet);
          } else {
            alert("Aucun mot clef renseigné")
          }
        };
    }
    
})();
