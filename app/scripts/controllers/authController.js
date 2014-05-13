angular.module('SlushFunApp')
  .controller('AuthCtrl', [
    '$scope',
    '$location',
    '$firebase',
    '$firebaseSimpleLogin',
    'loginService',
    'fireFactory',
    '$rootScope',
    function AuthCtrl($scope, $location, $firebase, $firebaseSimpleLogin, loginService, fireFactory, $rootScope)
    {
//      //this should handle reloads.. TODO make sure it does (use firebase auth obj)
//      $rootScope.$on('$firebaseSimpleLogin:login', function () {
//        //TODO reditrect to user page
//        if (!$rootScope.user){
//          $rootScope.user = JSON.parse(localStorage.getItem('user'));
//          console.log('getting user from local', $rootScope.user);
//          if ($rootScope.user){
//            $location.path('/');
//          }
//        };
//      });

      $rootScope.$on('$stateChangeSuccess',
        function(evt, toState, toParams, fromState, fromParams) {
          if (!$rootScope.user){
            $rootScope.user = JSON.parse(localStorage.getItem('user'));
            console.log('getting user from local', $rootScope.user);
          }

        });


      //redirect to home after logout
      $rootScope.$on('$firebaseSimpleLogin:logout', function () {
        $location.path('/');
      });

      $rootScope.logOut = function () {
        loginService.logOut();
      };

      $scope.register = function () {
        var user = {
          email: $scope.cred.email,
          password: $scope.cred.password
        };
        loginService.register(user);
      };

      $scope.login = function () {
        $scope.token = localStorage.getItem('token');

        var options = {
          email: $scope.cred.email,
          password: $scope.cred.password
        };
        var provider = 'password';

        if ($scope.token) {
          console.log('login with token', $scope.token);
          loginService.loginWithToken($scope.token);
        } else {
          console.log('login with authClient');
          loginService.login(provider, options);
        }
      }
    }
  ]);
