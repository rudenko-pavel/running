(function() {
  'use strict';

  angular
    .module('running')
    .controller('DepozitController', MainController);

  /** @ngInject */
  function MainController($http,$scope) {
    var vm = this;

    /* HELPER
      vm.currentPlan          - вид депозита
      vm.stepsRateArrayMonths - Строк(міс.)
      vm.stepsRateArrayRate   - розмір відсотків
      vm.sum.value            - сума
      vm.sumAdd.value         - Щомісячне поповнення
      vm.prolongation.value   - Кількість продовжень
      vm.percentsPath         - Відсотки (false - "До вкладу", true - "На картку")
      vm.tax                  - Податок (false - "Без урахування", true - "З урахуванням")
      vm.rateYear.value       - актуальний строк депозита

      vm.getRateValue         - получение размера процентов +"%";  
      vm.getLengthRate        - получение количества возможных сроков депозита
      vm.sumAllAdd            - сума усіх щомісячних поповнень
      vm.investments          - сума усіх вкладених коштів
      vm.investmentsPercents  - сума получених відсотків

      vm.createCanvas         - рисуем график
      vm.allProlongation      - сума усіх поповнень

    */

    vm.promise = $http.get('assets/data.json');
    vm.promise.success(function(data) {
      vm.remoteData       = data;
      vm.plan             = vm.remoteData.depozitPlan;    
      vm.rates            = vm.remoteData.depozitRates;
    });
    vm.currentPlan = 2;
    vm.rate = 3;
    vm.continue = 5;
    vm.choiceContinue=0;

    vm.getRateValue                  = getRateValue; 
    vm.getLengthRate                 = getLengthRate;
    vm.sumAllAdd                     = sumAllAdd;
    vm.investments                   = investments;
    vm.investmentsPercents           = investmentsPercents;
    vm.createCanvas                  = createCanvas;
    vm.allProlongation               = allProlongation;
    vm.allMoney                      = allMoney;
  
  vm.stepsRateArray = [
    {"months":1,    "rate":9},
    {"months":3,    "rate":10.5},
    {"months":6,    "rate":11},
    {"months":12,   "rate":12.5}
  ];
  vm.stepsRateArrayMonths = [1,3,6,12];
  vm.stepsRateArrayRate = [9,10.5,11,12.5];

  vm.rateYear = {
    value: 3,
    options: {    
      showSelectionBar: true,
      translate: function(value) {
        return value+' міс.';
      },
      stepsArray: vm.stepsRateArrayMonths,
          showTicksValues: true/*,
          ticksValuesTooltip: function (v) {
              return vm.stepsRateArrayMonths[v]+' months ' + v;
          }*/
    }
  };

  vm.sum = {
    value: 5000,
    options: {
      floor: 1000,
      showSelectionBar: true,
      ceil: 100000,
      readOnly: false
    }
  };
  vm.sumAdd = {
    value: 500,
    options: {
      showSelectionBar: true,
      floor: 100,
      ceil: 5000,
      readOnly: false
    }
  };

  vm.prolongation = {
    value: 0,
    options: {
      showSelectionBar: true,
      ceil: 5,
      floor: 0
    }
  };

  vm.percentsPath = true;
  vm.tax = true;

    vm.txt1 = "DEPO-ZIT";


    function getRateValue(item){
      var result;
      for (var i=0; i<vm.stepsRateArray.length; i++){
        if (item == vm.stepsRateArray[i].months) {
          result = vm.stepsRateArray[i].rate +"%" ;
        }
      }
      return result;
    }

    function getLengthRate(){
      return vm.stepsRateArray.length;
    }

    function sumAllAdd(){
      var result;
      result = vm.sumAdd.value*(vm.rateYear.value-1);
      return result;
    }

    function investments(){
      var result;
      result = vm.sum.value + vm.sumAdd.value*vm.rateYear.value;
      return result; 
    }

    function investmentsPercents(){
      var result;
      var percent = (vm.getRateValue(vm.rateYear.value).slice(0, -1))/100;
      var part1 = vm.sum.value*percent/12*vm.rateYear.value; // сума * річну відсоткову ставку / кількість місяців у році* тривалість депозиту
      var part2 = vm.sumAdd.value*percent/12;                // місячний відсоток на щомісячне поповнення
      var percentFromSumAdd = 0;                             // відсотки на відсотки 
      var allPercents = 0;
      for (var i=1; i<vm.rateYear.value; i++){
        percentFromSumAdd = percentFromSumAdd + part2*i;
      }
      allPercents = part1 + percentFromSumAdd;
      result = allPercents;
      return result;   
    }
    
    function allMoney(){
      var result;
      result = vm.investmentsPercents() + vm.investments();
      return result; 
    }

    function allProlongation(){
      var result;
      result = vm.sumAdd.value*(vm.rateYear.value-1);
      return result; 
    }
    vm.chartLabels = ["Сума вкладу: ", "Сума поповнень: ", "Відсотки (дохід): "];

    vm.chartData = [vm.sum.value, vm.allProlongation(), vm.investmentsPercents()];
    vm.chartOptions = {
      legend: {
        display: false,
        position: 'bottom'
      },
      cutoutPercentage: 60,
      tooltipEvents: [],
      tooltipCaretSize: 0,
      showTooltips: true,
      onAnimationComplete: function() {
        self.showTooltip(self.segments, true);
      }
    }

    function createCanvas(){
      vm.chartData = [vm.sum.value,  vm.allProlongation(), vm.investmentsPercents()];
    }

    $scope.$watchCollection('[depozit.sum.value,depozit.sumAdd.value,depozit.rateYear.value]', function () {
      createCanvas();
    });
  }
})();
