'use strict';

var SearchController = function($rootScope, $scope, $routeParams, $location, ConceptService, $window) {

  $scope.query = "";

  $scope.search = function() {

    console.log($scope.query);
    $window.location.href = '#/dashboard/' + $scope.query;
  }

}

DashboardController.$inject = ["$rootScope", "$scope", "$routeParams", "$location", "ConceptService", "$window"];
angularApp.controller('SearchController', SearchController);

