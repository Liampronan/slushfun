'use strict';

//noinspection JSUnusedGlobalSymbols
angular.module('SlushFunApp')
  .controller('MainCtrl', function ($scope, $rootScope, $state, shoppingCartService, $q) {
//TODO: remove if not needed...
//    $rootScope.guestToken = $rootScope.guestToken
//      || deliveryDataService.getGuestToken().then(function(success){console.log(success.data["Guest-Token"]);
//                                                    return success.data["Guest-Token"]},
//                                                  function(error){console.log(error)})
    //TODO: REFA so not returning a promise or a cart...
    $scope.updateCart = function (groupNameFirebase) {

      var deferred = $q.defer();
      if (groupNameFirebase){
        console.log("hello");
        shoppingCartService.getGroupCartFirebase(groupNameFirebase).then(function(cart){
          $scope.cart = cart.cart;
          $scope.groupName = cart.groupName;
          deferred.resolve();
        });
      }else{
        $scope.cart = shoppingCartService.getCurrentCart();
        return $scope.cart
      }
      return deferred.promise
    };

    //REFA: look into better way of managing nav and child views...

    $scope.inIndex = true;
    $scope.$on('$stateChangeSuccess',
      function(evt, toState, toParams, fromState, fromParams) {
        //see if we need to get the prev store's details (just like above -> for quick browsing)
        if (toState.name !== "index"){
          $scope.inIndex = false;
        }
        if (toState.name === "index"){
          $scope.inIndex = true;
        }
        if (toState.name !== 'index.group_cart'){
          $scope.updateCart();
        }
      });

    $scope.emptyCart = function () {
      shoppingCartService.emptyCart();
      $scope.updateCart();
    }
  })

  .factory('fireFactory', ['$firebase',
    function fireFactory($firebase) {
      return {
        firebaseRef: function(path) {
          var baseUrl = 'https://slushfun.firebaseio.com/';
          path = (path !== '') ?  baseUrl + '/' + path : baseUrl;
          var ref = new Firebase(path);
          return $firebase(ref)
        }
      };
    }])