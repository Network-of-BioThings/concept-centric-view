'use strict';

var DashboardController = function ($rootScope, $scope, $routeParams, $location, ConceptService) {

  var query = $routeParams["query"];
  $scope.q = query;

  if (query) {
    ConceptService.getBaseData(query).then(function (response) {
      $scope.fillUpSlider(response);
      $scope.fillUpWordCloud(response);
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
  }

//------ Analytics data  ----------------------------------------------------------------------

  $scope.dataContainer = {
    definitions: [],
    synonyms: [],
    words: [],
    analytics: {},
    term: null
  };

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
    var slides = $scope.slides = [];
    for (var i = 0; i < response.images.length; i++) {
      slides.push({
        image: response.images[i],
        text: ""
      });
    }
  }

  $scope.doTheAnalytics = function (response) {
    $scope.exampleData = [
      {
        "key": "Series 1",
        "values": [[1, response.analytics["2014"]["11"]],
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

    console.log("CREATE WORD CLOUD");
    var synonyms = [];
    for (var i in syns) {
      var s = {"text": syns[i].synonym, "weight": syns[i].count};
      synonyms.push(s);
    }

    var colors = ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#feb24c", "#fed976"];
    $scope.dataContainer.wordColors = colors;
    $scope.dataContainer.wordSteps = colors.length;
    $scope.dataContainer.words = synonyms;
    $scope.dataContainer.wordFontSizes = {"from": 0.15, "to": 0.04};
  }

  //------ Configure Graph in the middle ----------------------------------------------------------------------

  $scope.doTheGraph = function (response) {
    $scope.dataContainer.parents = response.parents;
    $scope.dataContainer.children = response.children;
    $scope.dataContainer.siblings = response.siblings;
    $scope.dataContainer.term = response.term;

  }
};

DashboardController.$inject = ["$rootScope", "$scope", "$routeParams", "$location", "ConceptService"];
angularApp.controller('DashboardController', DashboardController);