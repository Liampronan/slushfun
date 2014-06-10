'use strict';


  angular.module('SlushFunApp', [
      'ngCookies',
      'ngResource',
      'ngSanitize',
      'ui.router',
      'firebase',
      'LocalStorageModule',
      'fundoo.services', //modal service
      'angular-loading-bar'
     ])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
      $urlRouterProvider.otherwise('/');
      $urlRouterProvider.when('/', '/deliveries');
      $locationProvider.html5Mode(true).hashPrefix('!'); //not enabled due to firebase server - when move onto own
// server, it can be enabled
      $stateProvider
        .state('index', {
          url: '/',
          templateUrl: '/views/main.html',
          controller: 'MainCtrl'
        })
        .state('index.login', {
          url: 'login',
          templateUrl: '/views/login.html',
          controller: 'AuthCtrl'
        })
        .state('index.register', {
          url: 'register',
          templateUrl: '/views/register.html',
          controller: 'AuthCtrl'
        })
        .state('index.deliveries', {
          url: 'deliveries',
          templateUrl: '/views/deliveries.html',
          controller: 'DeliveryCtrl'
        })
        .state('index.deliveries.nearMe', {
        url: "/near_me",
        templateUrl: '/views/deliveries.nearMe.html',
        controller: 'SearchResultsCtrl'
        })
        .state('index.deliveries.nearMe.details', {
          url: "/:storeId",
          templateUrl: '/views/deliveries.nearMe.details.html',
          controller: 'StoreDetailsCtrl'
        })
        .state('index.store', {
          url: 'store/:storeId',
          templateUrl: '/views/directStoreDetails.html',
          //REFA: incorporate this ctrl into above StoreDetails - should
          //not have 2 for searching vs direct browsing..
          controller: 'DirectStoreDetailsCtrl'
        })
        .state('index.cart', {
          url: 'cart',
          templateUrl: '/views/cart.html',
          controller: 'CartCtrl'
        })
        .state('index.groupCart', {
          url: 'group_cart/:groupId',
          templateUrl: '/views/groupCart.html',
          controller: 'GroupCartCtrl'
        })
        .state('index.checkout', {
          url: 'checkout',
          templateUrl: '/views/checkout.html',
          controller: 'GroupCartCtrl',
        })
        .state('index.review', {
          url: 'review?tip&notes',
          templateUrl: '/views/checkout.review.html',
          controller: 'GroupCartCtrl'
        })
        .state('index.successfulDelivery', {
          url: 'successful_delivery/:orderId',
          templateUrl: '/views/successfulDelivery.html',
          controller: 'GroupCartCtrl'
        })
        .state('index.howItWorks', {
          url: 'how_it_works',
          templateUrl: '/views/howItWorks.html',
          controller: 'WorksCtrl'
        })

    })
    .constant('FBURL', 'https://slushfun.firebaseio.com/');






