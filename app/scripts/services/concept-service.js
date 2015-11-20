'use strict';

angularApp.service('ConceptService', function ConceptService($http) {
  var hostname = "stagedata.bioontology.org";
  var apiService = 'http://' + hostname + '/ccv/?q=';
  var apikey = "e68f509c-cf8f-4bce-a805-217571e03647"; // CEDAR api key

  return {
    serviceId: "ConceptService",
    concept: function(query) {
      var url = apiService + query + '&apikey=' + apikey;
      //var url = "json-examples/sample_output.json";
      return $http.get(url).then(function(response) {
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    }
  }
});
