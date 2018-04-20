(function() {
  'use strict';

  angular
    .module('running')
    .controller('ConversionController', MainController);

  /** @ngInject */
  function MainController($log, $filter) {
    var vm = this;
    vm.submit                 = "CONVERSION";
    vm.date                   = "DATE";
    vm.timestamp;
    vm.humanDate2;
    vm.timestamp2;
    vm.dateSelect;
    // 2,8,10,16
    vm.startNumber;
    vm.targetNumber;

    vm.selectFormat = [
      {id:  1, title : 'binary' , value : 2   },
      {id:  2, title : 'octal'  , value : 8   },
      {id:  3, title : 'decimal', value : 10  },
      {id:  4, title : 'hex'    , value : 16  }
    ];
    vm.isSelectedFormat = vm.selectFormat[2];
    vm.toSelectedFormat = vm.selectFormat[0];

    vm.groups = [
      { title: 'timestamp <--> Date()',     content: 'app/views/conversion/parts/timestamp.html'  },
      { title: 'parseInt(2,8,10,16)',       content: 'app/views/conversion/parts/decimal.html'                     }
  ];

    // FUNCTION DESCRIPTION
    vm.dateToTimestamp      = dateToTimestamp;
    vm.timestampToDate      = timestampToDate;
    vm.convertNumber        = convertNumber;
    vm.clearData            = clearData;

    // IMPLEMENTATION
    function dateToTimestamp(){
      vm.timestamp = (new Date(vm.dateSelect)).getTime();
    }

    function timestampToDate(){
      vm.humanDate2 = vm.timestamp2;
      vm.humanDate2 = $filter('date')(vm.timestamp2, 'yyyy-MM-dd HH:mm:ss');
    }

    function convertNumber(){
      vm.targetNumber = parseInt(vm.startNumber, parseInt(vm.isSelectedFormat.value)).toString(parseInt(vm.toSelectedFormat.value));
    }

    function clearData(){
      vm.startNumber = vm.targetNumber =  '';
    }

  }
})();
