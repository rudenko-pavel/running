(function() {
  'use strict';

  angular
    .module('running')
    .directive('bestResults', bestResults);

  /** @ngInject */
  function bestResults() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/bestresults/bestresults.html',
      controller: BestResultsController,
      controllerAs: 'bestresults',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function BestResultsController($http) {
      var vm = this;
      vm.currentDistance=0;

      vm.chartData        = [];
      vm.chartData[0]     = [];
      vm.chartLabels      = [];
      vm.chartSeries      = [];
      vm.chartOptions = {
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left',
              ticks: {
                suggestedMin: 0,
                callback: function(timestm) {
                  var hours   = Math.floor(timestm / 3600);
                  var minutes = Math.floor((timestm - (hours * 3600)) / 60);
                  var seconds = timestm - (hours * 3600) - (minutes * 60);

                  if (hours   < 10) {hours   = "0"+hours;}
                  if (minutes < 10) {minutes = "0"+minutes;}
                  if (seconds < 10) {seconds = "0"+seconds;}
                  return hours+':'+minutes+':'+seconds;
                }
              }
            }
          ]
        },
        tooltips: {
          callbacks: {
              label: function(tooltipItem) {
                var hours   = Math.floor(tooltipItem.yLabel / 3600);
                var minutes = Math.floor((tooltipItem.yLabel - (hours * 3600)) / 60);
                var seconds = tooltipItem.yLabel - (hours * 3600) - (minutes * 60);

                if (hours   < 10) {hours   = "0"+hours;}
                if (minutes < 10) {minutes = "0"+minutes;}
                if (seconds < 10) {seconds = "0"+seconds;}
                return hours+':'+minutes+':'+seconds;
              }
          }
        }
      }


      vm.promise = $http.get('assets/data.json');
      vm.promise.success(function(data) {
        vm.remoteData           = data;
        vm.joggings              = vm.remoteData.joggings;
        vm.len                   = vm.joggings.length;

      });

      // FUNCTION DESCRIPTION
      vm.bestResultsFunc        = bestResultsFunc;
      vm.viewDiagram            =  viewDiagram;
      vm.notViewDiagram         = notViewDiagram;

    // IMPLEMENTATION
      function bestResultsFunc(){
        var mathFloor;
        var result =[];
        var realTime;

        for (var i=0; i<vm.len; i++){
          mathFloor = Math.floor(vm.joggings[i].distance/1000);

          realTime = vm.joggings[i].parts.reduce(function(sum, current) {
            return sum + current;
          }, 0);

          if (result[mathFloor]>0){
            if (realTime<result[mathFloor])
            result[mathFloor] = realTime;
          }
          else{
            result[mathFloor] = realTime;
            }
        }
        return result;
      }

      function viewDiagram(key){
        /*console.log('viewDiagram(): ', key);*/
        vm.currentDistance = key;
        var oneRace = 0;
        var tmpLabels = "";
        var count = 0;
        
        for (var i = 0; i< vm.joggings.length; i++){
          
          if (Math.floor(vm.joggings[i].distance/1000) == vm.currentDistance){
            count++;
            for (var j=0; j<vm.joggings[i].parts.length; j++){
              oneRace = 0;
              tmpLabels = "";
                vm.joggings[i].parts.forEach(function(item) { 
                  oneRace +=item;
                });

              if (count%10==0) tmpLabels = count;
            }
            
            vm.chartLabels.push(tmpLabels);
            vm.chartData[0].push(oneRace);
          }
        }
      }

      function notViewDiagram(){
        vm.currentDistance = 0;
        vm.chartData = [];
        vm.chartData[0] = [];
        vm.chartLabels = [];
      }

      //$timeout(bestResultsFunc, 100);
    }
  }
})();
