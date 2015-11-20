'use strict';

var DashboardController = function($rootScope, $scope, $routeParams, $location, ConceptService, WikiService) {

  $scope.query = $routeParams["query"];

  if ($scope.query) {
    // Using form service to load list of existing elements to embed into new form
    ConceptService.concept($scope.query).then(function(response) {
      $scope.conceptInfo = response;
      $scope.fillUpSlider();
      $scope.fillUpWordCloud();
      $scope.populateAnalytics();
      $scope.doTheGraph();
      $scope.setUpImagesCarousel();
      console.log("RESPONSE is:");
      console.log(response);
    });

    // Using form service to load list of existing elements to embed into new form
    WikiService.searchImages($scope.query);//
    // .then(function (response) {
    //  console.log('Wiki' + response);
    //});
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

  $scope.fillUpSlider = function() {
    $scope.dataContainer.definitions = $scope.conceptInfo.definitions;
  }

//------ Configure 3D JS WordCloud for synonyms ----------------------------------------------------------------------

  $scope.fillUpWordCloud_old = function() {
    var syns = $scope.conceptInfo.synonyms;
    console.log("CREATE WORD CLOUD");
    var synonyms = [];
    for (var i in syns) {
      var s = syns[i].synonym;
      synonyms.push(s);
    }
    $scope.dataContainer.synonyms = synonyms;
  }

  $scope.onClickWord = function(element) {
    console.log("click", element);
  }

  $scope.onHoverWord = function(element) {
    console.log("hover", element);
  }

  //----- jqCloud

  $scope.fillUpWordCloud = function() {
    var syns = $scope.conceptInfo.synonyms;
    console.log("CREATE WORD CLOUD");
    var synonyms = [];
    for (var i in syns) {
      var s = {"text": syns[i].synonym, "weight": syns[i].count};
      synonyms.push(s);
    }
    $scope.dataContainer.words = synonyms;
  }


  //------ Analytics
  $scope.populateAnalytics = function() {
    $scope.exampleData = [
      {
        "key": "Series 1",
        "values": [[1, $scope.conceptInfo.analytics["2014"]["11"]],
          [2, $scope.conceptInfo.analytics["2014"]["12"]],
          [3, $scope.conceptInfo.analytics["2015"]["1"]],
          [4, $scope.conceptInfo.analytics["2015"]["2"]],
          [5, $scope.conceptInfo.analytics["2015"]["3"]],
          [6, $scope.conceptInfo.analytics["2015"]["4"]],
          [7, $scope.conceptInfo.analytics["2015"]["5"]],
          [8, $scope.conceptInfo.analytics["2015"]["6"]],
          [9, $scope.conceptInfo.analytics["2015"]["7"]],
          [10, $scope.conceptInfo.analytics["2015"]["8"]],
          [11, $scope.conceptInfo.analytics["2015"]["9"]],
          [12, $scope.conceptInfo.analytics["2015"]["10"]]]
      }];
  }

  //------ Configure Graph in the middle ----------------------------------------------------------------------

  $scope.doTheGraph = function() {
    $scope.dataContainer.parents = $scope.conceptInfo.parents;
    $scope.dataContainer.children = $scope.conceptInfo.children;
    $scope.dataContainer.siblings = $scope.conceptInfo.siblings;
    $scope.dataContainer.term = $scope.conceptInfo.term;
  }

  // -Carousel-------------------------------------------------------------------------------------------------------
  $scope.setUpImagesCarousel = function() {
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    var slides = $scope.slides = [];
    for (var i = 0; i < $scope.conceptInfo.images.length; i++) {
      slides.push({
        image: $scope.conceptInfo.images[i],
        text: ""
      });
    }
  }
};


DashboardController.$inject = ["$rootScope", "$scope", "$routeParams", "$location", "ConceptService", "WikiService"];
angularApp.controller('DashboardController', DashboardController);