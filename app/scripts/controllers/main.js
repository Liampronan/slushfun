'use strict';

//noinspection JSUnusedGlobalSymbols
angular.module('SlushFunApp')
  .controller('MainCtrl', function ($scope, $rootScope, $state, shoppingCartService) {
//    $scope.cart = shoppingCartService.getCurrentCart;


    $scope.updateCart = function () {
      $scope.cart = shoppingCartService.getCurrentCart();
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

//    $scope.$watch('cart', $scope.updateCart(), true);



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