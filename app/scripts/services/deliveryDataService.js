// https://api.delivery.com/merchant/search/delivery?client_id=NWUxNmJiNGIyMWMxNDE1YjRhMjY4OWM3OGUwNGZmOGYw&address=199 Water St 10038
angular.module('SlushFunApp')
  .service('deliveryDataService', ['$http', function ($http) {
    //using cors-anywhere as an api proxy to get around CORS issues with
    //app calls from client.. TODO: setup own, quicker proxy b4 live
    var baseUrl = "http://cors-anywhere.herokuapp.com/api.delivery.com/" +
      "merchant/search/delivery?client_id=" +
      "NWUxNmJiNGIyMWMxNDE1YjRhMjY4OWM3OGUwNGZmOGYw";
    var port = ":443";

    //TODO/leftoff: booze search, food search, all search (diff requests..)
    //lists all booze types available nearby, then search more by that place../
    this.getDeliveryPlaces = function(searchAddress, searchMerchantType){
      var merchantTypeParam = formatMerchantTypeParam(searchMerchantType);
      console.log(merchantTypeParam);
      console.log(baseUrl + merchantTypeParam+ '&address=' + searchAddress +  port);
      return $http.get(baseUrl + merchantTypeParam+ '&address=' + searchAddress +  port);
    }

    function formatMerchantTypeParam(searchMerchantType){
      var merchantTypeParam = "";
      if (searchMerchantType){
        merchantTypeParam = "&merchant_type=" + searchMerchantType;
      };
      return merchantTypeParam;

    }


  }]);
