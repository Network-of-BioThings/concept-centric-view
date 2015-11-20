'use strict';

angularApp.service('WikiService', function WikiService($http) {

  return {
    serviceId: "WikiService",
    searchImages: function(query) {
      //return $http.get('/static-data/elements/'+id+'.json').then(function(response) {
      var url = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + query + '&prop=images&format=json&imlimit=1';
      return $http.get(url).then(function(response) {
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    }
  }
});
