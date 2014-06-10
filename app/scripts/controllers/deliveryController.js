angular.module('SlushFunApp')
  .controller('DeliveryCtrl', ['$scope', 'deliveryDataService', '$state', 'shoppingCartService',
    function($scope, $deliveryDataService, $state, shoppingCartService){
      //testing so auto-populating these vars TODO: change b4 live
      $scope.searchAddress ="1 west";
      $scope.searchZip = "10004";
      $scope.inDelivery = true;



      // show/hide delivery parent state when entering/leaving parent state
      $scope.$on('$stateChangeStart',
        function(evt, toState, toParams, fromState, fromParams) {
          if (toState.name === "index.deliveries"){
            $scope.inDelivery = true;
          } else if (toState.name === "index.deliveries.nearMe"){
            $scope.inDelivery = false;
          }
        });


      $scope.searchDeliveries = function(){
        var searchAddressZip = formatSearchAddressZip($scope.searchAddress, $scope.searchZip);
        var searchMerchantType = 'R';
        getNearbyDeliveries(searchAddressZip, searchMerchantType)
          .then(function(result){
            $scope.searchResults = result.data.merchants;
            console.log($scope.searchResults);
            shoppingCartService.saveLocationLocalStorage(result.data.search_address);
            console.log("api results", result.data);
            $state.go("index.deliveries.nearMe");
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

//      function formatMerchantType(searchMerchantType){
//        if (searchMerchantType === 'Food') {
//          return 'R';
//        } else if (searchMerchantType === 'Booze') {
//          return 'W';
//        }
//        //food and booze
//        return ['R', 'W'];
//      }
    }
  ])

;