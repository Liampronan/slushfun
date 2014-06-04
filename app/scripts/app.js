'use strict';


  angular.module('SlushFunApp', [
      'ngCookies',
      'ngResource',
      'ngSanitize',
      'ui.router',
      'firebase',
      'LocalStorageModule'
     ])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('index', {
          url: '/',
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        })
        .state('index.login', {
          url: 'login',
          templateUrl: 'views/login.html',
          controller: 'AuthCtrl'
        })
        .state('index.register', {
          url: 'register',
          templateUrl: 'views/register.html',
          controller: 'AuthCtrl'
        })
        .state('index.deliveries', {
          url: 'deliveries',
          templateUrl: 'views/deliveries.html',
          controller: 'DeliveryCtrl'
        })
        .state('index.deliveries.nearMe', {
        url: "/near_me",
        templateUrl: 'views/deliveries.nearMe.html',
        controller: 'SearchResultsCtrl'
        })
        .state('index.deliveries.nearMe.details', {
          url: "/:storeId",
          templateUrl: 'views/deliveries.nearMe.details.html',
          controller: 'StoreDetailsCtrl'
        })
        .state('index.store', {
          url: 'store/:storeId',
          templateUrl: 'views/directStoreDetails.html',
          //REFA: incorporate this ctrl into above StoreDetails - should
          //not have 2 for searching vs direct browsing..
          controller: 'DirectStoreDetailsCtrl'
        })
        .state('index.cart', {
          url: 'cart',
          templateUrl: 'views/cart.html',
          controller: 'DirectStoreDetailsCtrl'
        })
        .state('index.group_cart', {
          url: 'group_cart/:groupId',
          templateUrl: 'views/cart.html',
          controller: 'DirectStoreDetailsCtrl'
        })

    })
    .constant('FBURL', 'https://slushfun.firebaseio.com/');






