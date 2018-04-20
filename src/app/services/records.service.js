(function() {
  'use strict';

  angular
    .module('running')
    .factory('recordsFactory', Service);

  /** @ngInject */
  function Service($http, $log){
    var vm              = this;
    vm.bigCurrentPage   = 1;

    $http.get('assets/data.json').success(function(data) {
      vm.remoteData            = data;
      vm.joggings              = vm.remoteData.joggings;
    });

    function getTotalCountRecords(){                        // return count of joggings
      if (angular.isDefined(vm.joggings)){
        return vm.joggings.length;
      }
    }

    function getBigCurrentPage (){                          // return current page in paginator
      return vm.bigCurrentPage;
    }

    function setBigCurrentPage (value){                     // change current page in paginator
      vm.bigCurrentPage = value;
    }

    function getTotalDist(){                                // return total distance (m)
      if (angular.isDefined(vm.joggings)){
        var result=0;
        for (var i=0; i<vm.joggings.length; i++){
           result += vm.joggings[i].distance;
        }
        return result;
      }
    }

    function setValue (newValue){
      $log.info('setValue',newValue);
    }

    return{
      getTotalCountRecords  :     getTotalCountRecords,
      getTotalDist          :     getTotalDist,
      getBigCurrentPage     :     getBigCurrentPage,
      setBigCurrentPage     :     setBigCurrentPage,
      setValue:                   setValue
    }
  }
})();
