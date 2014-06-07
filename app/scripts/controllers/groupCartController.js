angular.module('SlushFunApp')
  .controller('GroupCartCtrl', ['$scope', 'deliveryDataService', '$state', 'shoppingCartService', '$rootScope',
    '$stateParams', 'fireFactory',
    function ($scope, deliveryDataService, $state, shoppingCartService, $rootScope, $stateParams, fireFactory) {
      //fireB promise resolving
      $scope.updateCart($stateParams.groupId).then(function () {
//        $scope.cartTotal = getCartTotal($scope.cart.items);
        $scope.fireChild = fireFactory.firebaseRef('groupCarts').$child($stateParams.groupId);
        $scope.fireChild.$bind($scope, "cart")
        console.log($scope.cartTotal);
      })

      $scope.removeFromCart = function(index){
        $scope.cart.items.splice(index,1);
      }

      function getCartTotal(cartItems) {
        var sum = 0;
        angular.forEach(cartItems, function(cartItem) {sum += (cartItem.menuItemPrice)});
        return sum;
      }

    }
  ]);