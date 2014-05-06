angular.module('SlushFunApp')
  .controller('SearchResultsCtrl', ['$scope', 'deliveryDataService', '$state',
    function($scope, $deliveryDataService, $state){
      $scope.inSearchResults = true;

      $scope.$on('$stateChangeStart',
        function(evt, toState, toParams, fromState, fromParams) {
          if (toState.name === "deliveries.nearMe"){
            $scope.inSearchResults = true;
          } else {
            $scope.inSearchResults = false;
          }
        });

      $scope.$on('$stateChangeStart',
        function(evt, toState, toParams, fromState, fromParams) {
          console.log(toState);
          if (toState.name === "deliveries.nearMe.details"){
            console.log($state)
            $scope.storeDetails = getStoreDetails($state.params.storeId);
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

      function getStoreDetails(storeId){
        return $deliveryDataService.getStoreDetails(storeId).
          then(function(result){
            return result.data;
          }, function(error){
            console.log(error);
            //TODO error handling
          })
      }

    }
  ]);