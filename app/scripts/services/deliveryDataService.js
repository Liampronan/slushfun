// https://api.delivery.com/merchant/search/delivery?client_id=NWUxNmJiNGIyMWMxNDE1YjRhMjY4OWM3OGUwNGZmOGYw&address=199 Water St 10038
angular.module('SlushFunApp')
  .service('deliveryDataService', ['$http', '$stateParams', 'localStorageService', '$q',
    function ($http, $stateParams, localStorageService, $q) {
    //using cors-anywhere as an api proxy to get around CORS issues with
    //app calls from client.. TODO: setup own, quicker proxy b4 live
    var baseUrl = "http://cors-anywhere.herokuapp.com/api.delivery.com/merchant/";
    //TODO: REFA baseURL so that it doesn't include merchant
    var guestTokenUrl = "http://cors-anywhere.herokuapp.com/api.delivery.com/customer/auth/guest?" +
      "client_id=NWUxNmJiNGIyMWMxNDE1YjRhMjY4OWM3OGUwNGZmOGYw";
    var clientId = "NWUxNmJiNGIyMWMxNDE1YjRhMjY4OWM3OGUwNGZmOGYw";
    var clientIdStaging = "ZmNlMDQ0NWFiZGQ5ZDVmZWE4Y2RhMTA1YzgxOWNmNDhi";
    var clientSecretStaging = "zpIjrBMVL1aGjLYWBo7YXyUFsfHx1jeR0vnp23XZ";
    var redirectUri = 'http://localhost:8000/checkout';
    var deilveryBaseUrl = baseUrl + "search/delivery?client_id=" + clientId;
    var port = ":443";
    var _this = this;

    this.getDeliveryPlaces = function(searchAddress, searchMerchantType){
      var merchantTypeParam = formatMerchantTypeParam(searchMerchantType);
      console.log(deilveryBaseUrl + merchantTypeParam+ '&address=' + searchAddress +  port);
      return $http.get(deilveryBaseUrl + merchantTypeParam+ '&address=' + searchAddress +  port);
    }

    this.getStoreMenu = function (storeId) {
      return $http.get(baseUrl + storeId + "/menu")
    };

    this.getStoreDetails = function (storeId) {
      return $http.get(baseUrl + storeId + "?client_id=" + clientId)
    };

    this.getGuestToken = function () {
      return $http.get(guestTokenUrl);
    }

    this.storeAPIUserCode  = function(APIUsercode) {
      localStorageService.add('APIUsercode', APIUsercode);
    }

    this.storeAPIAccessToken  = function(APIAccessToken) {
      localStorageService.add('APIAccessToken', APIAccessToken);
    }

    this.getAPIAccessTokenFromLocalStorage  = function() {
      return localStorageService.get('APIAccessToken');
    }

    this.getAPIToken = function (APIUserCode) {
      var deferred = $q.defer();

      $http({
        url: 'http://cors-anywhere.herokuapp.com/sandbox.delivery.com/third_party/access_token?client_id=' +
          clientIdStaging + '&redirect_uri=' + redirectUri + '&response_type=code&scope=global' +
          '&grant_type=authorization_code&client_secret=' + clientSecretStaging + '&code=' + APIUserCode,
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Access-Control-Allow-Origin': '*'}
      }).success(function (data, status, headers, config) {
          deferred.resolve(data.access_token);
        }).error(function (data, status, headers, config) {
          deferred.reject(data);
        });
        return deferred.promise;
    }

    this.getAPIUserCodeFromLocalStorage = function(){
      return localStorageService.get('APIUsercode')
    }

    this.getCreditCards = function () {
      var access_token = _this.getAPIAccessTokenFromLocalStorage();
      $http({
        url: 'http://cors-anywhere.herokuapp.com/sandbox.delivery.com/customer/cc?token=' + access_token,
        method: "GET",
        headers: {'Content-Type': 'application/x-www-form-urlencoded',
                  'Access-Control-Allow-Origin': '*',
                   'authorization': access_token}
      }).success(function (data) {
        console.log(data);
      }).error(function (data) {
        console.log(data)
      })
    }

    function formatMerchantTypeParam(searchMerchantType){
      var merchantTypeParam = "";
      if (searchMerchantType){
        merchantTypeParam = "&merchant_type=" + searchMerchantType;
      };
      return merchantTypeParam;

    }


  }]);
