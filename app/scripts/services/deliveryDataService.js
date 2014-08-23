// https://api.delivery.com/merchant/search/delivery?client_id=NWUxNmJiNGIyMWMxNDE1YjRhMjY4OWM3OGUwNGZmOGYw&address=199 Water St 10038
angular.module('SlushFunApp')
  .service('deliveryDataService', ['$http', '$stateParams', 'localStorageService', '$q', 'shoppingCartService',
    function ($http, $stateParams, localStorageService, $q, shoppingCartService) {
    //using cors-anywhere as an api proxy to get around CORS issues with
    //app calls from client.. TODO: setup own, quicker proxy b4 live
    var baseUrl = "http://cors-anywhere.herokuapp.com/api.delivery.com/merchant/";
    //TODO: REFA baseURL so that it doesn't include merchant
    var guestTokenUrl = "http://cors-anywhere.herokuapp.com/api.delivery.com/customer/auth/guest?" +
      "client_id=NWUxNmJiNGIyMWMxNDE1YjRhMjY4OWM3OGUwNGZmOGYw";
    var clientId = "ZmU5NjNmNmU4MzZmMjJjMmQ3Y2Y4MGRhMDJlMTBiNjg3";
    var clientIdStaging = "ZmU5NjNmNmU4MzZmMjJjMmQ3Y2Y4MGRhMDJlMTBiNjg3";
    var clientSecretStaging = "
    var redirectUri = 'http://slushfun.herokuapp.com/checkout';
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

    this.storeDeliveryAPICartLocalStorage = function(APICart){
      localStorageService.add('APICart', APICart);
    }

    this.getDeliveryAPICartLocalStorage = function(){
      return localStorageService.get('APICart');
    }

    this.storeDeliveryAPICCLocalStorage = function (cards) {
      localStorageService.add('APICards', cards);
    }

    this.getDeliveryAPICCLocalStorage = function(){
      return localStorageService.get('APICards');
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

//    this.addLocationDataToLocalStorage = function(locationData){
//        localStorageService.add('locationData', locationData)
//      }

    this.getLocations = function () {
      var deferred = $q.defer();
      var access_token = _this.getAPIAccessTokenFromLocalStorage();
      $http({
        url: 'http://cors-anywhere.herokuapp.com/sandbox.delivery.com/customer/location/',
        method: "GET",
        headers: {'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Control-Allow-Origin': '*',
          'authorization': access_token}
      }).success(function (data) {
          localStorageService.add('APIlocations', data);
          deferred.resolve(data);
        }).error(function (data) {
          console.log(data)
        })
      return deferred.promise
    }

    this.getCreditCardsAPI = function () {
      var deferred = $q.defer();
      var access_token = _this.getAPIAccessTokenFromLocalStorage();
      $http({
        url: 'http://cors-anywhere.herokuapp.com/sandbox.delivery.com/customer/cc',
        method: "GET",
        headers: {'Content-Type': 'application/x-www-form-urlencoded',
                  'Access-Control-Allow-Origin': '*',
                   'authorization': access_token}
      }).success(function (data) {
        localStorageService.add('creditCard', data);
        deferred.resolve(data);
      }).error(function (data) {
        console.log(data)
      })
      return deferred.promise
    }

      this.postLocation = function () {
        var deferred = $q.defer();
        var transform = function(data){
          return $.param(data);
        }
        var access_token = _this.getAPIAccessTokenFromLocalStorage();
        var locationData = _this.getLocationDataFromLocalStorage();
        var phoneNumber = shoppingCartService.getPhoneNumber();
        var url = 'http://cors-anywhere.herokuapp.com/sandbox.delivery.com/customer/location';
        var data = {
          street: locationData.street,
          city: locationData.city,
          zip_code: locationData.zip_code,
          state: locationData.state,
          phone: phoneNumber
        };
        var headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Control-Allow-Origin': '*',
          'authorization': access_token
        };
        $http({
          method: "post",
          url: url,
          data: data,
          headers: headers,
          transformRequest: transform
        }).success(function (data) {
            console.log(data);
            deferred.resolve(data)
          })
        return deferred.promise
      };

    this.postCartItem = function (cartItem, merchId) {
      var deferred = $q.defer();
      var transform = function(data){
        return $.param(data);
      }
      var access_token = _this.getAPIAccessTokenFromLocalStorage();
      var url = 'http://cors-anywhere.herokuapp.com/sandbox.delivery.com/customer/cart/' + merchId;
      var data = {
        order_type: "delivery",
//        "instructions": "Some instructions",
        item: {
          item_id: cartItem.menuItemId,
          item_qty: 1
        },
        client_id: clientIdStaging
      };
      var headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
        'authorization': access_token
      };
      $http({
        method: "post",
        url: url,
        data: data,
        headers: headers,
        transformRequest: transform
      }).success(function (data) {
          deferred.resolve(data)
        })
      return deferred.promise
    };

    this.checkOut = function (merchId, paymentType, paymentId, instructions, tip) {

      var deferred = $q.defer();
      var transform = function(data){
        return $.param(data);
      }
      var access_token = _this.getAPIAccessTokenFromLocalStorage();
      var locationId = shoppingCartService.getLocationId();
      var url = 'http://cors-anywhere.herokuapp.com/sandbox.delivery.com/customer/cart/' + merchId + '/checkout' ;
      var data = {
        order_type: "delivery",
        payments: [
          {
            type: paymentType === 'creditCard' ? 'credit_card' : paymentType,
            id: paymentId
          }
        ],
        instructions: instructions,
        tip: tip,
        location_id: locationId
      };
      var headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
        'authorization': access_token
      };
      $http({
        method: "post",
        url: url,
        data: data,
        headers: headers,
        transformRequest: transform
      }).success(function (data) {
          deferred.resolve(data)
        })
      return deferred.promise
    }

    this.getLocationDataFromLocalStorage = function () {
      return localStorageService.get('locationData')
    }


    this.deleteCart = function (merchId) {
      var deferred = $q.defer();
      var accessToken = _this.getAPIAccessTokenFromLocalStorage();
      var headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
        'authorization': accessToken
      };
      $http({
        method: "DELETE",
        url: 'http://cors-anywhere.herokuapp.com/sandbox.delivery.com/customer/cart/' + merchId,
        headers: headers
      }).success(function (data) {
          deferred.resolve(data)
        })
      return deferred.promise
    }

    this.getCart = function (merchId) {
      var deferred = $q.defer();
      var accessToken = _this.getAPIAccessTokenFromLocalStorage();
      var locationData = _this.getLocationDataFromLocalStorage();
      var headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
        'authorization': accessToken
      };
      $http({
        method: "GET",
        url: 'http://cors-anywhere.herokuapp.com/sandbox.delivery.com/customer/cart/' + merchId,
        params: {
          zip: locationData.zip_code,
          city: locationData.city,
          state: locationData.state,
          latitude: locationData.latitude,
          longitude: locationData.longitude
        },
        headers: headers
      }).success(function (data) {
          deferred.resolve(data)
      }).error(function (data) {
          deferred.reject(data)
        })
      return deferred.promise
    }



    function formatMerchantTypeParam(searchMerchantType){
      var merchantTypeParam = "";
      if (searchMerchantType){
        merchantTypeParam = "&merchant_type=" + searchMerchantType;
      };
      return merchantTypeParam;

    }


  }]);
