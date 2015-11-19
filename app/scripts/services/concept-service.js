'use strict';

angularApp.service('ConceptService', function FormService($http) {
  var hostname = "stagedata.bioontology.org";
  var apiService = 'http://' + hostname + '/ccv/?q=';
  var apikey = "e68f509c-cf8f-4bce-a805-217571e03647"; // CEDAR api key

  return {
    serviceId: "ConceptService",
    concept: function(query) {
      //return $http.get('/static-data/elements/'+id+'.json').then(function(response) {
      var url = apiService + query + '&apikey=' + apikey;
      return $http.get(url).then(function(response) {
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    }
  }
});