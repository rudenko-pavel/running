(function() {
  'use strict';

  angular
    .module('running')
    .controller('StravaController', MainController);

  /** @ngInject */
  function MainController( $http) {
    var vm = this;
    vm.title = "strava.html"

  }
})();
