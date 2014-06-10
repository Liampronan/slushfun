angular.module('SlushFunApp')
  .controller('SearchResultsCtrl', ['$scope', 'deliveryDataService', '$state', 'localStorageService',
    function($scope, deliveryDataService, $state, localStorageService){
      $scope.inSearchResults = true;
      $scope.onlyShowOpen = true;
      $scope.storeDetails = {};
      $scope.$on('$stateChangeStart',
        function(evt, toState, toParams, fromState, fromParams) {
          if (toState.name === "index.deliveries.nearMe"){
            $scope.inSearchResults = true;
          } else {
            $scope.inSearchResults = false;
          }
        });

      $scope.$watch('searchResults', function(newV, oldV){
        if (newV) setFilteredCusineType();
      })

      if (!$scope.searchResults) {$state.go('index.deliveries');}

      $scope.$on('$stateChangeStart',
        function(evt, toState, toParams, fromState, fromParams) {
          if (toState.name === "index.deliveries.nearMe.details" &&
              fromState.name === "index.deliveries.nearMe"){
            $scope.storeDetails = $scope.getStoreMenu(toParams.storeId);
            //promise from SearchResultsCtrl
            $scope.storeDetails
              .then(function(result){
                $scope.storeDetails = result.data;
              }, function(error){
                console.log(error);
//           //TODO error handling
              });
          }
        });

      $scope.deliveryCharge = function(merchant) {
        if ($scope.deliveryMax === undefined)
          return true;
        return merchant.ordering.delivery_charge <= $scope.deliveryMax
      };

      $scope.orderMax = function(merchant) {
        if ($scope.minOrderMax === undefined || $scope.minOrderMax.trim() === "")
          return true;
        return merchant.ordering.minimum <= $scope.minOrderMax
      };

      $scope.showClosed = function(){
        if ($scope.isOpen === ''){
          $scope.isOpen = function(merchant) {
          return merchant.ordering.is_open
          }
        } else{
            $scope.isOpen = '';
          }
      }

      $scope.getFilteredStoreIndex = function (id){
        var result = null;
        $scope.searchResults.filter(function(obj, key){
          if (obj.id===id) result = key
        });
        return result;
      }

      function setFilteredCusineType(){
        var results = $scope.searchResults.filter(function(obj){return obj.ordering.is_open});
        var cuisines = ['All'];
        angular.forEach(results, function(obj){
          angular.forEach(obj.summary.cuisines, function(cuisine){
            if (cuisines.indexOf(cuisine) === -1){cuisines.push(cuisine)}
          })
        })
        $scope.filteredCuisineTypes = cuisines;
      }

      $scope.isOpen = function(merchant) {
        return merchant.ordering.is_open
      }

      $scope.cuisineTypeFilter = function(merchant) {
        if ($scope.cuisineType === 'All') return true
        return merchant.summary.cuisines.indexOf($scope.cuisineType) !== -1
      }


      $scope.setStoreSearchResultIndex = function (index) {
        $scope.searchResultIndex = index;
      };

      $scope.getStoreMenu = function(storeId){
        return deliveryDataService.getStoreMenu(storeId)
      }

    }
  ]);