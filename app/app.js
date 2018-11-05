angular
.module('app', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
  var state = [{
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
    component: 'playlist'
  },
  {
    name: 'home',
    url: '/home',
    component: 'home'
  }];

  $urlRouterProvider.otherwise('/subscribe');
  state.forEach(route => {
    $stateProvider.state(route)
  });
})
