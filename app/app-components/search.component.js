(function () {
  'use strict';

  angular.module('app').component('search', {
    templateUrl: 'app/views/search.view.html',
    controller: SearchCtrl,
    controllerAs: 'vm'
  });

  SearchCtrl.$inject = ['$scope', '$stateParams', 'SearchService', 'SessionService', 'SEARCH_EVENTS', 'PagerService'];

  function SearchCtrl($scope, $stateParams, SearchService, SessionService, SEARCH_EVENTS, PagerService) {
    var vm = this;
    vm.videoSet = [];
    vm.pager = {};
    vm.search = search;
    vm.page = page;

    search();

    function search() {
      if ($stateParams.value) {
        vm.isLoading = true;
        SearchService.Search({
          user: SessionService.user,
          keyword: $stateParams.value,
          api: $stateParams.api,
        }).then((response) => {
          vm.videoSet = response.videoSet;
          vm.isLoading = false;
          vm.nextPage = response.nextPageToken;
          vm.prevPage = response.prevPageToken;
          $scope.$emit(SEARCH_EVENTS.searchSuccess, {})
        });
      } else {
        toastr["error"]("No keyword");
      }
    };

    function page(pageToken) {
      vm.isLoading = true;
        SearchService.Page({
          user: SessionService.user,
          pageToken: pageToken,
          api: $stateParams.api,
        }).then((response) => {
          vm.videoSet = response.videoSet;
          vm.isLoading = false;
          vm.nextPage = response.nextPageToken;
          vm.prevPage = response.prevPageToken;
          $scope.$emit(SEARCH_EVENTS.searchSuccess, {})
        });
    }
  }

})();