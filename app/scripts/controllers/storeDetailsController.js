angular.module('SlushFunApp')
  .filter('offset', function () {
    return function (input, start) {
      start = parseInt(start, 10);
      return input.slice(start);
    };
  })
  .controller('StoreDetailsCtrl', ['$scope', 'deliveryDataService', '$state', 'shoppingCartService',
    function($scope, deliveryDataService, $state, shoppingCartService){
      var nextStoreDetails = {};
      var prevStoreDetails = {};
      $scope.itemsPerPage = 5;
      $scope.currentPage = 0;
      console.log("store", $scope.$parent.storeDetails);
//      console.log(localStorageService.get('localStorageKey'));
      //TODO add in fix for jumping too quickly thru results (fix: make api call if nextStoreDetails not yet loaded..)

      $scope.$on('$viewContentLoaded',
        function(evt, toState, toParams, fromState, fromParams) {
          //load next store details once page is loaded b/c api is a bit slow, so
          //want to have next store details available for quick browsing
          nextStoreDetails = $scope.getStoreMenu($scope.searchResults[$scope.$parent.searchResultIndex + 1].id)
            .then(function(result){
              nextStoreDetails = result.data;
            }), function(error){
              console.log(error);
          }
          //see if we need to get the prev store's details (just like above -> for quick browsing)
          if ($scope.$parent.searchResultIndex !== ($scope.$parent.prevStoreIndex + 1)
                && $scope.$parent.searchResultIndex > 0){
            prevStoreDetails = $scope.getStoreMenu($scope.searchResults[$scope.$parent.searchResultIndex - 1].id)
              .then(function(result){
                prevStoreDetails = result.data;
              }), function(error){
              console.log(error);
            }
          }
      });
      //pagination ish..
      $scope.range = function () {
        var rangeSize = 5;
        var ret = [];
        var start;

        start = $scope.currentPage;
        if (start > $scope.pageCount() - rangeSize) {
          start = $scope.pageCount() - rangeSize + 1;
        }

        for (var i = start; i < start + rangeSize; i++) {
          ret.push(i);
        }
        return ret;
      };

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

      
      $scope.addToCart = function (menuItemId, storeId, storeName, minOrderAmount) {
        shoppingCartService.addToCart(menuItemId, storeId, storeName, minOrderAmount);
        $scope.updateCart();
      }

      $scope.nextMerchant = function () {
        //bad practice to use parent scope here? is it necessary?? REFA
        $scope.$parent.prevStoreDetails = $scope.$parent.storeDetails;
        $scope.$parent.prevStoreIndex = $scope.$parent.searchResultIndex;
        $scope.$parent.storeDetails = nextStoreDetails;
        $scope.$parent.searchResultIndex++;
        console.log($scope.$parent.searchResultIndex);
        $state.go('index.deliveries.nearMe.details', {'storeId': $scope.searchResults[$scope.$parent.searchResultIndex].id} )
      };

      $scope.prevMerchant = function () {
        if ($scope.$parent.searchResultIndex === ($scope.$parent.prevStoreIndex + 1)){
          $scope.$parent.storeDetails = $scope.$parent.prevStoreDetails;
          $scope.$parent.searchResultIndex--;
          console.log($scope.$parent.searchResultIndex);
          $state.go('deliveries.nearMe.details', {'storeId': $scope.searchResults[$scope.$parent.searchResultIndex].id} )
        } else {
          $scope.$parent.storeDetails = prevStoreDetails;
          $scope.$parent.searchResultIndex--;
          $state.go('index.deliveries.nearMe.details', {'storeId': $scope.searchResults[$scope.$parent.searchResultIndex].id} )
        }
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

    }]);
