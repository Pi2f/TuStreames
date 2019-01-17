(function(){
  angular
  .module('app', ['ui.router'])
  .config(config)
  .run(run)
  .controller('AppController', AppController)
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    authenticated: 'auth-success',
    notAuthorized: 'auth-not-authorized',
    forbidden: 'forbidden'
  })
  .constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
  })
  .constant('PLAYLIST_EVENTS', {
    playlistUpdated: 'playlist-updated',
    syncPlaylist: 'playlist-sync',
  })
  .constant('SEARCH_EVENTS', {
    searchSuccess: 'search-success',
  });

  config.$inject = ['$stateProvider', 'USER_ROLES'];
  
  function config($stateProvider, USER_ROLES) {

    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-bottom-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }

    var state = [{
      name: 'default',
      url: '',
      component: 'home',
      data: {
        authorizedRoles: USER_ROLES.all
      }
    },
    {
      name: 'register',
      url: '/register',
      component: 'register',
    },
    {
      name: 'accountActivation',
      url: '/accountActivation',
      component: 'accountActivation',
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
    },
    {
      name: 'forbidden',
      url: '/forbidden',
      templateUrl: 'app/errors/403/403.html'
    },
    {
      name: 'passwordForgot',
      url: '/passwordForgot',
      component: 'passwordForgot',
    },
    {
      name: 'passwordReset',
      url: '/passwordReset',
      component: 'passwordReset',
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
            return stateService.target("authentication");
          } else {
            $rootScope.$broadcast(AUTH_EVENTS.authenticated, user);          
            var authorizedRoles = transition.to().data.authorizedRoles;
            if(!isAuthorized(authorizedRoles,user)){
              $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
              return stateService.target('home');
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
  
  function AppController($scope, $state, $location, USER_ROLES, AuthenticationService, AUTH_EVENTS, PLAYLIST_EVENTS, SEARCH_EVENTS){
    var vm = this;
    vm.selected = "YouTube";
    vm.unselected = "Vimeo";
    vm.currentUser = null;
    vm.userRoles = USER_ROLES;
    vm.setCurrentUser = setCurrentUser;
    vm.logout = logout;
    vm.toggle = toggle;
    vm.search= search;
    
    $scope.$on(AUTH_EVENTS.loginSuccess, function (event, user) {
      toastr["success"]("Login success !!");
      setCurrentUser(user);
    })

    $scope.$on(AUTH_EVENTS.loginFailed, function (event) {
      toastr["error"]("Login failed !!");
    })

    $scope.$on(AUTH_EVENTS.notAuthorized, function (event) {
      toastr["error"]("You're not authorized !!");
    })

    $scope.$on(AUTH_EVENTS.forbidden, function (event) {
      $location.path('forbidden');
    })

    $scope.$on(AUTH_EVENTS.authenticated, function (event, user) {
      setCurrentUser(user);
    });

    $scope.$on(PLAYLIST_EVENTS.playlistUpdated, function (event) {
      $scope.$broadcast(PLAYLIST_EVENTS.syncPlaylist,{});
    })

    $scope.$on(SEARCH_EVENTS.searchSuccess, function (event) {
      vm.isLoading = false;
    })
  
    function setCurrentUser (user) {
      vm.currentUser = user;
      if(user.role.indexOf(USER_ROLES.admin) !== -1){
        vm.currentUser.isAdmin = true;
      }
    };

    function logout() {
      vm.currentUser = null;
      toastr["success"]("Logout success !!");
      $state.go('authentication');
      AuthenticationService.Logout();
    }

    function toggle(){
      const aux = vm.selected;
      vm.selected = vm.unselected;
      vm.unselected = aux;
    }

    function search(){
      vm.isLoading = true;
      $state.go('search',{value: vm.value, api: vm.selected});
    }
  }

})();
