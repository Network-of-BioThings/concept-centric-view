'use strict';

var DashboardController = function ($rootScope, $scope, $routeParams, $location, ConceptService, CONST, $window) {

  var query = $routeParams["query"];
  $scope.q = query;
  $scope.newQuery = "";

  $scope.search = function() {
    $window.location.href = '#/dashboard/' + $scope.newQuery;
  }

  if (query) {
    ConceptService.getBaseData(query).then(function (response) {
      $scope.fillUpSlider(response);
      $scope.fillUpWordCloud(response);
      $scope.fillUpOntoWordCloud(response);
      $scope.doTheUris(response);
      //console.log("RESPONSE is:");
      //console.log(response);
    });

    ConceptService.getFamily(query).then(function (response) {
      $scope.doTheGraph(response);
      //console.log("RESPONSE is:");
      //console.log(response);
    });

    ConceptService.getImages(query).then(function (response) {
      $scope.doTheImages(response);
      //console.log("RESPONSE is:");
      //console.log(response);

    });

    ConceptService.getAnalytics(query).then(function (response) {
      $scope.doTheAnalytics(response);
      //console.log("RESPONSE is:");
      //console.log(response);

    });

    $window.ga('send', 'pageview', { page: $location.url() });
  }

//------ Init data container ----------------------------------------------------------------------

  $rootScope.resetDataContainer();


//------ Configure JSSOR slider for definitions  ----------------------------------------------------------------------

  $scope.sliderWithArrowOptions = {
    name: "sliderWithArrow",
    $AutoPlay: true,
    $DragOrientation: 3,                          //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)
    $SlideDuration: 800,                          //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 500
    $ArrowNavigatorOptions: {                     //[Optional] Options to specify and enable arrow navigator or not
      $Class: $JssorArrowNavigator$,              //[Requried] Class to create arrow navigator instance
      $ChanceToShow: 2,                           //[Required] 0 Never, 1 Mouse Over, 2 Always
      $AutoCenter: 2,                             //[Optional] Auto center arrows in parent container, 0 No, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
      $Steps: 1                                   //[Optional] Steps to go for each navigation request, default value is 1
    },
    $BulletNavigatorOptions: {
      $Class: $JssorBulletNavigator$,
      $SpacingX: 5,
      $Rows: 2
    }
  };

  $scope.fillUpSlider = function (response) {
    $scope.dataContainer.definitions = response.definitions;
    $scope.myIntervalDefs = 7000;
    $scope.noWrapSlidesDefs = false;
    var slidesDefs = $scope.slidesDefs = [];
    for (var i = 0; i < response.definitions.length; i++) {
      slidesDefs.push({
        //image: response.images[i],
        text: response.definitions[i].definition
      });
    }
  }

  $scope.doTheImages = function (response) {
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    var slides = [];
    for (var i = 0; i < response.images.length; i++) {
      slides.push({
        url: response.images[i].url,
        text: response.images[i].source
      });
    }
    $rootScope.dataContainer.images = slides;
    $rootScope.dataContainer.imagesActive = true;
  }

  $scope.doTheUris = function (response) {
    $scope.dataContainer.ids = response.ids;

    var idsCount = [];
    for (var i = 0; i < response.ids.length; i++) {
      idsCount.push([response.ids[i].id,
        response.ids[i].count])
      };

    idsCount = idsCount.sort(ComparatorUris);
    idsCount = idsCount.slice(0, Math.min(idsCount.length, 20));

    $scope.idsData = [
      {
        "key": "Relevant URIs",
        "values": idsCount
      }];
  }

  function ComparatorUris(a,b){
    if (a[1] < b[1]) return 1;
    if (a[1] > b[1]) return -1;
    return 0;
  }

  $scope.doTheAnalytics = function (response) {
    $scope.exampleData = [
      {
        "key": "Series 1",
        "values": [
          [1, response.analytics["2014"]["11"]],
          [2, response.analytics["2014"]["12"]],
          [3, response.analytics["2015"]["1"]],
          [4, response.analytics["2015"]["2"]],
          [5, response.analytics["2015"]["3"]],
          [6, response.analytics["2015"]["4"]],
          [7, response.analytics["2015"]["5"]],
          [8, response.analytics["2015"]["6"]],
          [9, response.analytics["2015"]["7"]],
          [10, response.analytics["2015"]["8"]],
          [11, response.analytics["2015"]["9"]],
          [12, response.analytics["2015"]["10"]]]
      }];
  }

//------ Configure jqCloud for synonyms ----------------------------------------------------------------------

  $scope.fillUpWordCloud = function (response) {
    var syns = response.synonyms;

    //console.log("CREATE WORD CLOUD");
    var synonyms = [];
    for (var i in syns) {
      var s = {"text": syns[i].synonym, "weight": syns[i].count};
      synonyms.push(s);
    }

    var colors = CONST.synonymWordCloud.colors;
    $rootScope.dataContainer.wordColors = colors;
    $rootScope.dataContainer.wordSteps = colors.length;
    $rootScope.dataContainer.words = synonyms;
    $rootScope.dataContainer.wordFontSizes = {"from": 0.15, "to": 0.04};
  }

  //------ Configure jqCloud for ontologies ----------------------------------------------------------------------

  $scope.fillUpOntoWordCloud = function (response) {
    var onts = response.ontologies;

    ///console.log("CREATE WORD CLOUD FOR ONTOLOGIES");
    var ontologies = [];
    for (var i in onts) {
      var s = {"text": onts[i].acronym, "weight": onts[i].rank, "link": onts[i].ui};
      ontologies.push(s);
    }

    var colors = ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#feb24c", "#fed976"];
    $rootScope.dataContainer.ontoWordColors = colors;
    $rootScope.dataContainer.ontoWordSteps = colors.length;
    $rootScope.dataContainer.ontoWords = ontologies;
    $rootScope.dataContainer.ontoWordFontSizes = {"from": 0.15, "to": 0.04};
  }
  //------ Configure Graph in the middle ----------------------------------------------------------------------

  $scope.doTheGraph = function (response) {
    $rootScope.dataContainer.parents = response.parents;
    $rootScope.dataContainer.children = response.children;
    $rootScope.dataContainer.siblings = response.siblings;
    $rootScope.dataContainer.term = response.term;
    //console.log(" DO THE GRAPH");
    //console.log($rootScope.dataContainer);
  }
};

DashboardController.$inject = ["$rootScope", "$scope", "$routeParams", "$location", "ConceptService", "CONST", '$window'];
angularApp.controller('DashboardController', DashboardController);