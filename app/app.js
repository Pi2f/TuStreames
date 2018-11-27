(function(){
  angular
  .module('app', ['ui.router'])
  .config(config)
  .run(run)
  .controller('AppController', AppController);

  config.$inject = ['$stateProvider'];
  
  function config($stateProvider) {
    var state = [{
      name: 'default',
      url: '',
      component: 'authentication',
    },{
      name: 'register',
      url: '/register',
      component: 'register',
    },
    {
      name: 'authentication',
      url: '/authentication',
      component: 'authentication',
    },
    {
      name: 'home',
      url: '/home',
      component: 'home',
    },
    {
      name: 'search',
      url: '/search?value',
      component: 'search',
    },
    {
      name: 'stream',
      url: '/stream',
      component: 'stream',
      params: {
        video: null,
      }
    }
  ];
  
    state.forEach(route => {
      $stateProvider.state(route)
    });
  }

  function run($rootScope, $state, $location, UserService, AuthenticationService){
    
    var token = AuthenticationService.GetToken();
    if(token != null){
      $rootScope.loggedIn = true;
      UserService.GetUser(token)
      .then(function(res){
        $rootScope.user = res.data.user;      
      });
    } else {
      $rootScope.loggedIn = false;
    }
    
    var restrictedPage = $.inArray($location.path(), ['/authentication', '/register']) === -1;
    
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
      if(!$rootScope.loggedIn){        
        $state.go('authentication');
      }
    });

    $rootScope.$on('$locationChangeStart', function(error){
      if(!$rootScope.loggedIn && restrictedPage){        
        $location.path('authentication');
      }
    });

  }
  
  function AppController($rootScope, $state, AuthenticationService){

    $rootScope.logout = logout;
    $rootScope.search = search;
    
    function search() {
      $state.go(search);
    }

    function logout() {
      $rootScope.user = null;
      $rootScope.loggedIn = false;
      AuthenticationService.RemoveToken();
      $state.go('authentication');
    }
  }

})();
