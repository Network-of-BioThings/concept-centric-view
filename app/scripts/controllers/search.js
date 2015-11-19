'use strict';

var SearchController = function($rootScope, $scope, $routeParams, $location, ConceptService) {

  $scope.query = "";

  $scope.search = function() {

    console.log($scope.query);
  }

}

DashboardController.$inject = ["$rootScope", "$scope", "$routeParams", "$location", "ConceptService"];
angularApp.controller('SearchController', SearchController);

