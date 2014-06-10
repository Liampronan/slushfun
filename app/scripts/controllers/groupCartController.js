angular.module('SlushFunApp')
  .controller('GroupCartCtrl', ['$scope', 'deliveryDataService', '$state', 'shoppingCartService', '$rootScope',
    '$stateParams', 'fireFactory', '$location', '$q',
    function ($scope, deliveryDataService, $state, shoppingCartService, $rootScope, $stateParams, fireFactory,
              $location, $q) {
      $rootScope.isGroupOrder = true;
      $rootScope.ordererName = "";
      $scope.groupId = $stateParams.groupId;
      $scope.paymentType = "creditCard";
      $scope.groupCartURL = $location.$$absUrl.replace($location.$$path, "/group_cart/")
        + $stateParams.groupId;
      $scope.tip = getTip() || 0 ;
      $scope.notes = getNotes() ||  "";
      $scope.phoneNumber = getPhoneNumber() || "";
      $scope.showNoteInput = false;
      $scope.checkoutStepOne = true;
      $scope.checkoutStepTwo = false;
      $scope.checkoutStepThree = false;
      console.log($scope.cart);
      //store phone # for redirects/reloads
      $scope.storePhoneNumber = function (phoneNumber) {
        shoppingCartService.storePhoneNumber(phoneNumber);
      }

      function getPhoneNumber() {
        return shoppingCartService.getPhoneNumber();
      }

      $scope.storeTip = function (tip) {
        shoppingCartService.storeTip(tip);
      }

      function getTip() {
        return toFixed(shoppingCartService.getTip());
      }

      $scope.storeNotes = function (notes) {
        shoppingCartService.storeNotes(notes);
      }

      function getNotes() {
        return shoppingCartService.getNotes();
      }

      //fireB promise resolving
      $scope.updateCart($stateParams.groupId).then(function () {
        $scope.fireChild = fireFactory.firebaseRef('groupCarts').$child($stateParams.groupId);
        $scope.getSubTotal();
      })

      $scope.submitCart = function(){
        prepareCart().then(function () {
          deliveryDataService.getCart($scope.cart.storeId).then(function(data){
            $scope.deliveryAPICart = data;
            deliveryDataService.storeDeliveryAPICartLocalStorage(data);
            console.log($scope.deliveryAPICart);
            $state.go('index.review', {tip: $scope.tip, notes:$scope.notes})
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
        deliveryDataService.postLocation().then(function (data) {
          shoppingCartService.storeLocationIdLocalStorage(data.location.location_id);
        })
        angular.forEach($scope.cart.items, function(cartItem, key){
          setTimeout(function(){
            deliveryDataService.postCartItem(cartItem, $scope.cart.storeId).then(function () {
              if (key === ($scope.cart.items.length - 1)) deferred.resolve();
            })}, key*2500)// hack attack/pls forgive me, on a deadline..
                          //issue: can only add 1 item/api call and multiple calls at once leads
                          //to unpredictable cart state, so space out each call
                          // (2.25 seconds seems to be working threshold)
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
            $scope.checkoutStepOne = false;
            $scope.checkoutStepTwo = true;
            if (!deliveryDataService.getAPIAccessTokenFromLocalStorage()){
              deliveryDataService.storeAPIUserCode($location.$$search.code);
              $scope.APIToken = deliveryDataService.getAPIToken($location.$$search.code)
                .then(function (token) {
                  deliveryDataService.storeAPIAccessToken(token);
                });
            }
          }
          else if (toState.name === "index.checkout" && $location.$$search.state === "ccAdded"){
            $scope.checkoutStepOne = false;
            $scope.checkoutStepTwo = false;
            $scope.checkoutStepThree = true;
          }
          else if (toState.name === 'index.review'){
            console.log(toParams);
            $scope.notes = toParams.notes;
            $scope.tip = toParams.tip;
            $scope.locationData = deliveryDataService.getLocationDataFromLocalStorage();
            deliveryDataService.getLocations().then(function (data) {
//              console.log(data);
            })
            deliveryDataService.getCreditCardsAPI().then(function(data){
              $scope.creditCards = data.cards;
              deliveryDataService.storeDeliveryAPICCLocalStorage(data.cards);
              $scope.deliveryAPICart = deliveryDataService.getDeliveryAPICartLocalStorage();
              console.log(data);
            });
          }
          else if (toState.name === 'index.successfulDelivery'){
            $scope.orderId = toParams.orderId;
          }
        });

      function toFixed(num){ return (parseFloat(num).toFixed(2))/ 1};

      $scope.getSubTotal = function () {
        $scope.subTotal = (toFixed($scope.tip) + toFixed($scope.cartTotal)).toFixed(2)
      }
      //wait till cartTotal is defined to calc subTotal
      $scope.$watch('cartTotal',function(newValue, old) {
        if (newValue === old) return;
        $scope.getSubTotal();

      });
      $scope.$watch('deliveryAPICart',function(newValue, old) {
        if (newValue === old) return;
        $scope.sumCartTotalTip();
      });

      $scope.getCartTotal = function(cartItems) {
        var sum = 0;
        angular.forEach(cartItems, function(cartItem) {sum += (cartItem.price)});
        return parseFloat(sum).toFixed(2);
      }

      $scope.getCartTotalNonAPI = function(cartItems) {
        var sum = 0;
        angular.forEach(cartItems, function(cartItem) {sum += (cartItem.menuItemPrice)});
        return parseFloat(sum).toFixed(2);
      }

      $scope.sumCartTotalTip = function(){
//        console.log((toFixed(tip) + toFixed(cartTotal)).toFixed(2))
        $scope.finalTotal = $scope.deliveryAPICart.total + getTip();
      }
      $scope.prepareVote = function(cartItemHashKey){
        $scope.voteItem = cartItemHashKey;
      }

      $scope.vote = function(){
        angular.forEach($scope.cart.items, function(item){
          if (item.$$hashKey === $scope.voteItem){
            var prevNotes = item.ordererNotes || "";
            item.ordererNotes = "; " +  prevNotes + " " + $scope.voterNotes + "-" + $scope.voterName;
            if (!item.votes) {item.votes = []}
            item.votes.push($scope.voterName);
          }
        });
        console.log($scope.voteItem, $scope.voterName, $scope.voterNotes)
        console.log($scope.cart.items);
      }

      $scope.checkOut = function () {
        var cards = deliveryDataService.getDeliveryAPICCLocalStorage();
        var cardId = cards[0].cc_id;

        deliveryDataService.checkOut($scope.cart.storeId, $scope.paymentType, cardId, $scope.notes, $scope.tip)
          .then(function (data) {
            if (data.order_id){
              var fireChild = fireFactory.firebaseRef('processedCarts').$child($scope.cart.groupName);
              fireChild.$set($scope.cart).then(shoppingCartService.emptyCart());
              $state.go('index.successfulDelivery', {orderId: data.order_id})
            }
          })
      }

    }
  ]);