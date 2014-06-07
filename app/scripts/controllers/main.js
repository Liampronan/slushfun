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
        shoppingCartService.getGroupCartFirebase(groupNameFirebase).then(function(result){
          setScopeGroupCart(result);
          deferred.resolve();
        });
      }else{
          shoppingCartService.getCurrentCart().then(function (result) {
            if (result.isGroupCart){
              setScopeGroupCart(result);
              return $scope.cart
            }else{
              $scope.cart = result.cart;
              console.log(result.cart);
              $scope.isGroupCart = false;
              $scope.cartTotal = getCartTotal($scope.cart.items);
              return $scope.cart
            }

        });
      }
      return deferred.promise
    };

    //REFA: look into better way of managing nav and child views...
    $scope.inIndex = true;
    $scope.$on('$stateChangeSuccess',
      function(evt, toState, toParams, fromState, fromParams) {
        var groupNameFirebase = shoppingCartService.getGroupNameFirebaseFromLocalStorage();
        //see if we need to get the prev store's details (just like above -> for quick browsing)
        if (toState.name === 'index.groupCart') shoppingCartService.addGroupCartToLocalStorage(toParams.groupId);
        if (toState.name !== "index") $scope.inIndex = false;
        if (toState.name === "index") $scope.inIndex = true;
        if (($scope.cart || groupNameFirebase) && toState.name !== 'index.group_cart' &&
          toState.name !== 'index.group_cart.store'){
          $scope.updateCart();
        }
      });

    $scope.emptyCart = function () {
      shoppingCartService.emptyCart();
      $scope.updateCart();
    }

    $scope.removeGroupCartFromLocalStorage = function(){
      shoppingCartService.removeGroupCartFromLocalStorage();
    }

    function getCartTotal(cartItems) {
      var sum = 0;
      angular.forEach(cartItems, function(cartItem) {sum += (cartItem.menuItemPrice)});
      return parseFloat(sum).toFixed(2);
    }

    function setScopeGroupCart(result) {
      $scope.cart = result.cart;
      $scope.isGroupCart = result.isGroupCart;
      $scope.formattedGroupName = result.formattedGroupName;
      $scope.groupFirebaseRef = result.groupFirebaseRef;
      $scope.groupFirebaseRef.$bind($scope, "cart");
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