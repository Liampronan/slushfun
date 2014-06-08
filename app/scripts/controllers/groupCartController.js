angular.module('SlushFunApp')
  .controller('GroupCartCtrl', ['$scope', 'deliveryDataService', '$state', 'shoppingCartService', '$rootScope',
    '$stateParams', 'fireFactory', '$location',
    function ($scope, deliveryDataService, $state, shoppingCartService, $rootScope, $stateParams, fireFactory,
              $location) {
      $scope.groupId = $stateParams.groupId;
      //fireB promise resolving
      $scope.updateCart($stateParams.groupId).then(function () {
        $scope.fireChild = fireFactory.firebaseRef('groupCarts').$child($stateParams.groupId);
//        $scope.cartTotal = getCartTotal($scope.cart.items);
//        console.log($scope.cartTotal);
      })

      $scope.removeFromCart = function(index){
        $scope.cart.items.splice(index,1);

      }

      $scope.$on('$stateChangeSuccess',
        function(evt, toState, toParams, fromState, fromParams) {
          //store api user code
          if (toState.name === "index.checkout" && $location.$$search.code){
//          only request user code and access token if we don't already have access tokens
            if (!deliveryDataService.getAPIAccessTokenFromLocalStorage()){
              deliveryDataService.storeAPIUserCode($location.$$search.code);
              $scope.APIToken = deliveryDataService.getAPIToken($location.$$search.code)
                .then(function (token) {
                  deliveryDataService.storeAPIAccessToken(token);
                });
            }
          } else if (toState.name === 'index.checkout' && $location.$$search.state === "ccAdded"){
            deliveryDataService.getCreditCards()
          }
        });

      function getCartTotal(cartItems) {
        var sum = 0;
        angular.forEach(cartItems, function(cartItem) {sum += (cartItem.menuItemPrice)});
        return parseFloat(sum).toFixed(2);
      }

    }
  ]);