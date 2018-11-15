angular
.module('app', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
  var state = [{
    name: 'default',
    url: '',
    component: 'subscribe'
  },{
    name: 'subscribe',
    url: '/subscribe',
    component: 'subscribe'
  },
  {
    name: 'signin',
    url: '/signin',
    component: 'signin'
  },
  {
    name: 'playlist',
    url: '/playlist',
    component: 'playlist',
    resolve: {
      user: function(signinService, $state){
        var user;
        signinService.getConnectedUser(function(err, data){
           if(err){
             $state.go('signin');
           }
           user = data;
        });
        return user;
      }
    }
  },
  {
    name: 'home',
    url: '/home',
    component: 'home'
  },
  {
    name: 'admin',
    url: '/admin',
    component: 'admin'
  },
  {
    name: 'userlist',
    url: '/userlist',
    component: 'userlist'
  },
  {
    name: 'search',
    url: '/search',
    component: 'search'
  }
];

  state.forEach(route => {
    $stateProvider.state(route)
  });
})
.controller('AppController', ['$scope', '$state', 'signinService', function($scope, $state, signinService){
  $scope.user = signinService.user;

  $scope.logout = function() {
    signinService.removeToken();
    $state.go('signin');
  }
}]);
