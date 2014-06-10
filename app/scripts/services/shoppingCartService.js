angular.module('SlushFunApp')
  .service('shoppingCartService', ['localStorageService', '$rootScope', 'fireFactory', '$q',
    function (localStorageService, $rootScope, fireFactory, $q) {
      var _this = this;
      this.getCurrentCart = function () {
        var deferred = $q.defer(),
          groupNameFirebase = this.getGroupNameFirebaseFromLocalStorage();
        if (groupNameFirebase){
          console.log("cart fireB", groupNameFirebase);
          this.getGroupCartFirebase(groupNameFirebase).then(function(result){
            deferred.resolve(result);
          });
        } else {
          deferred.resolve({cart: localStorageService.get('cart')});
        }
        return deferred.promise
      }

      this.saveLocationLocalStorage = function (locationData) {
        localStorageService.add('locationData', locationData);
      }

      this.addToCart = function (menuItemId, storeName, menuItemName, menuItemPrice, storeId, scopeCart, ordererName,
                                 ordererNotes, minOrderAmount, deliveryFee, timeToDeliver) {
        var currentCart = localStorageService.get('cart');
        var locationData = localStorageService.get('locationData');
        var updatedCart;
        console.log(ordererName, "hello");
        if (scopeCart){
          if (scopeCart.groupName) {
            scopeCart.items.push({
              menuItemId: menuItemId,
              menuItemName: menuItemName,
              menuItemPrice: menuItemPrice,
              ordererName: ordererName,
              ordererNotes: [{name: ordererName, notes: ordererNotes}],
              votes: []
            });
            return
          }
        }
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
          updatedCart.timeToDeliver = timeToDeliver;
          console.log("inside!!", timeToDeliver, locationData);
          updatedCart.locationData = locationData;
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
        console.log("GET", localStorageService.get('cart'));
      }

      this.emptyCart = function () {
        localStorageService.clearAll();
      }

      this.createGroupCartFirebase = function(formattedGroupName, cart, groupName){
        console.log(formattedGroupName, cart, groupName);
        var deferred = $q.defer(),
            groupRef = fireFactory.firebaseRef('groupCarts'),
            child = groupRef.$child(formattedGroupName),
            available,
            created;

        child.$on('value', function(dataSnapshot) {
          //value is undefined if groupName does not exist on FireB
          available = dataSnapshot.snapshot.value === null || !dataSnapshot.snapshot.value["groupName"];
          if (available){
            cart["groupName"] = groupName;
            child.$set(cart).then(function () {created = true});
            localStorageService.add('firebaseGroupName', formattedGroupName);
          } else {
            created = available = false
          }
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
          var result = {cart: groupCart, isGroupCart: true, formattedGroupName: formattedGroupName,
            groupFirebaseRef: child}
          deferred.resolve(result);
        });
        return deferred.promise
      }

      this.addGroupCartToLocalStorage = function (groupName) {
        localStorageService.add('firebaseGroupName', groupName);
      }

//      this.setGroupNameFirebaseFromLocalStorage =

      this.getGroupNameFirebaseFromLocalStorage = function () {
        return localStorageService.get('firebaseGroupName');
      }

      this.storePhoneNumber = function(phoneNumber){
        localStorageService.add('phoneNumber', phoneNumber);
      };

      this.getPhoneNumber = function(){
        return localStorageService.get('phoneNumber');
      };

      this.storeTip = function(tip){
        localStorageService.add('tip', tip);
      }

      this.getTip = function(){
        return localStorageService.get('tip');
      }

      this.storeNotes = function(notes){
        localStorageService.add('notes', notes);
      }

      this.getNotes= function(){
        return localStorageService.get('notes');
      }

      this.storeLocationIdLocalStorage = function (locationId) {
        localStorageService.add('locationId', locationId);
      }

      this.getLocationId = function(){
        return localStorageService.get('locationId');
      }

      this.removeGroupCartFromLocalStorage = function () {
        localStorageService.remove('firebaseGroupName');
      }


  }]);
