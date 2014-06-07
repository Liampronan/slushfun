angular.module('SlushFunApp')
  .service('shoppingCartService', ['localStorageService', '$rootScope', 'fireFactory', '$q',
    function (localStorageService, $rootScope, fireFactory, $q) {

      this.getCurrentCart = function () {
        return localStorageService.get('cart');
      }
      this.addToCart = function (menuItemId, storeName, menuItemName, menuItemPrice, storeId, minOrderAmount,
                                 deliveryFee) {
        var currentCart = localStorageService.get('cart');
        var updatedCart;
//        this.currentCart = currentCart;
        //TODO add check that currentstore === storeId
        //TODO add multiple of same item to cart
        if (!currentCart){
          updatedCart = {};
          updatedCart.items = [];
          updatedCart.storeId = storeId;
          updatedCart.storeName = storeName;
          updatedCart.minOrderAmount = minOrderAmount;
          updatedCart.deliveryFee = deliveryFee;
          updatedCart.items.push({
            menuItemId: menuItemId,
            menuItemName: menuItemName,
            menuItemPrice: menuItemPrice
          })
        } else{
          updatedCart = currentCart;
          updatedCart.items.push({
            menuItemId: menuItemId,
            menuItemName: menuItemName,
            menuItemPrice: menuItemPrice
          })
        }
        localStorageService.add('cart', JSON.stringify(updatedCart));
        console.log(localStorageService.get('cart'));
      }

      this.emptyCart = function () {
        localStorageService.clearAll();
      }

      this.createGroupCartFirebase = function(formattedGroupName, cart, groupName){
        var deferred = $q.defer(),
            groupRef = fireFactory.firebaseRef('groupCarts'),
            child = groupRef.$child(formattedGroupName),
            available,
            created;

        child.$on('value', function(dataSnapshot) {
          //value is undefined if groupName does not exist on FireB
          available = dataSnapshot.snapshot.value ? false : true
          console.log(dataSnapshot);
          if (available){
            cart["groupName"] = groupName;
            child.$set({cart: cart}).then(function () {created = true});
          } else {created = available = false}
          deferred.resolve(available, created);
        });
        return deferred.promise;
      }

      this.getGroupCartFirebase = function(formattedGroupName){
        var deferred = $q.defer(),
            groupRef = fireFactory.firebaseRef('groupCarts'),
            child = groupRef.$child(formattedGroupName),
            groupCart;
        child.$on('value', function(dataSnapshot) {
          groupCart = dataSnapshot.snapshot.value;
          deferred.resolve(groupCart);
        });
        return deferred.promise
      }


  }]);
