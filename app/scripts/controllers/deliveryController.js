angular.module('SlushFunApp')
  .controller('DeliveryCtrl', ['$scope', 'deliveryDataService',
    function($scope, $deliveryDataService){
      //testing so auto-populating these vars TODO: change b4 live
      $scope.searchAddress ="1 west";
      $scope.searchZip = "10004";


      $scope.searchDeliveries = function(){
        var searchAddressZip = formatSearchAddressZip($scope.searchAddress, $scope.searchZip);
        var searchMerchantType = formatMerchantType($scope.searchMerchantType);
        data = getNearbyDeliveries(searchAddressZip, searchMerchantType);
      }

      function getNearbyDeliveries(searchAddressZip, searchMerchantType){
        $deliveryDataService.getDeliveryPlaces(searchAddressZip, searchMerchantType)
          .success(function (results) {
            console.log("succes:");
            console.log(results);
          })
          .error(function (error) {
            console.log("error:" + error);
        })
      }

      function formatSearchAddressZip(searchAddress, searchZip){
        return searchAddress.replace(/\s+/g, '') + searchZip.trim();
      }

      function formatMerchantType(searchMerchantType){
        if (searchMerchantType === 'food') {
          return ['R', 'C', 'I', 'U'];
        } else if (searchMerchantType === 'booze') {
          return 'W';
        }
        //food and booze
        return ['R', 'C', 'I', 'U', 'W'];
      }
    }
  ]);