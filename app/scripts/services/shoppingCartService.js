angular.module('SlushFunApp')
  .service('shoppingCartService', ['localStorageService', '$rootScope',
    function (localStorageService, $rootScope) {

      this.getCurrentCart = function () {
        return localStorageService.get('cart');
      }

      this.addToCart = function (storeId, menuItemId, storeName) {
        var currentCart = localStorageService.get('cart');
        var updatedCart;
        this.currentCart = currentCart;
        //TODO add check that currentstore === storeId
        //TODO add multiple of same item to cart
        if (!currentCart){
          updatedCart = {};
          updatedCart.items = [];
          updatedCart.storeId = storeId;
          updatedCart.storeName = storeName;
          updatedCart.items.push({
            menuItemId: menuItemId
          })
        } else{
          updatedCart = currentCart;
          updatedCart.items.push({
            menuItemId: menuItemId
          })
        }
        localStorageService.add('cart', JSON.stringify(updatedCart));
        console.log(localStorageService.get('cart'));
      }

      this.emptyCart = function () {
        localStorageService.clearAll();
      }


  }]);
