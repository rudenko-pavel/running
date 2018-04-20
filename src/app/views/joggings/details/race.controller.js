(function() {
  'use strict';

  angular
    .module('running')
    .controller('RaceController', MainController);

  /** @ngInject */
  function MainController($http,$log,$stateParams, $filter, $timeout) {


    var vm = this;
    vm.runID            = $stateParams.runID;
    vm.chartData        = [];
    vm.chartData[0]     = [];
    vm.chartLabels      = [];
    vm.chartSeries      = [];
    vm.slides           = [];
    vm.pathToSlides    = "../assets/images/competition/";

    var tmpSeries       = 'race #'+vm.runID;
    vm.chartSeries.push(tmpSeries);

    $http.get('assets/data.json').success(function(data) {
      vm.remoteData            = data;
      vm.chartColors           = vm.remoteData.chartColors;
      vm.joggings              = vm.remoteData.joggings;

      for (var i = 0; i< vm.joggings.length; i++){
        if (vm.joggings[i].id == vm.runID){
          for (var j=0; j<vm.joggings[i].parts.length; j++){
            vm.chartData[0].push(vm.joggings[i].parts[j]);
            var tmpLabels = (j+1)+"km";
            vm.chartLabels.push(tmpLabels);
          }

        }
      }
    });

    vm.chartOptions = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:false,
            min : 180,
            max : 540,
            stepSize: 60
          }
        }]
      }
    }
//https://github.com/jtblin/angular-chart.js


    // FUNCTION DESCRIPTION
    vm.fastKm                 = fastKm;                   // check fastest km in race
    vm.slowKm                 = slowKm;                   // check most slow km in race
    vm.parseIntRunId          = parseIntRunId;            // parse to Int parameter `runId`
    vm.aboutRace              = aboutRace;
    vm.getSlides              = getSlides;
    vm.intDistance              = intDistance;
    vm.intDistanceTime          = intDistanceTime;

    // IMPLEMENTATION
    function fastKm(runID,cId){
      var result;
      var fKm = 100000;
      if (angular.isDefined(vm.joggings)){
        for (var i=0; i<vm.joggings.length; i++){
          if (vm.joggings[i].id == parseInt(runID)){
            for (var j=0; j<vm.joggings[i].parts.length; j++){
              vm.joggings[i].parts[j] < fKm ? (fKm = vm.joggings[i].parts[j], result = j) :'';
            }
          }
        }
      }
      result == cId ? result = true : result = false;
      return result;
    }

    function slowKm(runID,cId){
      var result;
      var fKm = 0;
      if (angular.isDefined(vm.joggings)){
        for (var i=0; i<vm.joggings.length; i++){
          if (vm.joggings[i].id == parseInt(runID)){
            for (var j=0; j<vm.joggings[i].parts.length; j++){
              vm.joggings[i].parts[j] > fKm ? (fKm = vm.joggings[i].parts[j], result = j ) :'';
            }
          }
        }
      }
      result == cId ? result = true : result = false;
      return result;
    }

    function aboutRace(cId, field){
      var result;
      if (angular.isDefined(vm.joggings)){
        for (var i=0; i<vm.joggings.length; i++){
          vm.joggings[i].id == cId ? result = vm.joggings[i][field] :'';
        }
      }
      field == 'date' ? result = $filter('date')(result, 'dd/MM/yyyy'):'';
      field == 'time' ? result = $filter('date')(result*1000, 'HH:mm:ss', '+0000'):'';
      return result;
    }

    function parseIntRunId(runId){
      return function( item ) {
        return item.id === parseInt(runId);
      };
    }

    function getSlides(){
      var fromFolder = vm.pathToSlides + parseInt($stateParams.runID) + "/";
      if (angular.isDefined(vm.joggings)){
        for (var i=0; i<vm.joggings.length; i++){
          if (vm.joggings[i].id == parseInt($stateParams.runID)){
            for (var j=1; j<=vm.joggings[i].slides; j++){
              var addImage = fromFolder + j + ".jpg";
              vm.slides.push({src:addImage});
            }
          }
        }

        return vm.slides;
      }
    }

    function intDistance(distance){
      return Math.floor(distance/1000);
    }

    function intDistanceTime(cId){
      var result = 0;
      if (angular.isDefined(vm.joggings)){
        for (var i=0; i<vm.joggings.length; i++){
          if (vm.joggings[i].id == cId){
            for (var j=0; j<vm.joggings[i].parts.length; j++){
              result += vm.joggings[i].parts[j];
            }
          }
        }
      }
      return result;
    }

    $timeout(getSlides, 1000);
  }
})();
