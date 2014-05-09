'use strict';

//noinspection JSUnusedGlobalSymbols
angular.module('SlushFunApp')
  .controller('MainCtrl', function ($scope, $rootScope, $state, shoppingCartService) {

    $scope.updateCart = function () {
      $scope.cart = shoppingCartService.currentCart;
      $scope.$apply();
    };

    //REFA: look into better way of managing nav and child views...
    $scope.inIndex = true;
    $scope.$on('$stateChangeSuccess',
      function(evt, toState, toParams, fromState, fromParams) {
        console.log(toState);
        //see if we need to get the prev store's details (just like above -> for quick browsing)
        if (toState.name === "index.deliveries"){
          $scope.inIndex = false;
        } if (toState.name === "index"){
          $scope.inIndex = true;
        }
      });
    console.log($scope.cart);

    $scope.$watch('cart', $scope.updateCart(), true);



    $scope.emptyCart = function () {
      shoppingCartService.emptyCart();
//      $scope.cart = shoppingCartService.currentCart;
      $scope.updateCart();
    }
  })

  .factory('fireFactory', [
    function fireFactory() {
      return {
        firebaseRef: function(path) {
          var baseUrl = 'https://slushfun.firebaseio.com/';
          path = (path !== '') ?  baseUrl + '/' + path : baseUrl;
          return new Firebase(path);
        }
      };
    }])


.controller('AuthCtrl', [
  '$scope',
  '$location',
  '$firebase',
  '$firebaseSimpleLogin',
  'loginService',

  function AuthCtrl($scope, $location, $firebase, $firebaseSimpleLogin, loginService) {
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
        $scope.isLoggedIn = true;
        console.log(user);
        $scope.userId = user.id;

        // Set the userRef and add user child refs once
        $scope.userRef = fireFactory.firebaseRef('users').child(user.id);
        $scope.userRef.once('value', function (data) {
          // Set the userRef children if this is first login
          var val = data.val();
          var info = {
            userId: user.id,
            name: user.email
          };
          // Use snapshot value if not first login
          if (val) {
            info = val;
          }
          $scope.userRef.set(info); // set user child data once
        });

        $location.path('/user/' + $scope.userRef.name());
      } else {
        localStorage.clear();
        $scope.isLoggedIn = false;
        $location.path('/');
      }
    };

    $scope.logout = function(){
      loginService.logout();
    };

    $scope.register = function(){
      var user = {
        email: $scope.cred.email,
        password: $scope.cred.password
      };

    loginService.register(user);

      /*, function(err, user) {
      if( err ) {
        $scope.err = err;
      }
      else {
        $scope.login(function(err) {
          if( !err ) {
            loginService.createProfile(user.id, $scope.name, user.email);
          }
        });
      }
    });*/
//      Auth.FBref.$getCurrentUser().then(function(currUser){console.log(currUser)});
    };
    /*function (){
      if (!$scope.token) {
        var user = {};
        user.email = $scope.cred.email;
        user.password = $scope.cred.password;

        $scope.userObj.$createUser(user.email, user.password)
          .then(function () {
              $scope.userObj.$login('password', {user}).then(function (loggedInUser) {
                console.log('Logged in as: ', loggedInUser.uid);
              }, function (error) {
                console.error('Login failed: ', error);
              })
          });
      } else {
        console.log('login with token', $scope.token);
//        fireFactory.firebaseRef('users').auth($scope.token, $scope.authCallback);
      }};*/

    $scope.login = function () {
      $scope.token = localStorage.getItem('token');
      var options = {
        email: $scope.cred.email,
        password: $scope.cred.password
      };
      var provider = 'password';

      if ($scope.token) {
        console.log('login with token', $scope.token);
        fireFactory.firebaseRef('users').auth($scope.token, $scope.authCallback);
      } else {
        console.log('login with authClient');
        $scope.userObj.$login(provider, options).then(function(user) {
          console.log('Logged in as: ', user.uid);
        }, function(error) {
          console.error('Login failed: ', error);
      });
    }};

//    $scope.logout = function () {
//      localStorage.clear();
//      authClient.logout();
//      $location.path('/');
//    };
  }]);