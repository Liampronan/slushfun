angular.module('SlushFunApp')
  .controller('GroupCartCtrl', ['$scope', 'deliveryDataService', '$state', 'shoppingCartService', '$rootScope',
    '$stateParams', 'fireFactory', '$location', '$q',
    function ($scope, deliveryDataService, $state, shoppingCartService, $rootScope, $stateParams, fireFactory,
              $location, $q) {
      $scope.groupId = $stateParams.groupId;
      $scope.paymentMethod = "creditCard";
      $scope.groupCartURL = $location.$$absUrl.replace($location.$$path, "/group_cart/")
        + $stateParams.groupId;
      $scope.tip = $scope.tip || 0 ; //fix
      $scope.notes = ""; //fix
      $scope.showNoteInput = false;

      //fireB promise resolving
      $scope.updateCart($stateParams.groupId).then(function () {
        $scope.fireChild = fireFactory.firebaseRef('groupCarts').$child($stateParams.groupId);
        $scope.getSubTotal();
//        console.log($scope.cartTotal);
      })

      $scope.submitCart = function(){
        prepareCart().then(function () {
          deliveryDataService.getCart($scope.cart.storeId).then(function(data){
            $scope.deliveryAPICart = data;
            deliveryDataService.storeDeliveryAPICartLocalStorage(data);
            console.log($scope.deliveryAPICart);
            $state.go('index.review')
          });
        })
      }

      $scope.deleteCart = function () {
        deliveryDataService.deleteCart($scope.cart.storeId).then(function (data) {
          console.log(data);
        })
      }

      function prepareCart() {
        var deferred = $q.defer();
        angular.forEach($scope.cart.items, function(cartItem, key){
          setTimeout(function(){
            deliveryDataService.postCartItem(cartItem, $scope.cart.storeId).then(function () {
              if (key === ($scope.cart.items.length - 1)) deferred.resolve();
            })}, key*2250)// hack attack/pls forgive me, on a deadline..
          console.log(cartItem);

        });
        return deferred.promise
      }

      $scope.removeFromCart = function(index){
        $scope.cart.items.splice(index,1);
        $scope.updateCart();
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
          }
          else if (toState.name === 'index.review'){
            $scope.locationData = deliveryDataService.getLocationDataFromLocalStorage();
            deliveryDataService.getCreditCardsAPI().then(function(data){
              $scope.creditCards = data.cards;
              $scope.deliveryAPICart = deliveryDataService.getDeliveryAPICartLocalStorage();
              console.log(data);
            });
          }
          else if (toState.name === 'index.checkout'){
            $scope.getSubTotal();
          }
        });

      function toFixed(num){ return (parseFloat(num).toFixed(2))/ 1};

      $scope.getSubTotal = function () {
        $scope.subTotal = (toFixed($scope.tip) + toFixed($scope.cartTotal)).toFixed(2)
      }



      $scope.getCartTotal = function(cartItems) {
        var sum = 0;
        angular.forEach(cartItems, function(cartItem) {sum += (cartItem.price)});
        return parseFloat(sum).toFixed(2);
      }

    }
  ]);