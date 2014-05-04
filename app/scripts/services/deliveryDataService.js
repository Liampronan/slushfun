// https://api.delivery.com/merchant/search/delivery?client_id=NWUxNmJiNGIyMWMxNDE1YjRhMjY4OWM3OGUwNGZmOGYw&address=199 Water St 10038
angular.module('SlushFunApp')
  .service('deliveryDataService', ['$http', function ($http) {
    //using cors-anywhere as an api proxy to get around CORS issues with
    //app calls from client.. TODO: setup own, quicker proxy b4 live
    var baseUrl = "http://cors-anywhere.herokuapp.com/api.delivery.com/" +
      "merchant/search/delivery?client_id=" +
      "NWUxNmJiNGIyMWMxNDE1YjRhMjY4OWM3OGUwNGZmOGYw";
    var port = ":443";

    this.getDeliveryPlaces = function(searchAddress, searchMerchantType){
      var merchantType = "";
      if (searchMerchantType){
        merchantType = "&merchant_type=" + searchMerchantType;
      };
      return $http.get(baseUrl + merchantType + '&address=' + searchAddress +  port);
    }

  }]);
