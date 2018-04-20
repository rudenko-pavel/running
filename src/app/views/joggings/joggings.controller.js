(function() {
  'use strict';

  angular
    .module('running')
    .controller('JoggingsController', MainController);

  /** @ngInject */
  function MainController($http, $log, $location, $filter, $timeout, recordsFactory) {
    var vm = this;
    vm.joggingsTxt  = "JOGGINGS";
    vm.summaryTxt   = "SUMMARY";
    vm.time         = "TIME";
    vm.from         = "FROM";
    vm.till         = "TILL";
    vm.joggiPart    = 'app/views/joggings/parts/joggi.html';
    vm.summaryPart  = 'app/views/joggings/parts/summary.html';
    vm.partView     = vm.joggiPart;                      // default value for view
    vm.partViewFlag = true;                             // true - view joggiPart, false - view summaryPart
    vm.dropdownView = false;
    vm.filterDistanceMin = 0;
    vm.filterDistanceMax = 1000000;

    vm.sliderModel = 1;
    vm.sliderHigh = 10;
    vm.sliderOptions = {floor:vm.sliderModel, ceil:vm.sliderHigh, showTicksValues:true};


    $http.get('assets/data.json').success(function(data) {
      vm.remoteData             = data;
      vm.joggings               = vm.remoteData.joggings;
      vm.totalRecords          = recordsFactory.getTotalCountRecords();      // runnings count
      vm.totalDist             = recordsFactory.getTotalDist();              // total running distance
    });


    // FUNCTION DESCRIPTION
    vm.joggiPartFunc          = joggiPartFunc;   // return joggi.html
    vm.summaryPartFunc        = summaryPartFunc; // return summary.html

    vm.isSelected             = isSelected;

    vm.lessThen500            = lessThen500;

    vm.isCompetition          = isCompetition;
    vm.totalTm                = totalTm;            // total running time



    // IMPLEMENTATION
    function joggiPartFunc(){
      vm.partView = vm.joggiPart;
      vm.partViewFlag = true;
      $location.path('/joggings');
    }

    function summaryPartFunc(){
      vm.partView = vm.summaryPart;
      vm.partViewFlag = false;
    }

    function isSelected (item) {
      return vm.selected === item;
    }

    function lessThen500(item){
      return item.lessThen500;
    }



    function isCompetition(id){
      if (angular.isDefined(vm.joggings)){
        var result;
        for (var i=0; i<vm.joggings.length; i++){
          vm.joggings[i].id == id ? result = vm.joggings[i].isCompetition :'';
        }
        return result;
      }
    }


    function totalTm(){
      if (angular.isDefined(vm.joggings)){
        var result=0;
        for (var i=0; i<vm.joggings.length; i++){
           result += vm.joggings[i].time;
        }
        return result;
      }
    }

  }
})();
