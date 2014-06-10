angular.module('SlushFunApp')
  .controller('CartCtrl', ['$scope', 'deliveryDataService', '$state', 'shoppingCartService', '$location',
    '$stateParams',
    function ($scope, deliveryDataService, $state, shoppingCartService, $location) {
      $scope.groupName = "";
      $scope.formattedGroupName = "";
      $scope.groupNameExistsFirebase = false;
      $scope.groupCartCreated = false;
      $scope.hideModal = false;
      $scope.updateCart().then(function () {
        $scope.cartTotal = getCartTotal($scope.cart.items);
      });


      $scope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams) {
        if (fromState === 'index.cart') {$scope.hideModal = true;}
      });


      $scope.createGroupCartFirebase = function(groupName){
        $scope.formattedGroupName = groupName.toLowerCase().replace(/ /g, '_');
        createGroupCartFirebase($scope.formattedGroupName, $scope.cart, groupName).then(function (created) {
          if (created === true){
            $scope.groupCartCreated = true;
            $scope.groupCartURL = $location.$$absUrl.replace($location.$$path, "/group_cart/")
              + $scope.formattedGroupName;
          } else {
            $scope.groupNameExistsFirebase = true;
          }
        });
      }

      function getCartTotal(cartItems) {
        var sum = 0;
        angular.forEach(cartItems, function(cartItem) {sum += (cartItem.menuItemPrice)});
        return sum;
      }

      function createGroupCartFirebase(formattedGroupName, cart, groupName){
        return shoppingCartService.createGroupCartFirebase(formattedGroupName, cart, groupName);
      }
    }
  ]);