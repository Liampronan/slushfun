// https://api.delivery.com/merchant/search/delivery?client_id=NWUxNmJiNGIyMWMxNDE1YjRhMjY4OWM3OGUwNGZmOGYw&address=199 Water St 10038
angular.module('SlushFunApp')
  .service('deliveryDataService', ['$http', '$stateParams', function ($http, $stateParams) {
    //using cors-anywhere as an api proxy to get around CORS issues with
    //app calls from client.. TODO: setup own, quicker proxy b4 live
    var baseUrl = "http://cors-anywhere.herokuapp.com/api.delivery.com/merchant/";
    //TODO: REFA baseURL so that it doesn't include merchant
    var guestTokenUrl = "http://cors-anywhere.herokuapp.com/api.delivery.com/customer/auth/guest?" +
      "client_id=NWUxNmJiNGIyMWMxNDE1YjRhMjY4OWM3OGUwNGZmOGYw";
    var deilveryBaseUrl = baseUrl + "search/delivery?client_id=NWUxNmJiNGIyMWMxNDE1YjRhMjY4OWM3OGUwNGZmOGYw";
    var port = ":443";

    this.getDeliveryPlaces = function(searchAddress, searchMerchantType){
      var merchantTypeParam = formatMerchantTypeParam(searchMerchantType);
      console.log(deilveryBaseUrl + merchantTypeParam+ '&address=' + searchAddress +  port);
      return $http.get(deilveryBaseUrl + merchantTypeParam+ '&address=' + searchAddress +  port);
    }

    this.getStoreMenu = function (storeId) {
      return $http.get(baseUrl + storeId + "/menu")
    };

    this.getStoreDetails = function (storeId) {
      return $http.get(baseUrl + storeId)
    };

    this.getGuestToken = function () {
      return $http.get(guestTokenUrl);
    }


    function formatMerchantTypeParam(searchMerchantType){
      var merchantTypeParam = "";
      if (searchMerchantType){
        merchantTypeParam = "&merchant_type=" + searchMerchantType;
      };
      return merchantTypeParam;

    }


  }]);
