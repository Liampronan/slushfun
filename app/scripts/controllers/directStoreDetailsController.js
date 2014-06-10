angular.module('SlushFunApp')
  .controller('DirectStoreDetailsCtrl', ['$scope', 'deliveryDataService', '$state', 'shoppingCartService',
    '$stateParams', '$rootScope',
    function ($scope, deliveryDataService, $state, shoppingCartService, $stateParams, $rootScope) {
      $scope.storeId = $stateParams.storeId;
      $scope.itemsPerPage = 5;
      $scope.currentPage = 0;
      getStoreMenu()
        .then(function (success) {
          $scope.storeMenu = success.data
          console.log($scope.storeMenu);
        }, function (error) {
           console.log(error);
        });

      getStoreDetails()
        .then(function (success) {
          $scope.storeDetails = success.data.merchant;
          console.log($scope.storeDetails);
          $scope.lastDeliveryTime = $scope.storeDetails.ordering.availability.last_delivery_time;
          $scope.nextDeliveryTime = $scope.storeDetails.ordering.availability.next_delivery_time;
          $scope.isOpenForDelivery = checkIsOpenForDelivery($scope.lastDeliveryTime);
        }, function (error) {
          console.log('nooo', error);
        })

      function checkIsOpenForDelivery(lastDeliveryTime){
        var now = new Date();
        var last = new Date(lastDeliveryTime)
        return last > now;
      }

      function getStoreMenu(){
        return deliveryDataService.getStoreMenu($stateParams.storeId)
      }

      function getStoreDetails(){
        //noinspection JSUnresolvedFunction
        return deliveryDataService.getStoreDetails($stateParams.storeId)
      }

      $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
          $scope.currentPage--;
        }
      };

      $scope.pageCount = function () {
        return Math.ceil($scope.menuItems.length / $scope.itemsPerPage) - 1;
      };

      $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pageCount()) {
          $scope.currentPage++;
        }
      };

      $scope.setPage = function (n) {
        $scope.currentPage = n;
      };


      $scope.addToCart = function () {
        shoppingCartService.addToCart($scope.menuItemId, $scope.storeName, $scope.itemName, $scope.itemPrice,
          $scope.storeId, $scope.cart, $scope.ordererName, $scope.ordererNotes);
        $scope.updateCart();
      }


      //function to format menuItems - need to go to bottom child of each node
      //to get items (some are 2 deep, others are 3 deep, etc)
      $scope.getMenuItems = function (parentMenu, menuItems) {
        console.log(parentMenu);
        if (menuItems === undefined) {
          menuItems = [];
        }
        for (child in parentMenu.children){
          if (parentMenu.children[child].type === 'menu'){
            $scope.getMenuItems(parentMenu.children[child], menuItems);
          } else {
            menuItems.push({
              name: parentMenu.children[child].name,
              price:parentMenu.children[child].price,
              type: parentMenu.children.name,
              id: parentMenu.children[child].id
            });
          }
        }
        $scope.menuItems = menuItems;
      }

      $scope.setSelectedCategory = function (selectedCategory) {
        $scope.selectedCategory = selectedCategory;
      }

      $scope.setSelectedSubcategory = function (selectedSubcategory) {
        $scope.selectedSubcategory = selectedSubcategory;
      }

      $scope.unsetSelectedCategory = function () {
        $scope.selectedCategory = undefined;
        $scope.currentPage = 0;
      }

      $scope.prepareToAdd = function (menuItemId, storeName, itemName, itemPrice, storeId, minOrderAmount) {
        $scope.menuItemId = menuItemId;
        $scope.storeName = storeName;
        $scope.itemName = itemName;
        $scope.itemPrice = itemPrice;
        $scope.storeId = storeId;
        $scope.minOrderAmount = minOrderAmount;
      }

      //api returns myriad different categories; hence this ugly switch statement..
      $scope.formatMenuCategory = function (menuCategory) {
        switch(menuCategory){
          case "wines": return "wine";
          case "wine": return "wine";
          case "wine products": return "wine";
          case "ciders &amp; malternatives": return "cider";
          case "import beer": return "beer";
          case "ice": return "ice";
          case "paper &amp; plastic products": return "paper";
          case "domestic beer": return "beer";
          case "liquor": return "liquor";
          case "liquors": return "liquor";
          case "cider": return "cider";
          case "sake": return "sake";
          case "rum": return "rum";
          case "gin": return "gin";
          case "vodka": return "vodka";
          case "brandy, cognac, armagnac & calvados": return "cognac";
          case "cognac": return "cognac";
          case "cordials, liqueurs & others": return "others";
          case "cordials &amp; liqueurs": return "others";
          case "spirits": return "liquor";
          case "red wine": return "red_wine";
          case "white wine": return "white_wine";
          case "boxed wine": return "boxed_wine";
          case "boxed%20wine": return "boxed_wine";
          case "sparkling wine": return "sparkling_wine";
          case "sparkling wine/champagne": return "champagne";
          case "champagne": return "champagne";
          case "tequila & mezcal": return "tequila";
          case "tequila": return "tequila";
          case "whiskey, scotch, bourbon & rye": return "whiskey_scotch_bourbon_rye";
          case "scotch": return "whiskey_scotch_bourbon_rye";
          case "canadian whiskey": return "whiskey_scotch_bourbon_rye";
          case "porto &amp; sherry": return "port_and_sherry";
          case "sherry": return "port_and_sherry";
          case "accessories & glassware": return "accessories";
          case "accessories": return "accessories";
          case "rose wine": return "rose";
          default: return "default";
        }
      }

    }])

