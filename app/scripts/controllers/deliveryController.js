angular.module('SlushFunApp')
  .controller('DeliveryCtrl', ['$scope', 'deliveryDataService',
    function($scope, $deliveryDataService){
      //testing so auto-populating these vars TODO: change b4 live
      $scope.searchAddress ="108 richmond";
      $scope.searchZip = "02109";

      $scope.searchDeliveries = function(){
        var searchAddressZip = $scope.searchAddress.replace(/\s+/g, '') + $scope.searchZip.trim();
        console.log(searchAddressZip);
        data = getNearbyDeliveries(searchAddressZip, "W");
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
    }
  ]);