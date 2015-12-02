'use strict';

angularApp.service('ConceptService', function ConceptService($http) {
  var hostname = "stagedata.bioontology.org";
  var apiService = 'http://' + hostname + '/ccv/';
  var apikey = "a140dc02-7bd9-4562-ad16-18a7d2e518ab"; // CCV api key

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