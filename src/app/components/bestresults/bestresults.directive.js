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
    function BestResultsController($http, $timeout) {
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
                suggestedMin: 0
              }
            }
          ]
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
        console.log('viewDiagram(): ', key);
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
