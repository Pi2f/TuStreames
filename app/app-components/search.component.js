(function () {
  'use strict';

  angular.module('app').component('search', {
    templateUrl: 'app/views/search.view.html',
    controller: SearchCtrl,
    controllerAs: 'vm'
  });

  SearchCtrl.$inject = ['$scope', '$stateParams', 'SearchService', 'SessionService', 'SEARCH_EVENTS', 'LogService'];

  function SearchCtrl($scope, $stateParams, SearchService, SessionService, SEARCH_EVENTS, LogService) {
    var vm = this;
    vm.videoSet = [];
    vm.search = search;
    vm.page = page;
    vm.api = $stateParams.api;
    vm.searchValue = $stateParams.value;

    search();

    function search() {
      if ($stateParams.value) {
        vm.isLoading = true;
        SearchService.Search({
          user: SessionService.user,
          keyword: vm.searchValue,
          api: vm.api,
        }).then((response) => {
          vm.videoSet = response.videoSet;
          vm.isLoading = false;
          vm.nextPage = response.nextPageToken;
          vm.prevPage = response.prevPageToken;
          LogService.AddSearchLog(vm.searchValue, vm.api);
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