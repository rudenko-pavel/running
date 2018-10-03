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

      vm.promise = $http.get('assets/data.json');
      vm.promise.success(function(data) {
        vm.remoteData           = data;
        vm.joggings              = vm.remoteData.joggings;
        vm.len                   = vm.joggings.length;
      });

      // FUNCTION DESCRIPTION
      vm.bestResultsFunc        = bestResultsFunc;

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
      //$timeout(bestResultsFunc, 100);
    }
  }
})();
