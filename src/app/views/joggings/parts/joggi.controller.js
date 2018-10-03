(function() {
  'use strict';

  angular
    .module('running')
    .controller('JoggiController', MainController);

  /** @ngInject */
  function MainController($http, $log, $filter, $timeout, recordsFactory) {
    var vm = this;
    vm.bigCurrentPage     = recordsFactory.getBigCurrentPage();            // for paginator
    vm.paramSortBy = '-date';

    //md-datepicker
    vm.dateSelectFrom = new Date();
    vm.dateSelectTo   = new Date();
    vm.minDate;
    vm.maxDate;
    vm.onlyCompetitions = false;
    //http://plnkr.co/edit/kbZ7EI?p=preview

    vm.sliderModel = 1;
    vm.sliderHigh = 10;
    vm.sliderOptions = {floor:vm.sliderModel, ceil:vm.sliderHigh, showTicksValues:true};

    vm.promise = $http.get('assets/data.json');
    //console.log(vm.promise);
    vm.promise.success(function(data) {
      vm.remoteData             = data;
      vm.joggings               = vm.remoteData.joggings;
      vm.joggingsTh             = vm.remoteData.joggingsTh;
      vm.paginatorProperty      = vm.remoteData.paginatorProperty;
      vm.countSelectedRows    = recordsFactory.getTotalCountRecords();      // runnings count

      minDateFunc();
      maxDateFunc();
    });


    // FUNCTION DESCRIPTION
    vm.numPages                 = numPages;             // num pagen in paginator
    vm.currentItems             = currentItems;         // starting number for show items
    vm.changeSortBy             = changeSortBy;     // change field of sort
    vm.sortBy                   = sortBy;           // return field of sort
    vm.noSort                   = noSort            // add class 'no-sort'
    vm.upSort                   = upSort;
    vm.downSort                 = downSort;
    vm.intDistance              = intDistance;
    vm.realDistance             = realDistance;
    vm.intDistanceTime          = intDistanceTime;
    vm.countSelectedRecords     = countSelectedRecords;
    vm.countSelectedRecordsDistance = countSelectedRecordsDistance;
    vm.minDateFunc              = minDateFunc;
    vm.maxDateFunc              = maxDateFunc;
    vm.inRange                  = inRange;         // filter of races


    // IMPLEMENTATION
    function numPages(){
      if (angular.isDefined(vm.paginatorProperty)){
        var countRecords = recordsFactory.getTotalCountRecords();
        return Math.ceil (countRecords/vm.paginatorProperty[0].itemsPerPage);
      }
    }

    function currentItems(){
      if (angular.isDefined(vm.paginatorProperty)){
        var result;
        result = (vm.bigCurrentPage-1)*vm.paginatorProperty[0].itemsPerPage;
        return result;
      }
    }

    function changeSortBy(item){
      if (angular.isDefined(vm.joggingsTh)){                          // data.json is downloaded
        var negative = "-"+item.sortField;
        if (item.isSort == true){                                     // field participates in sorting
          if (vm.paramSortBy == item.sortField){                      // current sorting from big to small (vm.paramSortBy without `-`)
            vm.paramSortBy = negative;                                // change sorting to: from small to big
          } else if (vm.paramSortBy.substring(1) == item.sortField){
            vm.paramSortBy = item.sortField;
          } else {                                                    // param has `.` (calculated expression)
            vm.paramSortBy = negative;
          }
        } else{
          $log.info('field does not participates in sorting');
        }
        recordsFactory.setBigCurrentPage(1);
        vm.bigCurrentPage     = recordsFactory.getBigCurrentPage();
      }
    }

    function sortBy(item){
      var result;
      if(vm.paramSortBy.indexOf('.')<0){
        if (vm.paramSortBy.indexOf('-')<0)
          result = item[vm.paramSortBy];
        else
          result = item[vm.paramSortBy.substring(1)] - (2*item[vm.paramSortBy.substring(1)]);
      } else {
        if(vm.paramSortBy.indexOf('intDistanceTime')<0){
          if (vm.paramSortBy.indexOf('.')!=1)
            result = vm.intDistance(item.distance) - (2*vm.intDistance(item.distance));
          else
            result = vm.intDistance(item.distance);
        }
        if(vm.paramSortBy.indexOf('intDistanceTime')>0){
          if (vm.paramSortBy.indexOf('.')!=1)
            result = vm.intDistanceTime(item.id) - (2*vm.intDistanceTime(item.id));
          else
            result = vm.intDistanceTime(item.id);
        }
      }
      return result;
    }

    function noSort(item){
      return !item.isSort;
    }

    function upSort(item){
      var result;
      if(item.sortField == vm.paramSortBy){result=true;}
      return result;
    }

    function downSort(item){
      var result;
      if(item.sortField == vm.paramSortBy.substring(1)){result=true;}
      return result;
    }


    function intDistance(distance){
      return Math.floor(distance/1000);
    }

    function realDistance(distance){
      return distance;
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

    function countSelectedRecords(){
      if (angular.isDefined(vm.joggings)){
        var count = 0;
        var intDist;
        var dateRace;
        var dateSelectFrom      = (new Date(vm.dateSelectFrom)).getTime();
        var dateSelectTo        = (new Date(vm.dateSelectTo)).getTime();
        for (var i=0; i<vm.joggings.length; i++){
          intDist   = vm.intDistance(vm.joggings[i].distance);
          dateRace  = vm.joggings[i].date;
          if (intDist <= vm.sliderHigh && intDist >= vm.sliderModel &&
            dateRace <= dateSelectTo && dateRace >= dateSelectFrom ){ 
              if (vm.onlyCompetitions==true){
                if (vm.joggings[i].isCompetition!=false)
                  count++;
              }
              else  
                count++; 
            }
        }
        vm.countSelectedRows = count;
        return count;
      }
    }

    function countSelectedRecordsDistance(){
      if (angular.isDefined(vm.joggings)){
        var count = 0;
        var intDist;
        var realDistance;
        var dateRace;
        var dateSelectFrom      = (new Date(vm.dateSelectFrom)).getTime();
        var dateSelectTo        = (new Date(vm.dateSelectTo)).getTime();
        for (var i=0; i<vm.joggings.length; i++){
          intDist   = vm.intDistance(vm.joggings[i].distance);
          realDistance   = vm.realDistance(vm.joggings[i].distance);
          dateRace  = vm.joggings[i].date;
          if (intDist <= vm.sliderHigh && intDist >= vm.sliderModel &&
            dateRace <= dateSelectTo && dateRace >= dateSelectFrom ){ 
              if (vm.onlyCompetitions==true){
                if (vm.joggings[i].isCompetition!=false)
                count = count+realDistance;
              }  
              else   
                count = count+realDistance;
            }
        }

        return $filter('number')(count, 0) + " m.";
      }
    }

    function minDateFunc(){
      if (angular.isDefined(vm.joggings) && vm.joggings.length){
       var result = vm.joggings[0].date;
       for (var i=1; i<vm.joggings.length; i++){
         if(vm.joggings[i].date < result){
          result = vm.joggings[i].date;
         }
       }
       vm.minDate = vm.dateSelectFrom = new Date(parseInt(result));
     }
    }

    function maxDateFunc(){
      if (angular.isDefined(vm.joggings) && vm.joggings.length){
        var result = vm.joggings[0].date;
        for (var i=1; i<vm.joggings.length; i++){
          if(vm.joggings[i].date > result){
            result = vm.joggings[i].date;
          }
        }
        vm.maxDate = vm.dateSelectTo = new Date(parseInt(result));
      }
    }

    function inRange(item){
      var dateSelectFrom      = (new Date(vm.dateSelectFrom)).getTime();
      var dateSelectTo        = (new Date(vm.dateSelectTo)).getTime();
      var intDist             = vm.intDistance(item.distance);
      if (intDist <= vm.sliderHigh && intDist >= vm.sliderModel &&
        item.date <= dateSelectTo && item.date >= dateSelectFrom){ 
          if (vm.onlyCompetitions==true){
            if (item.isCompetition!=false)
              return item;
          }
          else
            return item; 
        }
    }

  }
})();
