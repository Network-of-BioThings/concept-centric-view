/*jslint node: true */
/*global angularApp */
'use strict';

var angularConfig = function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/search.html',
      controller: 'DashboardController'
    })
    .when('/dashboard/:query', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardController'
    })
    .otherwise({
      redirectTo: '/'
    });
};

angularConfig.$inject = ['$routeProvider', '$locationProvider'];
angularApp.config(angularConfig);