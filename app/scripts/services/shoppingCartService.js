angular.module('SlushFunApp')
  .service('shoppingCartService', ['localStorageService', '$rootScope',
    function (localStorageService, $rootScope) {
      var currentCart = localStorageService.get('cart');
      var updatedCart;

      this.currentCart = currentCart;

      this.addToCart = function (storeId, menuItemId) {
        //TODO add check that currentstore === storeId
        //TODO add multiple of same item to cart
        if (!currentCart){
          updatedCart = {};
          updatedCart.items = [];
          updatedCart.storeId = storeId;
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
        $rootScope.$apply();
      }

      this.emptyCart = function () {
        localStorageService.clearAll();
        $rootScope.$apply();
      }


  }]);
