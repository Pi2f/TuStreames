(function(){
  'use strict';
  angular.module('app').component('home', {
    templateUrl: 'app/views/home.view.html',
    controller: HomeCtrl,
    controllerAs: 'vm',
  });
  
  function HomeCtrl() {
    var vm = this;
  }

})();


