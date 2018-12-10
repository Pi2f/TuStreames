(function(){
  angular
  .module('app', ['ui.router'])
  .config(config)
  .run(run)
  .controller('AppController', AppController)
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized',
    authenticated: 'auth-authenticated',
    authorized: 'authorized'
  }).constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
  });

  config.$inject = ['$stateProvider', 'USER_ROLES'];
  
  function config($stateProvider, USER_ROLES) {
    var state = [{
      name: 'default',
      url: '',
      component: 'home',
      data: {
        authorizedRoles: USER_ROLES.all
      }
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
      data: {
        authorizedRoles: USER_ROLES.all
      }
    },
    {
      name: 'search',
      url: '/search?value&api',
      component: 'search',
      data: {
        authorizedRoles: USER_ROLES.all,
      }
    },
    {
      name: 'stream',
      url: '/stream',
      component: 'stream',
      params: {
        video: null,
      },
      data: {
        authorizedRoles: USER_ROLES.all,
      }
    },
    {
      name: 'playlist',
      url: '/playlist',
      component: 'playlist',
      params: {
        playlist: null,
      },
      data: {
        authorizedRoles: USER_ROLES.all,
      }
    },
    {
      name: 'admin',
      url: '/admin',
      component: 'admin',
      data: {
        authorizedRoles: USER_ROLES.admin
      }
    }
  ];
  
    state.forEach(route => {
      $stateProvider.state(route)
    });
  }

  function run($rootScope, $transitions, AuthenticationService, AUTH_EVENTS){

    const restrictedStates = {
      to: (state) => !!state.data
    };
    
    $transitions.onBefore(restrictedStates, function(transition){ 
        const stateService = transition.router.stateService;
        return AuthenticationService.isAuthenticated().then(function(user){
          if(!user){
            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            return stateService.target("authentication");
          } else {
            $rootScope.$broadcast(AUTH_EVENTS.authenticated, user);
            var authorizedRoles = transition.to().data.authorizedRoles;
            if(!isAuthorized(authorizedRoles,user)){
              $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
              return stateService.target('home');
            } else {
              $rootScope.$broadcast(AUTH_EVENTS.authorized);
            } 
          }
        });
    });

    $transitions.onError({}, function(transition){
      console.error(transition.error());
    });

    function isAuthorized(authorizedRoles, user) {
      if(!!user){
          return (user.role.indexOf(authorizedRoles) !== -1);
      } else {
          return false;
      }
    };
  }
  
  function AppController($scope, $state, USER_ROLES, AuthenticationService, AUTH_EVENTS){
    var vm = this;
    vm.selected = "YouTube";
    vm.unselected = "Vimeo";
    vm.currentUser = null;
    vm.userRoles = USER_ROLES;
    vm.setCurrentUser = setCurrentUser;
    vm.logout = logout;
    vm.search = search;
    vm.toggle = toggle;
    
    $scope.$on(AUTH_EVENTS.loginSuccess, function (event, user) {
      console.log("LoginSuccess");
      setCurrentUser(user);
    })

    $scope.$on(AUTH_EVENTS.notAuthenticated, function (event) {
      console.log("NotAuthenticated");
    })

    $scope.$on(AUTH_EVENTS.notAuthorized, function (event) {
      console.log("NotAuthorized");
    })

    $scope.$on(AUTH_EVENTS.authorized, function (event) {
      console.log("Authorized");
    })

    $scope.$on(AUTH_EVENTS.authenticated, function (event, user) {
      console.log("Authenticated");
      setCurrentUser(user);
    })

    $scope.$on(AUTH_EVENTS.logoutSuccess, function (event) {
      console.log("LogoutSuccess");
    })

    $scope.$on(AUTH_EVENTS.loginFailed, function (event) {
      console.log("LoginFailed");
    })
  
    function setCurrentUser (user) {
      vm.currentUser = user;
      if(user.role.indexOf(USER_ROLES.admin) !== -1){
        vm.currentUser.isAdmin = true;
      }
    };
    
    function search() {
      $state.go(search);
      vm.value = "";
    }

    function logout() {
      vm.currentUser = null;
      $state.go('authentication');
      AuthenticationService.Logout();
    }

    function toggle(){
      const aux = vm.selected;
      vm.selected = vm.unselected;
      vm.unselected = aux;
      console.log(vm.selected);
    }
  }

})();
