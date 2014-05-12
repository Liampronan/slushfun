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

      $scope.$on('$firebaseSimpleLogin:login', function () {
        //TODO reditrect to user page
        $location.path('/');


      });

      // FirebaseAuth callback
      $scope.authCallback = function (error, user) {
        if (error) {
          console.log('error: ', error.code);
          /*if (error.code === 'EXPIRED_TOKEN') {
           $location.path('/');
           }*/
        } else if (user) {
          console.log('Logged In', $scope);
          // Store the auth token
          localStorage.setItem('token', user.token);
        } else {
          localStorage.clear();
          $rootScope.isLoggedIn = false;
          $location.path('/');
        }
      };

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
