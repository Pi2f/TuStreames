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

  $urlRouterProvider.otherwise('/subscribe');
  state.forEach(route => {
    $stateProvider.state(route)
  });
})
