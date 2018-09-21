(function() {
  'use strict';

  angular
    .module('running')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, $state, $window) {
    $rootScope.$state = $state;
    $log.debug('runBlock end');

    // FB 161160107819496
/*
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;

        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

      $rootScope.$on('fb.load', function() { // eslint-disable-line
        $window.dispatchEvent(new Event('fb.load'));
      });
      */
  }

})();
