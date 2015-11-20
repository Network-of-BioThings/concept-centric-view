'use strict';

angularApp.service('ConceptService', function ConceptService($http) {
  var hostname = "stagedata.bioontology.org";
  var apiService = 'http://' + hostname + '/ccv/';
  var apikey = "e68f509c-cf8f-4bce-a805-217571e03647"; // CEDAR api key

  return {
    serviceId: "ConceptService",

    getBaseData: function (query) {
      return this.getConceptData(query, false, false, false);
    },

    getFamily: function (query) {
      return this.getConceptData(query, true, false, false);
    },

    getAnalytics: function (query) {
      return this.getConceptData(query, false, true, false);
    },

    getImages: function (query) {
      return this.getConceptData(query, false, false, true);
    },

    getConceptData: function (query, includeFamily, includeAnalytics, includeImages) {
      var params = {
        q: query,
        apikey: apikey,
        include_family: includeFamily,
        include_analytics: includeAnalytics,
        include_images: includeImages
      }

      var url = apiService;
      var sep = "?";
      for (var key in params) {
        url += sep + key + "=" + params[key];
        sep = "&";
      }

      //console.log("LOAD URL:" + url);
      //var url = apiService + query + '&apikey=' + apikey;
      //var url = "json-examples/stomach.json";
      return $http.get(url).then(function (response) {

        return response.data;
      }).catch(function (err) {
        console.log(err);
      });
    }

  }
});