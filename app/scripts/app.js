'use strict';


  angular.module('SlushFunApp', [
      'ngCookies',
      'ngResource',
      'ngSanitize',
      'ui.router',
      'firebase'
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
        .state('deliveries', {
          url: '/deliveries',
          templateUrl: 'views/deliveries.html',
          controller: 'DeliveryCtrl'
        })
        .state('deliveries.nearMe', {
        url: "/near_me",
        templateUrl: 'views/deliveries.nearMe.html',
        controller: 'SearchResultsCtrl'
      })
        .state('deliveries.nearMe.details', {
          url: "/:storeId",
          templateUrl: 'views/deliveries.nearMe.details.html',
          controller: 'StoreDetailsCtrl'
        })

    });
//    .constant('FBURL', 'https://slushfun.firebaseio.com/');






