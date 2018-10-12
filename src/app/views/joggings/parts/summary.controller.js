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
    vm.firstJogging     = "FIRST JOGGING";
    vm.previousJogging  = "PREVIOUS JOGGING";
    vm.bestResults      = "BEST RESULTS";
    vm.hundred          = 1016;
    vm.slides           = [];
    vm.pathToSlides     = "../assets/images/summary/";
    vm.totalDist        = recordsFactory.getTotalDist();              // total running distance
    vm.currentCity;

    vm.promise = $http.get('assets/data.json');
    vm.promise.success(function(data) {
      vm.remoteData            = data;
      vm.joggings              = vm.remoteData.joggings;
      vm.cities                = vm.remoteData.cities;
      vm.waypoints             = vm.remoteData.waypoints;
    });


    // GOOGLE MAPS API
    vm.mapPath          = 'app/views/joggings/parts/map.html';
    vm.travelMode       = 'DRIVING';
    vm.centerMap        = '50.4504742,30.5194775';

    // FUNCTION DESCRIPTION
    vm.fJogging               = fJogging;           // date of first jogging
    vm.pJogging               = pJogging;           // date of previous jogging
    vm.getPercent             = getPercent;
    vm.aboutCity              = aboutCity;
    vm.getSlides              = getSlides;
    vm.numberSegments         = numberSegments;   //количество 10-километровых отрезков
    vm.createRoute            = createRoute;
    vm.viewCities             = viewCities;

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

    function numberSegments(){
      var result = Math.floor(vm.totalDist/10000);
      return result;
    }

    function createRoute(){
      var result = [];
      for (var i=1; i< vm.numberSegments(); i++){
        if (vm.waypoints[i].city!=0){
          result.push({location: {lat:vm.waypoints[i].coordinates[0], lng:vm.waypoints[i].coordinates[1]}, stopover: true});
        }
      }
      return result;
    }

    function viewCities(){
      var result=1;
      for (var i=1; i< vm.numberSegments(); i++){
        if (vm.waypoints[i].city!=0){
          result++;
        }
      }
      return result;
    }

  }
})();
