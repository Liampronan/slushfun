angular.module('SlushFunApp')
  .controller('SearchResultsCtrl', ['$scope', 'deliveryDataService', '$state', 'localStorageService',
    function($scope, deliveryDataService, $state, localStorageService){
      $scope.inSearchResults = true;
      $scope.storeDetails = {};
      $scope.$on('$stateChangeStart',
        function(evt, toState, toParams, fromState, fromParams) {
          if (toState.name === "index.deliveries.nearMe"){
            $scope.inSearchResults = true;
          } else {
            $scope.inSearchResults = false;
          }
        });

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

      $scope.isOpen = function(merchant) {
        return merchant.ordering.is_open
      };

      $scope.setStoreSearchResultIndex = function (index) {
        $scope.searchResultIndex = index;
      };

      $scope.getStoreMenu = function(storeId){
        return deliveryDataService.getStoreMenu(storeId)
      }

    }
  ]);