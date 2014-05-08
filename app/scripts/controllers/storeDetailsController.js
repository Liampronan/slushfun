angular.module('SlushFunApp')
  .controller('StoreDetailsCtrl', ['$scope', 'deliveryDataService', '$state', 'localStorageService',
    function($scope, $deliveryDataService, $state, localStorageService){
      var nextStoreDetails = {};
      var prevStoreDetails = {};
      console.log(localStorageService.get('localStorageKey'));
      //TODO add in fix for jumping too quickly thru results (fix: make api call if nextStoreDetails not yet loaded..)

      $scope.$on('$viewContentLoaded',
        function(evt, toState, toParams, fromState, fromParams) {
          nextStoreDetails = $scope.getStoreDetails($scope.searchResults[$scope.$parent.searchResultIndex + 1].id)
            .then(function(result){
              nextStoreDetails = result.data;
              console.log(nextStoreDetails);
            }), function(error){
              console.log(error);
          }

          if ($scope.$parent.searchResultIndex !== ($scope.$parent.prevStoreIndex + 1)
                && $scope.$parent.searchResultIndex > 0){
            prevStoreDetails = $scope.getStoreDetails($scope.searchResults[$scope.$parent.searchResultIndex - 1].id)
              .then(function(result){
                prevStoreDetails = result.data;
              }), function(error){
              console.log(error);
            }
          }
      });


      $scope.nextMerchant = function () {
        //bad practice to use parent scope here? is it necessary?? REFA
        $scope.$parent.prevStoreDetails = $scope.$parent.storeDetails;
        $scope.$parent.prevStoreIndex = $scope.$parent.searchResultIndex;
        $scope.$parent.storeDetails = nextStoreDetails;
        $scope.$parent.searchResultIndex++;
        console.log($scope.$parent.searchResultIndex);
        $state.go('deliveries.nearMe.details', {'storeId': $scope.searchResults[$scope.$parent.searchResultIndex].id} )
      }

      $scope.prevMerchant = function () {
        if ($scope.$parent.searchResultIndex === ($scope.$parent.prevStoreIndex + 1)){
          $scope.$parent.storeDetails = $scope.$parent.prevStoreDetails;
          $scope.$parent.searchResultIndex--;
          console.log($scope.$parent.searchResultIndex);
          $state.go('deliveries.nearMe.details', {'storeId': $scope.searchResults[$scope.$parent.searchResultIndex].id} )
        } else {
          $scope.$parent.storeDetails = prevStoreDetails;
          $scope.$parent.searchResultIndex--;
          $state.go('deliveries.nearMe.details', {'storeId': $scope.searchResults[$scope.$parent.searchResultIndex].id} )
        }
      }

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
              type: parentMenu.children.name
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
