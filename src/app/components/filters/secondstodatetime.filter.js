(function() {
    'use strict';
  
    angular
      .module('running')
      .filter('secondsToDateTime', secondsToDateTime);
  
    /** @ngInject */
    function secondsToDateTime() {   
        return function(seconds) {
            return new Date(1970, 0, 1).setSeconds(seconds);
        };

    }
  })();
  