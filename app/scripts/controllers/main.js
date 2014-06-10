'use strict';

//noinspection JSUnusedGlobalSymbols
angular.module('SlushFunApp')
  .controller('MainCtrl', function ($scope, $rootScope, $state, shoppingCartService, $q, fireFactory,
                                    deliveryDataService, localStorageService) {
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
        if (toState.name === "deliveries.nearMe") $scope.inIndex = false;
        if (toState.name === "index") {
          $scope.inIndex = true;
//          $state.go('index.deliveries');
        }
        if (($scope.cart || groupNameFirebase) && toState.name !== 'index.group_cart' &&
          toState.name !== 'index.group_cart.store'){
          $scope.updateCart();
        }
      });

    $scope.emptyCart = function () {
      var groupNameFirebase = shoppingCartService.getGroupNameFirebaseFromLocalStorage();
      if (groupNameFirebase){
//        var unbind = localStorageService.get('unbind');
        shoppingCartService.emptyCart();
        $rootScope.unbind();
//        $scope.updateCart();
//        var ref = fireFactory.firebaseRef('groupCarts').$child(groupNameFirebase);
//        shoppingCartService.emptyCart();
//        ref.$bind($scope,'cart').then(function(unbind){
//          unbind();
//          $scope.updateCart();
//        });
      } else {shoppingCartService.emptyCart();}
      $scope.updateCart();
      $state.go('index.deliveries');
    }
    //
    $scope.removeGroupCartFromLocalStorage = function(){
//      var groupNameFirebase = shoppingCartService.getGroupNameFirebaseFromLocalStorage();
//      var ref = fireFactory.firebaseRef('groupCarts').$child(groupNameFirebase);
//      ref.$bind($scope,'cart').then(function(unbind){
//        unbind();
//
//      });
//      var unbind = localStorageService.get('unbind');
      $rootScope.unbind();
      shoppingCartService.emptyCart();
      $scope.updateCart();
    }

    function getCartTotal(cartItems) {
      if (!cartItems) return;
      var sum = 0;
      angular.forEach(cartItems, function(cartItem) {sum += (cartItem.menuItemPrice)});
      return parseFloat(sum).toFixed(2);
    }

    function setScopeGroupCart(result) {
      $scope.cart = result.cart;
      console.log(result);
//      deliveryDataService.addLocationDataToLocalStorage($scope.cart.locationData);
      $scope.isGroupCart = result.isGroupCart;
      $scope.formattedGroupName = result.formattedGroupName;
      $scope.cartTotal = getCartTotal($scope.cart.items);
      $scope.groupFirebaseRef = result.groupFirebaseRef;
      $scope.groupFirebaseRef.$bind($scope, "cart").then(function (unbind) {
        $rootScope.unbind = unbind;
      });
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