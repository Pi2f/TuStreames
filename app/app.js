angular.module('tuStreames', [
  'ngRoute',
  'signin',
  'subscribe',
  'playlist'
])
.config(['$locationProvider', '$routeProvider',
  function config($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.
      otherwise({
        redirectTo: '/subscribe'
      })
  }
]);
