(function() {
  'use strict';

  angular
    .module('running')
    .controller('SummaryController', MainController);

  /** @ngInject */
  function MainController($http, $log, $filter,recordsFactory) {
    var vm = this;
    vm.countJoggi       = "JOGGINGS";
    vm.totalDistance    = "TOTAL DISTANCE";
    vm.totalTime        = "TOTAL TIME";
    vm.firstJogging     = "FIRST JOGGING"
    vm.previousJogging  = "PREVIOUS JOGGING"
    vm.hundred          = 1016;
    vm.slides           = [];
    vm.pathToSlides     = "../assets/images/summary/";
    vm.totalDist        = recordsFactory.getTotalDist();              // total running distance
    vm.currentCity;

    // GOOGLE MAPS API
    vm.mapPath          = 'app/views/joggings/parts/map.html';
    vm.origin           = 'kharkiv';
    vm.destination      = 'lviv';
    vm.travelMode       = 'DRIVING';
    vm.centerMap        = '50.4504742,30.5194775';
    vm.wayPoints = [
      {location: {lat:49.59373, lng: 34.54073}, stopover: true},
      {location: {lat:50.01625, lng: 32.99694}, stopover: true},
      {location: {lat:50.45466, lng: 30.52388}, stopover: true},
      {location: {lat:50.26487, lng: 28.67669}, stopover: true},
      {location: {lat:50.62308, lng: 26.22743}, stopover: true}
    ];


    vm.promise = $http.get('assets/data.json');
    vm.promise.success(function(data) {
      vm.remoteData            = data;
      vm.joggings              = vm.remoteData.joggings;
      vm.cities                = vm.remoteData.cities;
    });


    // FUNCTION DESCRIPTION
    vm.fJogging               = fJogging;           // date of first jogging
    vm.pJogging               = pJogging;           // date of previous jogging
    vm.getPercent             = getPercent;
    vm.aboutCity              = aboutCity;
    vm.getSlides              = getSlides;

    // IMPLEMENTATION

    function fJogging(){
      if (angular.isDefined(vm.joggings) && vm.joggings.length){
       var result = vm.joggings[0].date;
       for (var i=1; i<vm.joggings.length; i++){
         if(vm.joggings[i].date < result){
          result = vm.joggings[i].date;
         }
       }
        return $filter('date')(result, 'dd/MM/yyyy');
      }
    }

    function pJogging(){
      if (angular.isDefined(vm.joggings) && vm.joggings.length){
        var result = vm.joggings[0].date;
        for (var i=1; i<vm.joggings.length; i++){
          if(vm.joggings[i].date > result){
            result = vm.joggings[i].date;
          }
        }
        return $filter('date')(result, 'dd/MM/yyyy');
      }
    }

    function getPercent(){
      var result = (vm.totalDist/vm.hundred/10)+"%";
      return result;
    }

    function aboutCity(){
      var result;
      if (angular.isDefined(vm.cities)){
        for(var i = 0; i<vm.cities.length; i++){
           if (vm.cities[i].id == parseInt(vm.currentCity)){
            result = vm.cities[i].name;
            break;
          }
        }
        return result;
      }
    }

    function getSlides(itemId){
      if (itemId){
        vm.currentCity = itemId;
      }
      var fromFolder = vm.pathToSlides + parseInt(vm.currentCity) + "/";
      if (angular.isDefined(vm.cities)){
        vm.slides=[];
        for (var i=0; i<vm.cities.length; i++){
          if (vm.cities[i].id == parseInt(vm.currentCity)){
            for (var j=1; j<=vm.cities[i].slides; j++){
              var addImage = fromFolder + j + ".png";
              vm.slides.push({src:addImage});
            }
          }
        }
        return vm.slides;
      }
    }

  }
})();
