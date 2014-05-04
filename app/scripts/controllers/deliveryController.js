angular.module('SlushFunApp')
  .controller('DeliveryCtrl', ['$scope', 'deliveryDataService',
    function($scope, $deliveryDataService){
      //testing so auto-populating these vars TODO: change b4 live
      $scope.searchAddress ="1 west";
      $scope.searchZip = "10004";



      $scope.searchDeliveries = function(){
        var searchAddressZip = formatSearchAddressZip($scope.searchAddress, $scope.searchZip);
        var searchMerchantType = formatMerchantType($scope.searchMerchantType);
        getNearbyDeliveries(searchAddressZip, searchMerchantType)
          .then(function(result){
            $scope.searchResults = result.data.merchants;
            console.log($scope.searchResults);
            console.log("api results", result.data)
          }, function(error){
            //TODO add error handling
            console.log(error)
          });
      }

      function getNearbyDeliveries(searchAddressZip, searchMerchantType){
        return $deliveryDataService.getDeliveryPlaces(searchAddressZip, searchMerchantType)
      }

      function formatSearchAddressZip(searchAddress, searchZip){
        return searchAddress.replace(/\s+/g, '') + searchZip.trim();
      }

      function formatMerchantType(searchMerchantType){
        if (searchMerchantType === 'food') {
          return 'R';
        } else if (searchMerchantType === 'booze') {
          return 'W';
        }
        //food and booze
        return ['R', 'W'];
      }
    }
  ])

;