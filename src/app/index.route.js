(function() {
  'use strict';

  angular
    .module('running')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/views/home/home.html',
        controller: 'HomeController',
        controllerAs: 'home'
      })
      .state('joggings', {
        url: '/joggings',
        templateUrl: 'app/views/joggings/joggings.html',
        controller: 'JoggingsController',
        controllerAs: 'joggings'
      })
      .state('joggings.race', {
        url: '/:runID',
        templateUrl: 'app/views/joggings/details/race.html'
      })
      .state('conversion', {
        url: '/conversion',
        templateUrl: 'app/views/conversion/conversion.html',
        controller: 'ConversionController',
        controllerAs: 'conversion'
      })
      .state('strava', {
        url: '/strava',
        templateUrl: 'app/views/strava/strava.html',
        controller: 'StravaController',
        controllerAs: 'strava'
      })
      .state('depozit', {
        url: '/depozit',
        templateUrl: 'app/views/depozit/depozit.html',
        controller: 'DepozitController',
        controllerAs: 'depozit'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
