(function() {
  'use strict';

  angular
    .module('running')
    .controller('StravaController', MainController);

  /** @ngInject */
  function MainController( $http) {
    var vm = this;
    vm.title = "strava.html";

    $http.get('assets/data.json').success(function(data) {
      vm.remoteData            = data;
      vm.strava                = vm.remoteData.strava;
    });
    
  /*  $http({ method: 'JSONP', url: 'https://www.strava.com/api/v3/athletes/36194446/stats?per_page=1&access_token=45a64174484e9e7b99c8d5343ecb25f0451a3581&callback=JSON_CALLBACK' })
      .success(function (data) {
            console.log('hello', data);
            vm.athlete = data; // response data 
        }).
        error(function (data) {
            console.log(data);
        });
*/

    // FUNCTION DESCRIPTION
    vm.timelineClass                 = timelineClass;


    function timelineClass(item){
      var result;
      if (item.id%2!=0)result="js--fadeInLeft";
      else result="js--fadeInRight";
      
      return result;
    }
  }
})();
