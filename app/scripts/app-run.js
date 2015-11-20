/*jslint node: true */
/*global angularApp */
/*global angular */
/*global jQuery */
'use strict';

var angularRun = function ($rootScope) {

  $rootScope.resetDataContainer = function () {
    $rootScope.dataContainer = {
      definitions: [],
      synonyms: [],
      words: [],
      analytics: {},
      images: [],
      imagesActive: false,
      term: null
    };
  };
};

angularRun.$inject = ['$rootScope'];
angularApp.run(angularRun);
