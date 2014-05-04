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
        controller:'MainCtrl'
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
      .state('deliveries',{
        url: '/deliveries',
        templateUrl: 'views/deliveries.html',
        controller: 'DeliveryCtrl'
      });
    })
  .constant('FBURL', 'https://slushfun.firebaseio.com/');






